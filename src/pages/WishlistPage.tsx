import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useStore } from '../store/useStore';
import ProductCard from '../components/ProductCard';

export default function WishlistPage() {
  const { products, currentUser, setActivePage } = useStore();

  if (!currentUser) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4">
        <Heart className="w-16 h-16 text-gray-200" />
        <p className="text-xl font-bold text-gray-900 font-cairo">سجل دخولك لترى المفضلة</p>
        <button onClick={() => setActivePage('login')} className="px-6 py-2.5 bg-pink-500 text-white rounded-xl font-cairo font-bold hover:bg-pink-600 transition-all">
          تسجيل الدخول
        </button>
      </div>
    );
  }

  const wishlistProducts = products.filter(p => currentUser.wishlist?.includes(p.id));

  return (
    <div className="min-h-screen bg-gray-50 py-8" dir="rtl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-gray-900 font-cairo flex items-center gap-2">
              <Heart className="w-6 h-6 text-pink-500 fill-pink-500" />
              المفضلة
            </h1>
            <p className="text-gray-500 font-cairo text-sm mt-1">{wishlistProducts.length} منتج</p>
          </div>
        </div>

        {wishlistProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <Heart className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <p className="text-xl font-bold text-gray-900 font-cairo mb-2">المفضلة فاضية</p>
            <p className="text-gray-400 font-cairo mb-6">أضف منتجات للمفضلة عشان تلاقيها بسهولة</p>
            <button onClick={() => setActivePage('shop')} className="px-6 py-2.5 bg-pink-500 text-white rounded-xl font-cairo font-bold hover:bg-pink-600 transition-all">
              تصفح المنتجات
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {wishlistProducts.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <ProductCard product={p} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
