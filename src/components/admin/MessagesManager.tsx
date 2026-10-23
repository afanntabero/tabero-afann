import { useState, useEffect } from 'react';
import { Mail, Trash2, MailOpen, Calendar, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { fetchContactMessages, markMessageRead, deleteContactMessage } from '@/services/api';
import type { ContactMessage } from '@/lib/types';

export default function MessagesManager() {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => { loadMessages(); }, []);

  const loadMessages = async () => {
    try { const data = await fetchContactMessages(); setMessages(data); }
    catch { setMessages([]); }
    finally { setLoading(false); }
  };

  const handleMarkRead = async (id: string) => {
    try { await markMessageRead(id); setMessages((prev) => prev.map((m) => m.id === id ? { ...m, is_read: true } : m)); }
    catch { /* keep current state on error */ }
  };

  const handleDelete = async (id: string) => {
    try { await deleteContactMessage(id); setMessages((prev) => prev.filter((m) => m.id !== id)); }
    catch { /* keep current state on error */ }
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 size={32} className="text-neon-cyan animate-spin" /></div>;
  }

  return (
    <div className="px-6 py-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-white mb-1">{t.admin.messages.title}</h1>
      </div>

      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
          <Mail size={48} className="text-gray-600" />
          <p className="text-gray-400">{t.admin.messages.noMessages}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <div key={msg.id} className={`glass rounded-2xl overflow-hidden ${!msg.is_read ? 'border-neon-cyan/20' : ''}`}>
              <button onClick={() => setExpandedId(expandedId === msg.id ? null : msg.id)} className="w-full p-4 flex items-center gap-4 text-left hover:bg-white/[0.02] transition-colors">
                <div className="flex-shrink-0">
                  {msg.is_read ? <MailOpen size={20} className="text-gray-500" /> : <Mail size={20} className="text-neon-cyan" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-white truncate">{msg.name}</span>
                    {!msg.is_read && <span className="text-xs px-2 py-0.5 rounded-full bg-neon-cyan/15 text-neon-cyan">{t.admin.messages.unread}</span>}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="truncate">{msg.email}</span>
                    <span className="text-gray-400 truncate">{msg.subject}</span>
                  </div>
                </div>
                <span className="text-xs text-gray-500 flex items-center gap-1 flex-shrink-0">
                  <Calendar size={11} /> {new Date(msg.created_at).toLocaleDateString()}
                </span>
              </button>

              {expandedId === msg.id && (
                <div className="border-t border-white/[0.06] p-4 bg-obsidian-800/20">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    <div><p className="text-xs text-gray-500 mb-1">{t.admin.messages.name}</p><p className="text-sm text-white">{msg.name}</p></div>
                    <div><p className="text-xs text-gray-500 mb-1">{t.admin.messages.email}</p><p className="text-sm text-white">{msg.email}</p></div>
                  </div>
                  <div className="mb-4"><p className="text-xs text-gray-500 mb-1">{t.admin.messages.subject}</p><p className="text-sm text-white">{msg.subject}</p></div>
                  <div className="mb-4"><p className="text-xs text-gray-500 mb-1">{t.admin.messages.message}</p><p className="text-sm text-gray-300 whitespace-pre-wrap">{msg.message}</p></div>
                  <div className="flex items-center gap-2">
                    {!msg.is_read && (
                      <button onClick={() => handleMarkRead(msg.id)} className="btn-secondary text-sm flex items-center gap-2">
                        <MailOpen size={14} /> {t.admin.messages.markRead}
                      </button>
                    )}
                    <button onClick={() => handleDelete(msg.id)} className="btn-secondary text-sm flex items-center gap-2 text-error-400">
                      <Trash2 size={14} /> {t.admin.messages.delete}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
