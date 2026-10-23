import { useState, useEffect } from 'react';
import { Users, Download, Send, Trash2, Loader2, Mail, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { fetchSubscribers, deleteSubscriber, fetchBroadcasts, sendBroadcast } from '@/services/api';
import type { Subscriber, Broadcast } from '@/lib/types';

export default function SubscriberHub() {
  const { t } = useLanguage();
  const { session } = useAuth();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const load = async () => { try { setSubscribers(await fetchSubscribers()); setBroadcasts(await fetchBroadcasts()); } finally { setLoading(false); } };
  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string) => { await deleteSubscriber(id); await load(); };

  const exportCsv = () => {
    const csv = ['email,subscribed_date', ...subscribers.map((s) => `${s.email},${new Date(s.created_at).toISOString()}`)].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'subscribers.csv'; a.click(); URL.revokeObjectURL(url);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault(); setSending(true);
    try { await sendBroadcast(subject, body, session?.user?.email ?? 'admin'); setSent(true); setSubject(''); setBody(''); await load(); } finally { setSending(false); }
  };

  return (
    <div className="px-6 py-10 max-w-5xl mx-auto">
      <h1 className="text-2xl font-display font-bold text-white mb-8">{t.admin.subscribers.title}</h1>

      {loading ? <div className="flex justify-center py-20"><Loader2 className="animate-spin text-neon-pink" /></div> : (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left: Subscribers list */}
          <div className="space-y-4">
            <div className="glass rounded-2xl p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-neon-purple/10 flex items-center justify-center"><Users size={24} className="text-neon-purple" /></div>
                <div><p className="text-sm text-gray-400">{t.admin.subscribers.totalSubscribers}</p><p className="text-2xl font-display font-bold text-white">{subscribers.length}</p></div>
              </div>
              <button onClick={exportCsv} className="btn-secondary flex items-center gap-2 text-sm"><Download size={16} /> {t.admin.subscribers.exportCsv}</button>
            </div>

            <div className="glass rounded-2xl p-5 max-h-80 overflow-y-auto">
              {subscribers.length === 0 ? <p className="text-gray-500 text-sm text-center py-8">{t.admin.subscribers.noSubscribers}</p> : (
                <div className="space-y-2">
                  {subscribers.map((s) => (
                    <div key={s.id} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-white/[0.03] transition-colors">
                      <div className="flex items-center gap-2 min-w-0"><Mail size={14} className="text-gray-500 flex-shrink-0" /><span className="text-sm text-gray-300 truncate">{s.email}</span></div>
                      <button onClick={() => handleDelete(s.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-error-400"><Trash2 size={14} /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Broadcast + History */}
          <div className="space-y-4">
            <div className="glass-strong rounded-2xl p-6">
              <h3 className="font-display font-semibold text-white mb-1">{t.admin.subscribers.broadcastTitle}</h3>
              <p className="text-xs text-gray-500 mb-4">{t.admin.subscribers.broadcastDesc}</p>
              <form onSubmit={handleSend} className="space-y-3">
                <input required placeholder={t.admin.subscribers.subjectField} value={subject} onChange={(e) => { setSubject(e.target.value); setSent(false); }} className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white placeholder-gray-500 focus:outline-none focus:border-neon-pink/40 text-sm" />
                <textarea required rows={4} placeholder={t.admin.subscribers.bodyField} value={body} onChange={(e) => { setBody(e.target.value); setSent(false); }} className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white placeholder-gray-500 focus:outline-none focus:border-neon-pink/40 text-sm resize-none" />
                <button type="submit" disabled={sending} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50">{sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />} {sending ? t.admin.subscribers.sending : t.admin.subscribers.sendBroadcast}</button>
                {sent && <div className="flex items-center gap-2 text-success-400 animate-fade-in"><CheckCircle size={16} /><span className="text-sm">{t.admin.subscribers.broadcastSuccess}</span></div>}
              </form>
            </div>

            <div className="glass rounded-2xl p-5">
              <h3 className="font-display font-semibold text-white mb-4 text-sm">{t.admin.subscribers.recentBroadcasts}</h3>
              {broadcasts.length === 0 ? <p className="text-gray-500 text-xs text-center py-6">—</p> : (
                <div className="space-y-3">
                  {broadcasts.slice(0, 5).map((b) => (
                    <div key={b.id} className="flex items-center justify-between text-sm">
                      <div className="min-w-0"><p className="text-gray-300 truncate">{b.subject}</p><p className="text-xs text-gray-600">{new Date(b.created_at).toLocaleDateString()}</p></div>
                      <span className="text-xs text-gray-500 flex-shrink-0">{b.recipient_count} sent</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
