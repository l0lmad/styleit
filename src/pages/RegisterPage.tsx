import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function RegisterPage() {
  const { setActivePage } = useStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center p-4" dir="rtl">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-pink-200">
            <User className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 font-cairo mb-3">التسجيل متاح للمدير فقط</h1>
          <p className="text-gray-500 font-cairo text-sm mb-6">يمكنك الشراء بدون حساب — فقط أضف المنتجات للسلة وأتمم الطلب</p>
          <button
            onClick={() => setActivePage('shop')}
            className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-bold font-cairo"
          >
            تسوق الآن
          </button>
          <div className="mt-4">
            <button onClick={() => setActivePage('login')} className="text-pink-500 font-bold text-sm font-cairo hover:text-pink-600">
              تسجيل الدخول للمدير
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
