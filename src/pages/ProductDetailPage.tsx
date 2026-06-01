import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Heart, ShoppingCart, Plus, Minus, Share2, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useStore, Size } from '../store/useStore';

interface Props { productId: string; }

export default function ProductDetailPage({ productId }: Props) {
  const { products, currentUser, toggleWishlist, addToCart, setActivePage, showNotification } = useStore();
  const product = products.find(p => p.id === productId);

  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [imgIndex, setImgIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'desc'>('desc');

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-4xl">😕</p>
        <p className="font-cairo text-gray-600">المنتج مش موجود</p>
        <button onClick={() => setActivePage('shop')} className="px-6 py-2.5 bg-pink-500 text-white rounded-xl font-cairo hover:bg-pink-600">
          ارجع للمتجر
        </button>
      </div>
    );
  }

  const isWishlisted = currentUser?.wishlist?.includes(product.id);
  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;

  const handleAddToCart = () => {
    if (!selectedSize) { showNotification('اختر المقاس أولاً', 'error'); return; }
    if (!selectedColor) { showNotification('اختر اللون أولاً', 'error'); return; }
    addToCart(product, selectedSize, selectedColor, quantity);
    showNotification(`تمت إضافة "${product.name}" للسلة ✓`);
    useStore.getState().setIsCartOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 font-cairo mb-6">
          <button onClick={() => setActivePage('home')} className="hover:text-pink-500 transition-colors">الرئيسية</button>
          <ChevronLeft className="w-4 h-4" />
          <button onClick={() => setActivePage('shop')} className="hover:text-pink-500 transition-colors">المتجر</button>
          <ChevronLeft className="w-4 h-4" />
          <span className="text-gray-900">{product.name}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Images */}
          <div className="space-y-4">
            <motion.div
              key={imgIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative aspect-square bg-gray-100 rounded-3xl overflow-hidden"
            >
              <img src={product.images[imgIndex]} alt={product.name} className="w-full h-full object-cover" />
              {discount > 0 && (
                <span className="absolute top-4 right-4 px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-xl font-cairo">
                  -{discount}%
                </span>
              )}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() => setImgIndex(i => Math.max(0, i - 1))}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow-md hover:bg-white transition-all"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setImgIndex(i => Math.min(product.images.length - 1, i + 1))}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow-md hover:bg-white transition-all"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </motion.div>
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIndex(i)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${i === imgIndex ? 'border-pink-500' : 'border-transparent'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <span className="text-sm text-pink-500 font-cairo font-medium">{product.category}</span>
              <h1 className="text-3xl font-black text-gray-900 font-cairo mt-1">{product.name}</h1>
              <div className="flex items-center gap-3 mt-3">
                <span className={`text-sm font-cairo font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {product.stock > 0 ? `✓ متاح (${product.stock} قطعة)` : '✗ نفد المخزون'}
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="text-4xl font-black text-gray-900 font-cairo">{product.price.toLocaleString()} جنيه</span>
              {product.oldPrice && (
                <div>
                  <span className="text-xl text-gray-400 line-through font-cairo">{product.oldPrice.toLocaleString()}</span>
                  <span className="block text-sm text-red-500 font-cairo font-bold">وفرت {(product.oldPrice - product.price).toLocaleString()} جنيه</span>
                </div>
              )}
            </div>

            {/* Colors */}
            <div>
              <p className="text-sm font-semibold text-gray-700 font-cairo mb-2">اللون:</p>
              <div className="flex gap-3">
                {product.colors.map(c => (
                  <button
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    className={`w-10 h-10 rounded-full border-4 transition-all ${
                      selectedColor === c ? 'border-pink-500 scale-110 shadow-lg' : 'border-transparent hover:border-gray-300'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div>
              <p className="text-sm font-semibold text-gray-700 font-cairo mb-2">المقاس:</p>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold font-cairo border-2 transition-all ${
                      selectedSize === size
                        ? 'bg-pink-500 text-white border-pink-500'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-pink-300'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <p className="text-sm font-semibold text-gray-700 font-cairo mb-2">الكمية:</p>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-10 h-10 border border-gray-200 rounded-xl flex items-center justify-center hover:bg-gray-50 transition-all"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-xl font-bold font-cairo w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                  className="w-10 h-10 border border-pink-200 bg-pink-50 rounded-xl flex items-center justify-center hover:bg-pink-100 transition-all text-pink-600"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 rounded-2xl font-bold font-cairo text-sm hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-5 h-5" />
                {product.stock === 0 ? 'نفد المخزون' : 'أضف للسلة'}
              </motion.button>
              <button
                onClick={() => {
                  if (!currentUser) { showNotification('سجل دخولك أولاً', 'error'); return; }
                  toggleWishlist(product.id);
                  showNotification(isWishlisted ? 'تمت الإزالة من المفضلة' : 'تمت الإضافة للمفضلة ❤️', isWishlisted ? 'info' : 'success');
                }}
                className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center transition-all ${
                  isWishlisted ? 'bg-pink-500 border-pink-500 text-white' : 'border-gray-200 text-gray-500 hover:border-pink-300 hover:text-pink-500'
                }`}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-white' : ''}`} />
              </button>
              <button className="w-14 h-14 rounded-2xl border-2 border-gray-200 flex items-center justify-center text-gray-500 hover:border-gray-300 transition-all">
                <Share2 className="w-5 h-5" />
              </button>
            </div>

          </div>
        </div>

        {/* Tabs */}
        <div className="mt-12 bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="p-6">
            <p className="text-gray-600 font-cairo leading-relaxed">{product.description}</p>
          </div>
        </div>

      </div>
    </div>
  );
}
