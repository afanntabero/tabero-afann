import { useState } from 'react';
import { Send, CheckCircle, Loader2, Mail, User, MessageSquare } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabase';

export default function Contact() {
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const { error } = await supabase.from('contact_messages').insert({
        name: form.name,
        email: form.email,
        subject: form.subject,
        message: form.message,
      });
      if (error) throw error;
      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="py-24 px-6 max-w-3xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 text-gradient-neon">{t.contact.title}</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">{t.contact.subtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="glass-strong rounded-2xl p-8 space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm text-gray-400 mb-2 flex items-center gap-1.5"><User size={14} /> {t.contact.name}</label>
            <input
              required value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white placeholder-gray-500 focus:outline-none focus:border-neon-purple/40 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2 flex items-center gap-1.5"><Mail size={14} /> {t.contact.email}</label>
            <input type="email" required value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white placeholder-gray-500 focus:outline-none focus:border-neon-purple/40 transition-all"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-2 flex items-center gap-1.5"><MessageSquare size={14} /> {t.contact.subject}</label>
          <input required value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white placeholder-gray-500 focus:outline-none focus:border-neon-purple/40 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-2">{t.contact.message}</label>
          <textarea required rows={5} value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white placeholder-gray-500 focus:outline-none focus:border-neon-purple/40 transition-all resize-none"
          />
        </div>
        <button type="submit" disabled={status === 'loading'} className="btn-primary flex items-center gap-2 disabled:opacity-50">
          {status === 'loading' ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          {status === 'loading' ? t.contact.sending : t.contact.send}
        </button>
        {status === 'success' && (
          <div className="flex items-center gap-2 text-success-400 animate-fade-in">
            <CheckCircle size={18} /> <span className="text-sm">{t.contact.success}</span>
          </div>
        )}
        {status === 'error' && (
          <div className="flex items-center gap-2 text-error-400 animate-fade-in">
            <CheckCircle size={18} className="text-error-400" /> <span className="text-sm">Something went wrong. Please try again.</span>
          </div>
        )}
      </form>
    </section>
  );
}
