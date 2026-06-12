import { useState, useEffect } from 'react';
import { useStore } from './store/useStore';
import { loadSettings, subscribeSettings } from './lib/settingsService';
import { loadAllOrdersFromFirestore, loadUnreadIdsFromFirestore, listenOrders, listenUnreadIds } from './lib/ordersService';
import { loadAllProducts, listenProducts, saveAllProducts } from './lib/productsService';
import Navbar from './components/Navbar';
import Cart from './components/Cart';
import Notification from './components/Notification';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import WishlistPage from './pages/WishlistPage';
import ProfilePage from './pages/ProfilePage';

export default function App() {
  const { activePage, siteSettings } = useStore();

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--primary', siteSettings.primaryColor);
    root.style.setProperty('--secondary', siteSettings.secondaryColor);
  }, [siteSettings.primaryColor, siteSettings.secondaryColor]);

  // Load settings from Firestore on mount
  useEffect(() => {
    loadSettings().then((remote) => {
      if (remote) {
        useStore.setState({ siteSettings: { ...siteSettings, ...remote } });
      }
    });
  }, []);

  // Real-time sync: listen for Firestore changes from other devices
  useEffect(() => {
    const unsub = subscribeSettings((remote) => {
      useStore.setState({ siteSettings: { ...useStore.getState().siteSettings, ...remote } });
    });
    return unsub;
  }, []);

  // Load orders from Firestore on mount
  useEffect(() => {
    loadAllOrdersFromFirestore().then((remoteOrders) => {
      if (remoteOrders.length > 0) {
        useStore.setState({ orders: remoteOrders });
      }
    });
    loadUnreadIdsFromFirestore().then((ids) => {
      if (ids.length > 0) {
        useStore.setState({ unreadOrderIds: ids });
      }
    });
  }, []);

  // Load products from Firestore on mount (seed from localStorage if empty)
  useEffect(() => {
    loadAllProducts().then((remoteProducts) => {
      const local = useStore.getState().products;
      if (remoteProducts && remoteProducts.length > 0) {
        useStore.setState({ products: remoteProducts });
      } else if (local.length > 0) {
        saveAllProducts(local);
      }
    });
  }, []);

  // Listen for product changes from Firestore (cross-device)
  useEffect(() => {
    const unsub = listenProducts((remoteProducts) => {
      useStore.setState({ products: remoteProducts });
    });
    return unsub;
  }, []);

  // Listen for new orders from Firestore (cross-device)
  useEffect(() => {
    const unsubOrders = listenOrders((remoteOrders) => {
      useStore.setState({ orders: remoteOrders });
    });
    const unsubUnread = listenUnreadIds((ids) => {
      useStore.setState({ unreadOrderIds: ids });
    });
    return () => { unsubOrders(); unsubUnread(); };
  }, []);

  // Cross-tab sync: listen for localStorage changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'wara-wear-storage' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          const newOrders = parsed?.state?.orders;
          const newUnread = parsed?.state?.unreadOrderIds;
          if (newOrders || newUnread) {
            useStore.setState(state => ({
              orders: newOrders || state.orders,
              unreadOrderIds: newUnread || state.unreadOrderIds,
            }));
          }
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const renderPage = () => {
    if (activePage.startsWith('product-')) {
      const productId = activePage.replace('product-', '');
      return <ProductDetailPage productId={productId} />;
    }
    switch (activePage) {
      case 'home': return <HomePage />;
      case 'shop': return <ShopPage />;
      case 'checkout': return <CheckoutPage />;
      case 'orders': return <OrdersPage />;
      case 'admin': return <AdminPage />;
      case 'login': return <LoginPage />;
      case 'wishlist': return <WishlistPage />;
      case 'profile': return <ProfilePage />;
      case 'contact': return <ContactPage />;
      default: return <HomePage />;
    }
  };

  return (
    <div className="font-cairo" dir="rtl">
      <style>{`
        :root { --primary: ${siteSettings.primaryColor}; --secondary: ${siteSettings.secondaryColor}; }
        .text-pink-500, .text-pink-600, .hover\\:text-pink-600:hover, .text-pink-400 { color: var(--primary) !important; }
        .bg-pink-500 { background-color: var(--primary) !important; }
        .bg-pink-50 { background-color: color-mix(in srgb, var(--primary) 10%, transparent) !important; }
        .bg-pink-100 { background-color: color-mix(in srgb, var(--primary) 20%, transparent) !important; }
        .border-pink-500 { border-color: var(--primary) !important; }
        .from-pink-500 { --tw-gradient-from: var(--primary) !important; }
        .to-pink-500 { --tw-gradient-to: var(--primary) !important; }
        .via-purple-600 { --tw-gradient-via: var(--secondary) !important; }
        .to-purple-600 { --tw-gradient-to: var(--secondary) !important; }
        .from-pink-400 { --tw-gradient-from: var(--primary) !important; }
        .to-purple-500 { --tw-gradient-to: var(--secondary) !important; }
        .from-pink-50 { --tw-gradient-from: color-mix(in srgb, var(--primary) 10%, transparent) !important; }
        .to-purple-50 { --tw-gradient-to: color-mix(in srgb, var(--secondary) 10%, transparent) !important; }
        .shadow-pink-200 { box-shadow: 0 4px 6px -1px color-mix(in srgb, var(--primary) 30%, transparent) !important; }
        .ring-pink-300 { --tw-ring-color: color-mix(in srgb, var(--primary) 60%, transparent) !important; }
        .shadow-pink-500\\/20 { box-shadow: 0 4px 6px -1px color-mix(in srgb, var(--primary) 20%, transparent) !important; }
        .hover\\:bg-pink-50:hover { background-color: color-mix(in srgb, var(--primary) 10%, transparent) !important; }
        .hover\\:border-pink-300:hover { border-color: color-mix(in srgb, var(--primary) 60%, transparent) !important; }
        .hover\\:bg-pink-600:hover { background-color: color-mix(in srgb, var(--primary) 80%, #000) !important; }
        .hover\\:text-pink-500:hover { color: var(--primary) !important; }
        .hover\\:text-pink-400:hover { color: var(--primary) !important; }
        .hover\\:bg-pink-100:hover { background-color: color-mix(in srgb, var(--primary) 20%, transparent) !important; }
        .accent-pink-500 { accent-color: var(--primary) !important; }
        .fill-pink-500 { fill: var(--primary) !important; }
      `}</style>
      <Notification />
      {activePage !== 'admin' && <Navbar />}
      {activePage === 'admin' && <AdminNavbar />}
      <Cart />
      <main>
        {renderPage()}
      </main>
    </div>
  );
}

