import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Category = 'رجالي' | 'حريمي' | 'أطفال' | 'رياضي' | 'اكسسوارات';
export type Size = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';

export interface Product {
  id: string;
  name: string;
  price: number;
  cost?: number;
  oldPrice?: number;
  category: Category;
  sizes: Size[];
  colors: string[];
  images: string[];
  description: string;
  stock: number;
  rating: number;
  reviews: Review[];
  featured: boolean;
  newArrival: boolean;
  createdAt: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  size: Size;
  color: string;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  address: string;
  phone: string;
  createdAt: string;
  paymentMethod: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'customer';
  avatar?: string;
  wishlist: string[];
  orders: string[];
  createdAt: string;
}

export interface SiteSettings {
  heroTitle: string;
  heroSubtitle: string;
  heroBtnText: string;
  heroBtn2Text: string;
  heroImages: string[];
  features: { title: string; desc: string; emoji: string }[];
  footerEmail: string;
  footerPhone: string;
  footerAddress: string;
  footerBrand: string;
  footerQuickLinks: { label: string; page: string }[];
  footerServiceLinks: { label: string; page: string }[];
  footerSocial: { icon: string; url: string }[];
  footerAbout: string;
  primaryColor: string;
  secondaryColor: string;
  showFeatures: boolean;
  showCategories: boolean;
  showFeatured: boolean;
  showNewArrivals: boolean;
  showSaleBanner: boolean;
  saleBannerBadge: string;
  saleBannerTitle: string;
  saleBannerSubtitle: string;
  saleBannerCoupon: string;
  saleBannerBtnText: string;
  saleBannerIcon: string;
  saleBannerColor: string;
}

export interface Customer {
  name: string;
  phone: string;
  address: string;
  city: string;
  notes: string;
  email?: string;
  orders: string[];
  createdAt: string;
}

interface StoreState {
  // Auth
  currentUser: User | null;
  users: User[];
  login: (email: string, password: string) => boolean;
  logout: () => void;
  register: (name: string, email: string, password: string) => boolean;
  updateUser: (user: User) => void;

  // Products
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  addReview: (productId: string, review: Review) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, size: Size, color: string, qty?: number) => void;
  removeFromCart: (productId: string, size: Size, color: string) => void;
  updateCartQty: (productId: string, size: Size, color: string, qty: number) => void;
  clearCart: () => void;

  // Wishlist
  toggleWishlist: (productId: string) => void;

  // Orders
  orders: Order[];
  placeOrder: (order: Omit<Order, 'id' | 'createdAt'>) => string;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;

  // UI
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  activePage: string;
  setActivePage: (page: string) => void;
  adminSection: string;
  setAdminSection: (section: string) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  notification: { message: string; type: 'success' | 'error' | 'info' } | null;
  showNotification: (message: string, type?: 'success' | 'error' | 'info') => void;
  // Site Settings
  siteSettings: SiteSettings;
  updateSiteSettings: (settings: Partial<SiteSettings>) => void;
  customers: Customer[];
  saveCustomer: (info: Customer) => void;
}

