import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

initializeApp();
const db = getFirestore();

function fillTemplate(template, data) {
  return template
    .replace(/\{orderId\}/g, data.orderId)
    .replace(/\{customerName\}/g, data.customerName)
    .replace(/\{customerPhone\}/g, data.customerPhone)
    .replace(/\{customerAddress\}/g, data.customerAddress)
    .replace(/\{paymentMethod\}/g, data.paymentMethod)
    .replace(/\{total\}/g, data.total)
    .replace(/\{items\}/g, data.items);
}

function buildItemsList(items) {
  return (items || []).map(i =>
    `• ${i.product.name} (${i.size} × ${i.quantity}) - ${(i.product.price * i.quantity).toLocaleString()} ج`
  ).join('\n');
}

const paymentLabels = {
  cash: '💰 كاش عند الاستلام',
  instapay: '💜 InstaPay',
  vodafone: '🔴 فودافون كاش',
};

async function sendWhatsAppMessage(token, phoneNumberId, to, message) {
  const url = `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: to.replace(/^\+|^00/, ''),
      type: 'text',
      text: { body: message },
    }),
  });
  return response.json();
}

export const sendOrderToWhatsApp = onDocumentCreated('orders/{orderId}', async (event) => {
  const order = event.data.data();
  const orderId = event.params.orderId;

  // Read site settings from Firestore
  const settingsSnap = await db.doc('settings/site').get();
  const settings = settingsSnap.data() || {};

  const token = settings.whatsappBusinessToken;
  const phoneNumberId = settings.whatsappPhoneNumberId;

  if (!token || !phoneNumberId) {
    console.log('⚠️ WhatsApp Business API not configured — skipping');
    return;
  }

  const itemsList = buildItemsList(order.items);
  const paymentLabel = paymentLabels[order.paymentMethod] || order.paymentMethod;

  const templateData = {
    orderId,
    customerName: order.userName || '',
    customerPhone: order.phone || '',
    customerAddress: order.address || '',
    paymentMethod: paymentLabel,
    total: (order.total || 0).toLocaleString(),
    items: itemsList,
  };

  // Send to admin
  const adminNumber = settings.whatsappNotificationNumber || settings.whatsappNumber;
  if (adminNumber) {
    const adminMsg = fillTemplate(settings.adminNotifyTemplate || '', templateData);
    try {
      const result = await sendWhatsAppMessage(token, phoneNumberId, adminNumber, adminMsg);
      console.log('✅ Admin notification sent:', result);
    } catch (err) {
      console.error('❌ Admin notification failed:', err.message);
    }
  }

  // Send to customer
  const customerNumber = order.phone;
  if (customerNumber && settings.customerNotifyTemplate) {
    const customerMsg = fillTemplate(settings.customerNotifyTemplate, templateData);
    try {
      const result = await sendWhatsAppMessage(token, phoneNumberId, customerNumber, customerMsg);
      console.log('✅ Customer confirmation sent:', result);
    } catch (err) {
      console.error('❌ Customer confirmation failed:', err.message);
    }
  }
});