function AdminNavbar() {
  const { setActivePage, logout } = useStore();
  return (
    <div className="bg-gray-900 text-white px-6 py-3 flex items-center justify-between sticky top-0 z-30 md:hidden">
      <span className="font-black font-cairo text-sm">لوحة التحكم</span>
      <div className="flex items-center gap-3">
        <button onClick={() => setActivePage('home')} className="text-xs text-gray-400 font-cairo hover:text-white">
          العودة للمتجر
        </button>
        <button onClick={logout} className="text-xs text-red-400 font-cairo hover:text-red-300">
          خروج
        </button>
      </div>
    </div>
  );
}

function ContactPage() {
  const { showNotification, siteSettings } = useStore();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    showNotification('تم إرسال رسالتك بنجاح! سنرد عليك قريباً 📩');
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16" dir="rtl">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-black text-gray-900 font-cairo">تواصل معنا</h1>
          <p className="text-gray-500 font-cairo mt-2">نحن هنا لمساعدتك في أي وقت</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            {[
              { emoji: '📞', title: 'اتصل بنا', value: '01000000000', sub: 'السبت - الخميس, 9ص - 9م' },
              { emoji: '✉️', title: 'راسلنا', value: 'info@warawear.com', sub: 'رد خلال 24 ساعة' },
              { emoji: '📍', title: 'موقعنا', value: 'القاهرة، مصر', sub: 'شارع التحرير، وسط البلد' },
              { emoji: '💬', title: 'واتساب', value: siteSettings.whatsappNumber || '01000000000', sub: 'متاح 24/7' },
            ].map(c => (
              <div key={c.title} className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-100">
                <span className="text-3xl">{c.emoji}</span>
                <div>
                  <p className="font-bold text-gray-900 font-cairo">{c.title}</p>
                  <p className="text-pink-600 font-cairo text-sm font-medium">{c.value}</p>
                  <p className="text-gray-400 font-cairo text-xs">{c.sub}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-black text-gray-900 font-cairo mb-4">أرسل لنا رسالة</h2>
            {sent ? (
              <div className="text-center py-8">
                <span className="text-5xl">📩</span>
                <p className="mt-4 font-bold text-gray-900 font-cairo">تم إرسال رسالتك!</p>
                <p className="text-gray-500 font-cairo text-sm mt-1">سنرد عليك في أقرب وقت</p>
                <button onClick={() => setSent(false)} className="mt-4 text-pink-500 font-cairo text-sm hover:text-pink-600">إرسال رسالة أخرى</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="اسمك" required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-cairo focus:outline-none focus:ring-2 focus:ring-pink-300" />
                <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="بريدك الإلكتروني" required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-cairo focus:outline-none focus:ring-2 focus:ring-pink-300" />
                <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="رسالتك..." rows={4} required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-cairo focus:outline-none focus:ring-2 focus:ring-pink-300 resize-none" />
                <button type="submit" className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-bold font-cairo hover:shadow-lg transition-all">
                  إرسال الرسالة
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


