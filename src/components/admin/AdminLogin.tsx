import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock, Loader2, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminLogin() {
  const { t } = useLanguage();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error: err } = await signIn(email, password);
    if (err) setError(err);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-purple/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-neon-cyan/15 rounded-full blur-[100px]" />
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-neon mb-6 animate-glow-pulse">
            <Lock size={28} className="text-white" />
          </div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">{t.admin.login.title}</h1>
          <p className="text-gray-400 text-sm">{t.admin.login.subtitle}</p>
        </div>
        <form onSubmit={handleSubmit} className="glass-strong rounded-2xl p-8 space-y-5">
          <div>
            <label className="block text-sm text-gray-400 mb-2">{t.admin.login.email}</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white focus:outline-none focus:border-neon-purple/40 transition-all" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">{t.admin.login.password}</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white focus:outline-none focus:border-neon-purple/40 transition-all" />
          </div>
          {error && <p className="text-sm text-error-400">{t.admin.login.error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50">
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Lock size={16} />}
            {loading ? t.admin.login.signingIn : t.admin.login.signIn}
          </button>
        </form>
        <Link to="/" className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
          <ArrowLeft size={16} /> {t.admin.login.backHome}
        </Link>
      </div>
    </div>
  );
}
