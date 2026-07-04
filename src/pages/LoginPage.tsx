import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail, ArrowLeft } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function LoginPage() {
  const { login, setActivePage, showNotification } = useStore();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const success = login(form.email, form.password);
    setLoading(false);
    if (success) {
      showNotification('تم تسجيل الدخول بنجاح! 👋');
      setActivePage('home');
    } else {
      setError('البريد الإلكتروني أو كلمة المرور غلط');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center p-4" dir="rtl">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-pink-200">
              <Lock className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-black text-gray-900 font-cairo">تسجيل الدخول</h1>
            <p className="text-gray-500 font-cairo text-sm mt-1">ادخل بيانات حسابك</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm font-cairo rounded-xl"
              >
                ❌ {error}
              </motion.div>
            )}

            <div>
              <label className="text-sm font-medium text-gray-700 font-cairo block mb-1">البريد الإلكتروني</label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full pr-10 pl-4 py-3 border border-gray-200 rounded-xl text-sm font-cairo focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all"
                  placeholder="بريدك الإلكتروني"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 font-cairo block mb-1">كلمة المرور</label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  className="w-full pr-10 pl-10 py-3 border border-gray-200 rounded-xl text-sm font-cairo focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-bold font-cairo flex items-center justify-center gap-2 shadow-lg shadow-pink-200 hover:shadow-xl transition-all disabled:opacity-70"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <ArrowLeft className="w-5 h-5" />
                  تسجيل الدخول
                </>
              )}
            </motion.button>
          </form>

          <div className="text-center mt-4">
            <p className="text-gray-400 font-cairo text-xs">
              هذه الصفحة مخصصة للمدير فقط
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
