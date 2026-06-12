import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Truck, Shield, HeadphonesIcon, TrendingUp, Tag, Zap } from 'lucide-react';
import { useStore } from '../store/useStore';
import ProductCard from '../components/ProductCard';

export default function HomePage() {
  const { products, setActivePage, setSelectedCategory, siteSettings } = useStore();

  const heroSlides = useMemo(() => {
    const slides = products
      .filter(p => p.images.length > 0)
      .flatMap(p => p.images.map(url => ({ url, productId: p.id, productName: p.name, productPrice: p.price })));
    for (let i = slides.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [slides[i], slides[j]] = [slides[j], slides[i]];
    }
    return slides;
  }, [products]);

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  useEffect(() => {
    if (heroSlides.length === 0) return;
    if (currentSlideIndex >= heroSlides.length) {
      setCurrentSlideIndex(0);
    }
  }, [heroSlides.length, currentSlideIndex]);

  useEffect(() => {
    if (heroSlides.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % heroSlides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  const featured = products.filter(p => p.featured).slice(0, 4);
  const newArrivals = products.filter(p => p.newArrival).slice(0, 4);

  const categories = [
    { name: 'رجالي', emoji: '👔', color: 'from-blue-400 to-blue-600', count: products.filter(p => p.category === 'رجالي').length },
    { name: 'حريمي', emoji: '👗', color: 'from-pink-400 to-pink-600', count: products.filter(p => p.category === 'حريمي').length },
    { name: 'أطفال', emoji: '🧒', color: 'from-yellow-400 to-orange-500', count: products.filter(p => p.category === 'أطفال').length },
    { name: 'رياضي', emoji: '🏋️', color: 'from-green-400 to-emerald-600', count: products.filter(p => p.category === 'رياضي').length },
    { name: 'اكسسوارات', emoji: '👜', color: 'from-purple-400 to-purple-600', count: products.filter(p => p.category === 'اكسسوارات').length },
  ];

  const featuresMap: Record<string, { icon: React.ReactNode; color: string }> = {
    'شحن سريع': { icon: <Truck className="w-6 h-6" />, color: 'text-blue-500 bg-blue-50' },
    'شحن مجاني': { icon: <Truck className="w-6 h-6" />, color: 'text-blue-500 bg-blue-50' },
    'دفع آمن': { icon: <Shield className="w-6 h-6" />, color: 'text-green-500 bg-green-50' },
    'دفع آمن 100%': { icon: <Shield className="w-6 h-6" />, color: 'text-green-500 bg-green-50' },
    'جودة عالية': { icon: <Shield className="w-6 h-6" />, color: 'text-purple-500 bg-purple-50' },
    'دعم متواصل': { icon: <HeadphonesIcon className="w-6 h-6" />, color: 'text-purple-500 bg-purple-50' },
  };

  return (
    <div className="min-h-screen bg-gray-50" style={{ '--primary': siteSettings.primaryColor, '--secondary': siteSettings.secondaryColor } as React.CSSProperties}>
      {/* Hero Section */}
      <section className="relative overflow-hidden text-white" style={{ background: `linear-gradient(135deg, ${siteSettings.primaryColor}, ${siteSettings.secondaryColor}, #4338ca)` }}>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-60 h-60 rounded-full blur-3xl" style={{ backgroundColor: siteSettings.primaryColor }} />
          <div className="absolute top-1/2 left-1/2 w-80 h-80 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" style={{ backgroundColor: siteSettings.secondaryColor }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-28 grid md:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="text-right"
          >
            <motion.span
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-cairo mb-6"
            >
              <Zap className="w-4 h-4 text-yellow-300" />
              {siteSettings.heroBadge}
            </motion.span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black font-cairo leading-tight mb-6">
              {siteSettings.heroTitle}<br />
            </h1>
            <p className="text-white/80 font-cairo text-lg mb-8 leading-relaxed">
              {siteSettings.heroSubtitle}
            </p>
            <div className="flex gap-4 flex-wrap">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActivePage('shop')}
                className="flex items-center gap-2 bg-white px-8 py-3.5 rounded-2xl font-bold font-cairo text-sm shadow-lg hover:shadow-xl transition-all"
                style={{ color: siteSettings.primaryColor }}
              >
                <ArrowLeft className="w-5 h-5" />
                {siteSettings.heroBtnText}
              </motion.button>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10">
              <AnimatePresence mode="wait">
                {heroSlides.length > 0 && (
                  <motion.div
                    key={currentSlideIndex}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.5 }}
                    className="rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl cursor-pointer"
                    onClick={() => setActivePage(`product-${heroSlides[currentSlideIndex]?.productId}`)}
                  >
                    <img src={heroSlides[currentSlideIndex]?.url} alt="" className="w-full h-56 sm:h-72 md:h-96 object-cover" />
                    {heroSlides[currentSlideIndex] && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                        <p className="text-white font-bold font-cairo text-lg">{heroSlides[currentSlideIndex].productName}</p>
                        <p className="text-white/80 font-cairo text-sm">{heroSlides[currentSlideIndex].productPrice.toLocaleString()} جنيه</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
              {/* Dots */}
              {heroSlides.length > 1 && (
                <div className="flex justify-center gap-2 mt-4" dir="ltr">
                  {heroSlides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlideIndex(idx)}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${
                        idx === currentSlideIndex ? 'bg-white w-6' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Bar */}
      {siteSettings.showFeatures && (
        <section className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {siteSettings.features.map((f, i) => {
              const matched = featuresMap[f.title] || { icon: '💫', color: 'text-gray-500 bg-gray-50' };
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className={`p-3 rounded-xl ${matched.color}`}>{matched.icon}</div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm font-cairo">{f.title}</p>
                    <p className="text-gray-500 text-xs font-cairo">{f.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

      {/* Categories */}
      {siteSettings.showCategories && categories.some(c => c.count > 0) && (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-gray-900 font-cairo mb-2">تسوق حسب الفئة</h2>
          <p className="text-gray-500 font-cairo">اختر من بين أرقى التشكيلات</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {categories.filter(c => c.count > 0).map((cat, i) => (
            <motion.button
              key={cat.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              onClick={() => { setSelectedCategory(cat.name); setActivePage('shop'); }}
              className={`bg-gradient-to-br ${cat.color} text-white p-6 rounded-2xl text-center shadow-lg hover:shadow-xl transition-all`}
            >
              <span className="text-4xl block mb-3">{cat.emoji}</span>
              <p className="font-bold font-cairo">{cat.name}</p>
              <p className="text-white/80 text-xs font-cairo mt-1">{cat.count} منتج</p>
            </motion.button>
          ))}
        </div>
      </section>
      )}

      {/* Featured Products */}
      {siteSettings.showFeatured && featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-gray-900 font-cairo flex items-center gap-2">
                <TrendingUp className="w-6 h-6" style={{ color: siteSettings.primaryColor }} />
                المنتجات المميزة
              </h2>
              <p className="text-gray-500 font-cairo text-sm mt-1">الأكثر مبيعاً وتقييماً</p>
            </div>
            <button
              onClick={() => setActivePage('shop')}
              className="flex items-center gap-2 font-cairo text-sm font-medium transition-all hover:gap-3"
              style={{ color: siteSettings.primaryColor }}
            >
              عرض الكل <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featured.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <ProductCard product={p} />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Sale Banner */}
      {siteSettings.showSaleBanner && (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <motion.div
          whileInView={{ opacity: 1, scale: 1 }}
          initial={{ opacity: 0, scale: 0.95 }}
          viewport={{ once: true }}
          className="rounded-3xl p-8 md:p-12 text-white text-center relative overflow-hidden"
          style={{ background: `linear-gradient(to right, ${siteSettings.saleBannerColor}, ${siteSettings.primaryColor})` }}
        >
          <div className="absolute inset-0 opacity-10">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="absolute text-6xl" style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }}>
                {siteSettings.saleBannerIcon}
              </div>
            ))}
          </div>
          <div className="relative">
            <span className="inline-flex items-center gap-2 bg-white/20 px-4 py-1.5 rounded-full text-sm font-cairo mb-4">
              <Tag className="w-4 h-4" /> {siteSettings.saleBannerBadge}
            </span>
            <h2 className="text-3xl md:text-4xl font-black font-cairo mb-3">{siteSettings.saleBannerTitle}</h2>
            <p className="text-white/80 font-cairo mb-6">{siteSettings.saleBannerSubtitle.replace('{coupon}', siteSettings.saleBannerCoupon)}</p>
            <button
              onClick={() => setActivePage('shop')}
              className="bg-white px-8 py-3 rounded-xl font-bold font-cairo hover:shadow-lg transition-all"
              style={{ color: siteSettings.primaryColor }}
            >
              {siteSettings.saleBannerBtnText}
            </button>
          </div>
        </motion.div>
      </section>
      )}

      {/* New Arrivals */}
      {siteSettings.showNewArrivals && newArrivals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-gray-900 font-cairo flex items-center gap-2">
                ✨ وصل حديثاً
              </h2>
              <p className="text-gray-500 font-cairo text-sm mt-1">أحدث الإضافات لمتجرنا</p>
            </div>
            <button
              onClick={() => setActivePage('shop')}
              className="flex items-center gap-2 font-cairo text-sm font-medium"
              style={{ color: siteSettings.primaryColor }}
            >
              عرض الكل <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {newArrivals.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <ProductCard product={p} />
              </motion.div>
            ))}
          </div>
        </section>
      )}



      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid md:grid-cols-4 gap-8">
          <div>
            <div className="mb-4">
              <span className="text-lg font-black font-cairo">{siteSettings.footerBrand.split(' ').map((w, i) => i === 1 ? <span key={w} style={{ color: siteSettings.primaryColor }}>{w}</span> : <span key={w}>{w} </span>)}</span>
            </div>
            <p className="text-gray-400 text-sm font-cairo leading-relaxed">
              {siteSettings.footerAbout || 'متجرك الأول للأزياء العصرية. نقدم أرقى الملابس بأفضل الأسعار.'}
            </p>
          </div>
          <div>
            <h3 className="font-bold font-cairo mb-4">روابط سريعة</h3>
            <ul className="space-y-2 text-gray-400 text-sm font-cairo">
              {(siteSettings.footerQuickLinks || []).map(l => (
                <li key={l.label}><button onClick={() => setActivePage(l.page as any)} className="hover:text-pink-400 transition-colors">{l.label}</button></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-bold font-cairo mb-4">خدمة العملاء</h3>
            <ul className="space-y-2 text-gray-400 text-sm font-cairo">
              {(siteSettings.footerServiceLinks || []).map(l => (
                <li key={l.label}><button onClick={() => setActivePage(l.page as any)} className="hover:text-pink-400 transition-colors">{l.label}</button></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-bold font-cairo mb-4">تواصل معنا</h3>
            <div className="space-y-2 text-gray-400 text-sm font-cairo">
              <p>📞 {siteSettings.footerPhone}</p>
              <p>✉️ {siteSettings.footerEmail}</p>
              <p>📍 {siteSettings.footerAddress}</p>
            </div>
            <div className="flex gap-3 mt-4">
              {(siteSettings.footerSocial || []).map((s, i) => (
                <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-pink-500 transition-all text-lg">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm font-cairo">
          © {new Date().getFullYear()} {siteSettings.footerBrand}. جميع الحقوق محفوظة.
        </div>
      </footer>
    </div>
  );
}
