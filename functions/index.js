import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

initializeApp();
const db = getFirestore();

export const sendOrderToTelegram = onDocumentCreated('orders/{orderId}', async (event) => {
  const order = event.data.data();
  const orderId = event.params.orderId;

  // Read site settings from Firestore (telegram bot token + chat id)
  const settingsSnap = await db.doc('settings/site').get();
  const settings = settingsSnap.data() || {};

  const token = settings.telegramToken;
  const chatId = settings.telegramChatId;

  if (!token || !chatId) {
    console.log('❌ Telegram bot not configured (set telegramToken + telegramChatId in settings)');
    return;
  }

  // Build order items list
  const itemsList = (order.items || []).map(i =>
    `• ${i.product.name} (${i.size} × ${i.quantity}) - ${(i.product.price * i.quantity).toLocaleString()} ج`
  ).join('\n');

  const paymentLabels = {
    cash: '💰 كاش عند الاستلام',
    instapay: '💜 InstaPay',
    vodafone: '🔴 فودافون كاش',
  };

  const paymentLabel = paymentLabels[order.paymentMethod] || order.paymentMethod;

  // Telegram supports MarkdownV2 – but simple markdown works without escaping
  const message = `🛍 <b>طلب جديد #${orderId}</b>
━━━━━━━━━━━━━━━
👤 <b>العميل:</b> ${order.userName}
📞 <b>التليفون:</b> ${order.phone}
📍 <b>العنوان:</b> ${order.address}
📧 <b>الإيميل:</b> ${order.userEmail || '—'}
💳 <b>الدفع:</b> ${paymentLabel}
💰 <b>الإجمالي:</b> ${order.total.toLocaleString()} ج
━━━━━━━━━━━━━━━
<b>المنتجات:</b>
${itemsList}
━━━━━━━━━━━━━━━
✅ تم تقديم الطلب بنجاح`;

  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });
    const result = await response.json();
    if (result.ok) {
      console.log('✅ Telegram message sent');
    } else {
      console.error('❌ Telegram API error:', result);
    }
  } catch (error) {
    console.error('❌ Telegram request failed:', error.message);
  }
});
