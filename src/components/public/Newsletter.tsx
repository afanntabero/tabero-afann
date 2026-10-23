import { useState } from 'react';
import { Mail, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { addSubscriber } from '@/services/api';

export default function Newsletter() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'already'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    try {
      const { error, alreadyExists } = await addSubscriber(email);
      if (error) { setStatus('error'); return; }
      if (alreadyExists) { setStatus('already'); return; }
      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
    }
  };

  return (
    <section id="newsletter" className="py-24 px-6 max-w-3xl mx-auto">
      <div className="glass-strong rounded-3xl p-10 md:p-16 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-neon-purple/15 rounded-full blur-[80px]" />
        <div className="relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-neon mb-6 animate-glow-pulse">
            <Mail size={28} className="text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-white">{t.newsletter.title}</h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">{t.newsletter.subtitle}</p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => { setEmail(e.target.value); setStatus('idle'); }}
              placeholder={t.newsletter.placeholder}
              className="flex-1 px-5 py-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white placeholder-gray-500 focus:outline-none focus:border-neon-purple/40 transition-all"
            />
            <button type="submit" disabled={status === 'loading'} className="btn-primary flex items-center justify-center gap-2 disabled:opacity-50">
              {status === 'loading' ? <Loader2 size={18} className="animate-spin" /> : null}
              {t.newsletter.subscribe}
            </button>
          </form>

          {status === 'success' && (
            <div className="mt-4 flex items-center justify-center gap-2 text-success-400 animate-fade-in">
              <CheckCircle size={18} /> <span className="text-sm">{t.newsletter.success}</span>
            </div>
          )}
          {status === 'already' && (
            <div className="mt-4 flex items-center justify-center gap-2 text-warning-400 animate-fade-in">
              <AlertCircle size={18} /> <span className="text-sm">{t.newsletter.alreadySubscribed}</span>
            </div>
          )}
          {status === 'error' && (
            <div className="mt-4 flex items-center justify-center gap-2 text-error-400 animate-fade-in">
              <AlertCircle size={18} /> <span className="text-sm">{t.newsletter.error}</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