const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'قميص كاجوال كلاسيك',
    price: 299,
    oldPrice: 450,
    category: 'رجالي',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#ffffff', '#1a1a2e', '#4a90d9'],
    images: [
      'https://images.pexels.com/photos/5698851/pexels-photo-5698851.jpeg?auto=compress&cs=tinysrgb&w=600',
    ],
    description: 'قميص كاجوال أنيق مصنوع من القطن الخالص 100%، مثالي للإطلالات اليومية العصرية.',
    stock: 25,
    rating: 4.5,
    reviews: [],
    featured: true,
    newArrival: true,
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'فستان سهرة راقي',
    price: 850,
    oldPrice: 1200,
    category: 'حريمي',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['#c0392b', '#2c3e50', '#8e44ad'],
    images: [
      'https://images.pexels.com/photos/8311880/pexels-photo-8311880.jpeg?auto=compress&cs=tinysrgb&w=600',
    ],
    description: 'فستان سهرة فاخر بتصميم عصري يناسب المناسبات الخاصة والحفلات.',
    stock: 15,
    rating: 4.8,
    reviews: [],
    featured: true,
    newArrival: false,
    createdAt: '2024-01-20',
  },
  {
    id: '3',
    name: 'تراكسوت رياضي',
    price: 450,
    oldPrice: 600,
    category: 'رياضي',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['#27ae60', '#2980b9', '#e74c3c'],
    images: [
      'https://images.pexels.com/photos/5698851/pexels-photo-5698851.jpeg?auto=compress&cs=tinysrgb&w=600',
    ],
    description: 'تراكسوت رياضي عالي الجودة مصنوع من أقمشة تقنية تمتص العرق.',
    stock: 30,
    rating: 4.3,
    reviews: [],
    featured: false,
    newArrival: true,
    createdAt: '2024-02-01',
  },
  {
    id: '4',
    name: 'جاكيت جينز ترندي',
    price: 650,
    oldPrice: undefined,
    category: 'حريمي',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['#1a5276', '#7f8c8d'],
    images: [
      'https://images.pexels.com/photos/8386666/pexels-photo-8386666.jpeg?auto=compress&cs=tinysrgb&w=600',
    ],
    description: 'جاكيت جينز بتصميم عصري مناسب لجميع الأوقات.',
    stock: 20,
    rating: 4.6,
    reviews: [],
    featured: true,
    newArrival: true,
    createdAt: '2024-02-05',
  },
  {
    id: '5',
    name: 'بنطلون كاجوال للأطفال',
    price: 180,
    oldPrice: 250,
    category: 'أطفال',
    sizes: ['XS', 'S', 'M'],
    colors: ['#3498db', '#e74c3c', '#2ecc71'],
    images: [
      'https://images.pexels.com/photos/35045845/pexels-photo-35045845.jpeg?auto=compress&cs=tinysrgb&w=600',
    ],
    description: 'بنطلون كاجوال مريح للأطفال من أقمشة ناعمة وعالية الجودة.',
    stock: 40,
    rating: 4.2,
    reviews: [],
    featured: false,
    newArrival: false,
    createdAt: '2024-01-10',
  },
  {
    id: '6',
    name: 'حقيبة يد فاخرة',
    price: 1200,
    oldPrice: 1800,
    category: 'اكسسوارات',
    sizes: ['M'],
    colors: ['#8B4513', '#1a1a1a', '#c0c0c0'],
    images: [
      'https://images.pexels.com/photos/8307678/pexels-photo-8307678.jpeg?auto=compress&cs=tinysrgb&w=600',
    ],
    description: 'حقيبة يد فاخرة من الجلد الطبيعي بتصميم أنيق يناسب جميع المناسبات.',
    stock: 10,
    rating: 4.9,
    reviews: [],
    featured: true,
    newArrival: false,
    createdAt: '2024-01-25',
  },
  {
    id: '7',
    name: 'تيشرت أوفرسايز',
    price: 199,
    oldPrice: undefined,
    category: 'رجالي',
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: ['#ffffff', '#000000', '#e74c3c', '#3498db'],
    images: [
      'https://images.pexels.com/photos/5698851/pexels-photo-5698851.jpeg?auto=compress&cs=tinysrgb&w=600',
    ],
    description: 'تيشرت أوفرسايز عصري مريح للاستخدام اليومي والخروجات.',
    stock: 50,
    rating: 4.4,
    reviews: [],
    featured: false,
    newArrival: true,
    createdAt: '2024-02-10',
  },
  {
    id: '8',
    name: 'عباية تطريز ملكي',
    price: 950,
    oldPrice: 1400,
    category: 'حريمي',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#000000', '#2c3e50', '#6c3483'],
    images: [
      'https://images.pexels.com/photos/8387127/pexels-photo-8387127.jpeg?auto=compress&cs=tinysrgb&w=600',
    ],
    description: 'عباية فاخرة بتطريز يدوي ملكي من أجود أنواع الأقمشة.',
    stock: 12,
    rating: 4.7,
    reviews: [],
    featured: true,
    newArrival: false,
    createdAt: '2024-01-30',
  },
];

