import { useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { useStore } from './store/useStore';
import { sanitizeProductImages, STORAGE_KEY } from './store/useStore';
import type { Customer } from './store/useStore';
import { loadSettings, subscribeSettings } from './lib/settingsService';
import { loadAllOrdersFromFirestore, loadUnreadIdsFromFirestore, listenOrders, listenUnreadIds, loadCustomersFromFirestore, listenCustomers } from './lib/ordersService';
import { loadAllProducts, listenProducts, saveAllProducts } from './lib/productsService';
import { toWhatsAppNumber, whatsappLink } from './lib/phone';

function mergeCustomers(local: Customer[], remote: Customer[]): Customer[] {
  const localPhones = new Set(local.map(c => c.phone));
  const merged = [...local];
  for (const rc of remote) {
    if (!localPhones.has(rc.phone)) {
      merged.push(rc);
    }
  }
  return merged;
}
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

  // Load products from Firestore on mount
  useEffect(() => {
    loadAllProducts().then((remote) => {
      if (!remote) return;
      const localTs = useStore.getState().productsUpdatedAt;
      if (remote.updatedAt > localTs) {
        useStore.setState({ products: sanitizeProductImages(remote.products), productsUpdatedAt: remote.updatedAt });
      }
    });
  }, []);

  // Listen for product changes from Firestore (cross-device)
  useEffect(() => {
    const unsub = listenProducts((remote) => {
      const localTs = useStore.getState().productsUpdatedAt;
      if (remote.updatedAt > localTs) {
        useStore.setState({ products: sanitizeProductImages(remote.products), productsUpdatedAt: remote.updatedAt });
      }
    });
    return unsub;
  }, []);

  // Fallback: poll Firestore every 15s in case onSnapshot fails silently
  useEffect(() => {
    const interval = setInterval(() => {
      loadAllProducts().then((remote) => {
        if (!remote) return;
        const localTs = useStore.getState().productsUpdatedAt;
        if (remote.updatedAt > localTs) {
          useStore.setState({ products: sanitizeProductImages(remote.products), productsUpdatedAt: remote.updatedAt });
        }
      }).catch(() => {});
    }, 15000);
    return () => clearInterval(interval);
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

  // Load customers from Firestore on mount
  useEffect(() => {
    loadCustomersFromFirestore().then((remote) => {
      if (remote.length > 0) {
        useStore.setState(s => ({ customers: mergeCustomers(s.customers, remote) }));
      }
    });
  }, []);

  // Listen for customer changes from Firestore (cross-device)
  useEffect(() => {
    const unsub = listenCustomers((remote) => {
      useStore.setState(s => ({ customers: mergeCustomers(s.customers, remote) }));
    });
    return unsub;
  }, []);

  // Cross-tab sync: listen for localStorage changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
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
  const { siteSettings } = useStore();
  const whatsappNumber = toWhatsAppNumber(siteSettings.whatsappNumber);
  const contactCards = [
    { emoji: '💬', title: 'واتساب', value: siteSettings.whatsappNumber || '01000000000', sub: 'متاح يومياً - رد فوري', href: whatsappNumber ? `https://wa.me/${whatsappNumber}` : undefined },
    { emoji: '📞', title: 'اتصل بنا', value: siteSettings.footerPhone || '01000000000', sub: 'السبت - الخميس, 9ص - 9م', href: `tel:${siteSettings.footerPhone || ''}` },
    { emoji: '📍', title: 'موقعنا', value: siteSettings.footerAddress || 'القاهرة، مصر', sub: 'شارع التحرير، وسط البلد' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-16" dir="rtl">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-black text-gray-900 font-cairo">تواصل معنا</h1>
          <p className="text-gray-500 font-cairo mt-2">نحن هنا لمساعدتك في أي وقت</p>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 p-8 text-center shadow-sm">
          <span className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-50 text-4xl mb-5">💬</span>
          <h2 className="text-2xl font-black text-gray-900 font-cairo mb-2">راسلنا على واتساب</h2>
          <p className="text-gray-500 font-cairo mb-8 max-w-md mx-auto">
            اضغط الزر بالأسفل وسيتم فتح محادثة واتساب مباشرة معنا. أسرع طريقة للرد على استفساراتك ومتابعة طلبك.
          </p>
          {whatsappNumber ? (
            <a
              href={whatsappLink(whatsappNumber, 'مرحباً، عايز أستفسر عن منتجاتكم')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 px-10 py-4 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-black font-cairo text-lg shadow-lg hover:shadow-xl transition-all"
            >
              <MessageCircle className="w-6 h-6" />
              تواصل معنا الآن
            </a>
          ) : (
            <p className="text-sm text-red-500 font-cairo">لم يتم إضافة رقم واتساب بعد</p>
          )}
          <p className="text-xs text-gray-400 font-cairo mt-4" dir="ltr">{siteSettings.whatsappNumber}</p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mt-8">
          {contactCards.map(c => {
            const inner = (
              <>
                <span className="text-2xl flex-shrink-0">{c.emoji}</span>
                <div className="text-right">
                  <p className="font-bold text-gray-900 font-cairo text-sm">{c.title}</p>
                  <p className="text-pink-600 font-cairo text-sm font-medium" dir="ltr">{c.value}</p>
                  <p className="text-gray-400 font-cairo text-[11px]">{c.sub}</p>
                </div>
              </>
            );
            return c.href ? (
              <a
                key={c.title}
                href={c.href}
                target={c.href.startsWith('http') ? '_blank' : undefined}
                rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="flex items-center gap-3 bg-white p-4 rounded-xl border border-gray-100 hover:border-pink-200 transition-all"
              >
                {inner}
              </a>
            ) : (
              <div key={c.title} className="flex items-center gap-3 bg-white p-4 rounded-xl border border-gray-100">
                {inner}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
