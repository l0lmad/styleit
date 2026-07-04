import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart, Heart, Search, User, Menu, X, Shield, LogOut, Package, Home, Tag, Phone
} from 'lucide-react';
import { useStore } from '../store/useStore';


export default function Navbar() {
  const {
    currentUser, logout, cart, setActivePage, activePage,
    setSearchQuery, searchQuery, setIsCartOpen, isCartOpen, siteSettings,
  } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const cartCount = cart.reduce((a, i) => a + i.quantity, 0);
  const wishlistCount = currentUser?.wishlist?.length || 0;

  const navItems = [
    { key: 'home', label: 'الرئيسية', icon: <Home className="w-4 h-4" /> },
    { key: 'shop', label: 'المتجر', icon: <Tag className="w-4 h-4" /> },
    { key: 'orders', label: 'طلباتي', icon: <Package className="w-4 h-4" /> },
    { key: 'contact', label: 'تواصل معنا', icon: <Phone className="w-4 h-4" /> },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setActivePage('home')}
            className="flex items-center gap-2"
          >
            <span className="text-2xl font-black font-cairo tracking-wide">
              <span style={{ color: siteSettings.primaryColor }}>Style</span>
              <span style={{ color: siteSettings.secondaryColor }}> It</span>
            </span>
          </motion.button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <button
                key={item.key}
                onClick={() => setActivePage(item.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all font-cairo ${
                  activePage === item.key
                    ? 'text-white'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
                style={activePage === item.key ? { backgroundColor: siteSettings.primaryColor, color: 'white' } : undefined}
              >
                {item.label}
              </button>
            ))}
            {currentUser?.role === 'admin' && (
              <button
                onClick={() => setActivePage('admin')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all font-cairo ${
                  activePage === 'admin' ? 'bg-purple-50 text-purple-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Shield className="w-4 h-4" />
                لوحة التحكم
              </button>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Search - Desktop */}
            <div className="hidden md:relative md:block">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-gray-600 hover:opacity-70 transition-all"
              >
                <Search className="w-5 h-5" />
              </button>
              <AnimatePresence>
                {searchOpen && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 240 }}
                    exit={{ opacity: 0, width: 0 }}
                    className="absolute left-0 top-1/2 -translate-y-1/2 origin-right z-50"
                    style={{ right: '100%', left: 'auto' }}
                  >
                    <input
                      autoFocus
                      type="text"
                      value={searchQuery}
                      onChange={e => { setSearchQuery(e.target.value); setActivePage('shop'); }}
                      placeholder="ابحث عن منتج..."
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm font-cairo bg-white shadow-lg text-right"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Search - Mobile */}
            <div className="md:hidden">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-gray-600 hover:opacity-70 transition-all"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>

            {/* Wishlist */}
            {currentUser && (
              <button
                onClick={() => setActivePage('wishlist')}
                className="relative p-2 text-gray-600 hover:text-pink-500 hover:bg-pink-50 rounded-lg transition-all"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 text-white text-xs rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </button>
            )}

            {/* Cart */}
            <button
              onClick={() => setIsCartOpen(!isCartOpen)}
              className="relative p-2 text-gray-600 hover:text-pink-500 hover:bg-pink-50 rounded-lg transition-all"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 text-white text-xs rounded-full flex items-center justify-center"
                >
                  {cartCount}
                </motion.span>
              )}
            </button>

            {/* User */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-2 text-gray-600 hover:text-pink-500 hover:bg-pink-50 rounded-lg transition-all"
              >
                {currentUser?.avatar ? (
                  <img src={currentUser.avatar} alt="" className="w-7 h-7 rounded-full object-cover" />
                ) : (
                  <div className="w-7 h-7 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </button>
              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -10 }}
                    className="absolute left-0 top-full mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50"
                  >
                    {currentUser ? (
                      <>
                        <div className="p-4 bg-gradient-to-br from-pink-50 to-purple-50 border-b border-gray-100">
                          <p className="font-bold text-gray-900 font-cairo text-sm">{currentUser.name}</p>
                          <p className="text-xs text-gray-500 font-cairo">{currentUser.email}</p>
                          {currentUser.role === 'admin' && (
                            <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full font-cairo">
                              <Shield className="w-3 h-3" /> مدير
                            </span>
                          )}
                        </div>
                        <div className="p-2">
                          <button
                            onClick={() => { setActivePage('profile'); setUserMenuOpen(false); }}
                            className="w-full text-right px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg font-cairo transition-all"
                          >
                            الملف الشخصي
                          </button>
                          <button
                            onClick={() => { setActivePage('orders'); setUserMenuOpen(false); }}
                            className="w-full text-right px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg font-cairo transition-all"
                          >
                            طلباتي
                          </button>
                          {currentUser.role === 'admin' && (
                            <button
                              onClick={() => { setActivePage('admin'); setUserMenuOpen(false); }}
                              className="w-full text-right px-3 py-2 text-sm text-purple-700 hover:bg-purple-50 rounded-lg font-cairo transition-all flex items-center gap-2"
                            >
                              <Shield className="w-4 h-4" /> لوحة التحكم
                            </button>
                          )}
                          <hr className="my-2 border-gray-100" />
                          <button
                            onClick={() => { logout(); setUserMenuOpen(false); }}
                            className="w-full text-right px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg font-cairo transition-all flex items-center gap-2"
                          >
                            <LogOut className="w-4 h-4" /> تسجيل الخروج
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="p-2">
                        <button
                          onClick={() => { setActivePage('login'); setUserMenuOpen(false); }}
                          className="w-full text-right px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg font-cairo transition-all"
                        >
                          تسجيل الدخول
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Search - Mobile Input */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-100"
            >
              <div className="px-4 py-2">
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={e => { setSearchQuery(e.target.value); setActivePage('shop'); }}
                  placeholder="ابحث عن منتج..."
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-cairo bg-white text-right"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-100 py-3"
            >
              {navItems.map(item => (
                <button
                  key={item.key}
                  onClick={() => { setActivePage(item.key); setMobileOpen(false); }}
                  className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-medium font-cairo transition-all ${
                    activePage === item.key ? 'text-pink-600 bg-pink-50' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
              {currentUser?.role === 'admin' && (
                <button
                  onClick={() => { setActivePage('admin'); setMobileOpen(false); }}
                  className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium font-cairo text-purple-600 hover:bg-purple-50"
                >
                  <Shield className="w-4 h-4" />
                  لوحة التحكم
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