const defaultUsers: User[] = [
  {
    id: 'admin-1',
    name: 'المدير',
    email: 'admin@admin.com',
    password: '123456',
    role: 'admin',
    wishlist: [],
    orders: [],
    createdAt: new Date().toISOString().split('T')[0],
  },
  {
    id: 'user-1',
    name: 'أحمد محمد',
    email: 'ahmed@example.com',
    password: '123456',
    role: 'customer',
    wishlist: [],
    orders: [],
    createdAt: new Date().toISOString().split('T')[0],
  },
];

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      users: defaultUsers,
      products: sampleProducts,
      cart: [],
      orders: [],
      searchQuery: '',
      selectedCategory: 'الكل',
      activePage: 'home',
      adminSection: 'dashboard',
      isCartOpen: false,
      notification: null,
      customers: [],
      siteSettings: {
        heroTitle: 'أحدث صيحات الموضة في مكان واحد',
        heroSubtitle: 'تشكيلة واسعة من الملابس العصرية والإكسسوارات الفاخرة بأفضل الأسعار',
        heroBtnText: 'تسوق الآن',
        heroBtn2Text: 'تعرف علينا',
        heroImages: [],
        features: [
          { title: 'شحن سريع', desc: 'توصيل خلال 3-7 أيام عمل', emoji: '🚚' },
          { title: 'جودة عالية', desc: 'من أفضل الماركات العالمية', emoji: '🌟' },
          { title: 'دفع آمن', desc: 'طرق دفع متعددة ومشّفرة', emoji: '🔒' },
          { title: 'دعم 24 ساعة', desc: 'فريق خدمة العملاء جاهز', emoji: '💬' },
        ],
        footerEmail: 'info@warawear.com',
        footerPhone: '+201234567890',
        footerAddress: 'القاهرة، مصر',
        footerBrand: 'Wara Wear',
        footerAbout: 'متجرك الأول للأزياء العصرية. نقدم أرقى الملابس بأفضل الأسعار.',
        footerQuickLinks: [
          { label: 'الرئيسية', page: 'home' },
          { label: 'المتجر', page: 'shop' },
          { label: 'العروض', page: 'shop' },
          { label: 'من نحن', page: 'contact' },
        ],
        footerServiceLinks: [
          { label: 'تتبع الطلب', page: 'orders' },
          { label: 'الأسئلة الشائعة', page: 'contact' },
          { label: 'تواصل معنا', page: 'contact' },
        ],
        footerSocial: [
          { icon: '📘', url: '#' },
          { icon: '📸', url: '#' },
          { icon: '🐦', url: '#' },
          { icon: '▶️', url: '#' },
        ],
        primaryColor: '#f43f5e',
        secondaryColor: '#a855f7',
        showFeatures: true,
        showCategories: true,
        showFeatured: true,
        showNewArrivals: true,
        showSaleBanner: true,
        saleBannerBadge: 'عرض محدود الوقت',
        saleBannerTitle: 'تخفيض 40% على كل شيء!',
        saleBannerSubtitle: 'استخدم كود {coupon} عند الدفع',
        saleBannerCoupon: 'MODA40',
        saleBannerBtnText: 'تسوق الآن',
        saleBannerIcon: '🏷️',
        saleBannerColor: '#f97316',
      },

      login: (email, password) => {
        const state = get();
        let user = state.users.find(u => u.email === email && u.password === password && u.role === 'admin');
        if (!user) {
          set({ users: state.users.map(u => {
            if (u.id === 'admin-1' || u.email?.startsWith('admin')) {
              return { ...u, email: 'admin@admin.com', password: '123456', role: 'admin' };
            }
            return u;
          }) });
          user = get().users.find(u => u.email === email && u.password === password && u.role === 'admin');
        }
        if (user) {
          set({ currentUser: user });
          return true;
        }
        return false;
      },

      logout: () => set({ currentUser: null, activePage: 'home' }),

      register: () => false,

      updateUser: (user) => {
        set(state => ({
          users: state.users.map(u => u.id === user.id ? user : u),
          currentUser: state.currentUser?.id === user.id ? user : state.currentUser,
        }));
      },

      addProduct: (product) => set(state => ({ products: [...state.products, product] })),

      updateProduct: (product) =>
        set(state => ({ products: state.products.map(p => p.id === product.id ? product : p) })),

      deleteProduct: (id) =>
        set(state => ({ products: state.products.filter(p => p.id !== id) })),

      addReview: (productId, review) =>
        set(state => ({
          products: state.products.map(p =>
            p.id === productId
              ? {
                  ...p,
                  reviews: [...p.reviews, review],
                  rating: [...p.reviews, review].reduce((a, r) => a + r.rating, 0) / (p.reviews.length + 1),
                }
              : p
          ),
        })),

      addToCart: (product, size, color, qty = 1) => {
        const cart = get().cart;
        const existing = cart.find(
          i => i.product.id === product.id && i.size === size && i.color === color
        );
        if (existing) {
          set({
            cart: cart.map(i =>
              i.product.id === product.id && i.size === size && i.color === color
                ? { ...i, quantity: i.quantity + qty }
                : i
            ),
          });
        } else {
          set({ cart: [...cart, { product, quantity: qty, size, color }] });
        }
      },

      removeFromCart: (productId, size, color) =>
        set(state => ({
          cart: state.cart.filter(
            i => !(i.product.id === productId && i.size === size && i.color === color)
          ),
        })),

      updateCartQty: (productId, size, color, qty) =>
        set(state => ({
          cart: state.cart.map(i =>
            i.product.id === productId && i.size === size && i.color === color
              ? { ...i, quantity: qty }
              : i
          ),
        })),

      clearCart: () => set({ cart: [] }),

      toggleWishlist: (productId) => {
        const user = get().currentUser;
        if (!user) return;
        const inWishlist = user.wishlist.includes(productId);
        const updatedUser = {
          ...user,
          wishlist: inWishlist
            ? user.wishlist.filter(id => id !== productId)
            : [...user.wishlist, productId],
        };
        get().updateUser(updatedUser);
      },

      placeOrder: (order) => {
        const id = `${get().orders.length + 1}`;
        const itemsTotal = order.items.reduce((a, i) => a + i.product.price * i.quantity, 0);
        const shipping = itemsTotal >= 500 ? 0 : 50;
        const newOrder: Order = {
          ...order,
          total: itemsTotal + shipping,
          id,
          createdAt: new Date().toISOString().split('T')[0],
        };
        set(state => {
          const user = state.users.find(u => u.id === order.userId);
          const updatedUsers = user
            ? state.users.map(u =>
                u.id === order.userId ? { ...u, orders: [...u.orders, id] } : u
              )
            : state.users;
          const updatedProducts = state.products.map(p => {
            const orderedItem = order.items.find(i => i.product.id === p.id);
            if (orderedItem) {
              return { ...p, stock: Math.max(0, p.stock - orderedItem.quantity) };
            }
            return p;
          });
          return {
            orders: [...state.orders, newOrder],
            users: updatedUsers,
            products: updatedProducts,
            currentUser:
              state.currentUser?.id === order.userId
                ? { ...state.currentUser, orders: [...(state.currentUser.orders || []), id] }
                : state.currentUser,
          };
        });
        return id;
      },

      updateOrderStatus: (orderId, status) =>
        set(state => ({
          orders: state.orders.map(o => o.id === orderId ? { ...o, status } : o),
        })),

      setSearchQuery: (q) => set({ searchQuery: q }),
      setSelectedCategory: (cat) => set({ selectedCategory: cat }),
      setActivePage: (page) => set({ activePage: page }),
      setAdminSection: (section) => set({ adminSection: section }),
      setIsCartOpen: (open) => set({ isCartOpen: open }),
      showNotification: (message, type = 'success') => {
        set({ notification: { message, type } });
        setTimeout(() => set({ notification: null }), 3000);
      },

      updateSiteSettings: (settings) =>
        set(state => ({ siteSettings: { ...state.siteSettings, ...settings } })),

      saveCustomer: (info) => {
        set(state => {
          const exists = state.customers.find(c => c.phone === info.phone);
          if (exists) {
            return {
              customers: state.customers.map(c =>
                c.phone === info.phone
                  ? { ...c, orders: [...new Set([...c.orders, ...info.orders])], name: info.name, address: info.address, city: info.city }
                  : c
              ),
            };
          }
          return { customers: [...state.customers, info] };
        });
      },
    }),
    {
      name: 'wara-wear-storage',
      version: 2,
      migrate: (persisted: any) => {
        if (!persisted.siteSettings?.footerQuickLinks) {
          persisted.siteSettings = {
            ...persisted.siteSettings,
            footerAbout: persisted.siteSettings?.footerAbout || 'متجرك الأول للأزياء العصرية. نقدم أرقى الملابس بأفضل الأسعار.',
            footerQuickLinks: persisted.siteSettings?.footerQuickLinks || [
              { label: 'الرئيسية', page: 'home' },
              { label: 'المتجر', page: 'shop' },
              { label: 'العروض', page: 'shop' },
              { label: 'من نحن', page: 'contact' },
            ],
            footerServiceLinks: persisted.siteSettings?.footerServiceLinks || [
              { label: 'تتبع الطلب', page: 'orders' },
              { label: 'الأسئلة الشائعة', page: 'contact' },
              { label: 'تواصل معنا', page: 'contact' },
            ],
            footerSocial: persisted.siteSettings?.footerSocial || [
              { icon: '📘', url: '#' },
              { icon: '📸', url: '#' },
              { icon: '🐦', url: '#' },
              { icon: '▶️', url: '#' },
            ],
          };
        }
        if (!persisted.siteSettings?.saleBannerTitle) {
          persisted.siteSettings = {
            ...persisted.siteSettings,
            saleBannerBadge: persisted.siteSettings?.saleBannerBadge || 'عرض محدود الوقت',
            saleBannerTitle: persisted.siteSettings?.saleBannerTitle || 'تخفيض 40% على كل شيء!',
            saleBannerSubtitle: persisted.siteSettings?.saleBannerSubtitle || 'استخدم كود {coupon} عند الدفع',
            saleBannerCoupon: persisted.siteSettings?.saleBannerCoupon || 'MODA40',
            saleBannerBtnText: persisted.siteSettings?.saleBannerBtnText || 'تسوق الآن',
            saleBannerIcon: persisted.siteSettings?.saleBannerIcon || '🏷️',
            saleBannerColor: persisted.siteSettings?.saleBannerColor || '#f97316',
          };
        }
        if (persisted.users) {
          persisted.users = persisted.users.map((u: any) => {
            if (u.email === 'admin@warawear.com') { u.email = 'admin@admin.com'; u.password = '123456'; }
            if (!u.role) u.role = 'admin';
            return u;
          });
        }
        return persisted as any;
      },
      partialize: (state) => ({
        currentUser: state.currentUser,
        users: state.users,
        products: state.products,
        cart: state.cart,
        orders: state.orders,
        customers: state.customers,
        siteSettings: state.siteSettings,
      }),
      onRehydrateStorage: () => () => {
        const s = useStore.getState();
        s.users = s.users.map((u: any) => {
          if (u.id === 'admin-1' || u.email?.includes('admin') || u.role === 'admin') {
            return { ...u, email: 'admin@admin.com', password: '123456', role: 'admin', id: 'admin-1', name: u.name || 'المدير' };
          }
          if (!u.role) u.role = 'customer';
          return u;
        });
        const hasAdmin = s.users.some((u: any) => u.role === 'admin' && u.email === 'admin@admin.com');
        if (!hasAdmin) {
          s.users.push({ id: 'admin-1', name: 'المدير', email: 'admin@admin.com', password: '123456', role: 'admin', wishlist: [], orders: [], createdAt: new Date().toISOString().split('T')[0] });
        }
        useStore.setState({ users: [...s.users], activePage: 'home' });
      },
    }
  )
);
