import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Save, Camera } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function ProfilePage() {
  const { currentUser, updateUser, showNotification } = useStore();
  const [form, setForm] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    currentPassword: '',
    newPassword: '',
  });
  const [loading, setLoading] = useState(false);

  if (!currentUser) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.newPassword && form.currentPassword !== currentUser.password) {
      showNotification('كلمة المرور الحالية غلط', 'error');
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    updateUser({
      ...currentUser,
      name: form.name,
      email: form.email,
      password: form.newPassword || currentUser.password,
    });
    setLoading(false);
    showNotification('تم حفظ التغييرات بنجاح ✓');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8" dir="rtl">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <h1 className="text-2xl font-black text-gray-900 font-cairo mb-8">الملف الشخصي</h1>

        {/* Avatar */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 flex items-center gap-5">
          <div className="relative">
            {currentUser.avatar ? (
              <img src={currentUser.avatar} alt="" className="w-20 h-20 rounded-full object-cover border-2 border-gray-100" />
            ) : (
              <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-black">
                {currentUser.name[0]}
              </div>
            )}
          </div>
          <div>
            <p className="font-black text-xl text-gray-900 font-cairo">{currentUser.name}</p>
            <p className="text-gray-400 font-cairo text-sm">{currentUser.email}</p>
            <span className={`inline-block mt-1 px-3 py-0.5 rounded-full text-xs font-bold font-cairo ${
              currentUser.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-pink-100 text-pink-700'
            }`}>
              {currentUser.role === 'admin' ? '👑 مدير' : '🛍️ عميل'}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'الطلبات', value: currentUser.orders?.length || 0, emoji: '📦' },
            { label: 'المفضلة', value: currentUser.wishlist?.length || 0, emoji: '❤️' },
            { label: 'عضو منذ', value: currentUser.createdAt, emoji: '📅' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4 text-center">
              <span className="text-2xl">{s.emoji}</span>
              <p className="font-black text-gray-900 font-cairo mt-1">{s.value}</p>
              <p className="text-xs text-gray-400 font-cairo">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-gray-100 p-6"
        >
          <h2 className="font-black text-gray-900 font-cairo mb-6 flex items-center gap-2">
            <User className="w-5 h-5 text-pink-500" />
            تعديل البيانات
          </h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 font-cairo block mb-1">الاسم</label>
              <div className="relative">
                <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full pr-10 pl-4 py-3 border border-gray-200 rounded-xl text-sm font-cairo focus:outline-none focus:ring-2 focus:ring-pink-300"
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 font-cairo block mb-1">البريد الإلكتروني</label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full pr-10 pl-4 py-3 border border-gray-200 rounded-xl text-sm font-cairo focus:outline-none focus:ring-2 focus:ring-pink-300"
                  required
                />
              </div>
            </div>
            <hr className="border-gray-100" />
            <p className="text-sm font-medium text-gray-500 font-cairo">تغيير كلمة المرور (اختياري)</p>
            <div>
              <label className="text-sm font-medium text-gray-700 font-cairo block mb-1">كلمة المرور الحالية</label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  value={form.currentPassword}
                  onChange={e => setForm(f => ({ ...f, currentPassword: e.target.value }))}
                  className="w-full pr-10 pl-4 py-3 border border-gray-200 rounded-xl text-sm font-cairo focus:outline-none focus:ring-2 focus:ring-pink-300"
                  placeholder="••••••••"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 font-cairo block mb-1">كلمة المرور الجديدة</label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  value={form.newPassword}
                  onChange={e => setForm(f => ({ ...f, newPassword: e.target.value }))}
                  className="w-full pr-10 pl-4 py-3 border border-gray-200 rounded-xl text-sm font-cairo focus:outline-none focus:ring-2 focus:ring-pink-300"
                  placeholder="••••••••"
                />
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
                  <Save className="w-5 h-5" />
                  حفظ التغييرات
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
