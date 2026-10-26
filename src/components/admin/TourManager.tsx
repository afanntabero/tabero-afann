import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, X, Loader2, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { fetchEvents, createEvent, updateEvent, deleteEvent } from '@/services/api';
import type { Event as EventType, TicketStatus } from '@/lib/types';

export default function TourManager() {
  const { t } = useLanguage();
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<EventType | null>(null);
  const [form, setForm] = useState({ date: '', venue: '', city: '', country: '', ticket_url: '', ticket_status: 'available' as TicketStatus });
  const [saving, setSaving] = useState(false);

  const load = async () => { try { setEvents(await fetchEvents()); } finally { setLoading(false); } };
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm({ date: '', venue: '', city: '', country: '', ticket_url: '', ticket_status: 'available' }); setShowModal(true); };
  const openEdit = (event: EventType) => { setEditing(event); setForm({ date: event.date, venue: event.venue, city: event.city, country: event.country, ticket_url: event.ticket_url, ticket_status: event.ticket_status }); setShowModal(true); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try { if (editing) await updateEvent(editing.id, form); else await createEvent(form); await load(); setShowModal(false); } finally { setSaving(false); }
  };
  const handleDelete = async (id: string) => { if (confirm('Delete?')) { await deleteEvent(id); await load(); } };

  return (
    <div className="px-6 py-10 max-w-5xl mx-auto space-y-6">
      {/* Bouton Retour au Tableau de Bord */}
      <div>
        <Link to="/admin" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass text-sm font-medium text-gray-300 hover:text-white hover:border-white/25 transition-all">
          <ArrowLeft size={16} /> Tableau de Bord
        </Link>
      </div>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-display font-bold text-white">{t.admin.tour.title}</h1>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2"><Plus size={18} /> {t.admin.tour.addEvent}</button>
      </div>
      {loading ? <div className="flex justify-center py-20"><Loader2 className="animate-spin text-gold-400" /></div> : (
        <div className="space-y-3">
          {events.map((event) => (
            <div key={event.id} className="glass rounded-2xl p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-center w-14 h-14 rounded-xl bg-gradient-gold text-white"><span className="text-xs uppercase mt-1">{new Date(event.date).toLocaleDateString('en', { month: 'short' })}</span><span className="text-xl font-bold">{new Date(event.date).getDate()}</span></div>
                <div><p className="font-medium text-white">{event.venue}</p><p className="text-sm text-gray-500">{event.city}, {event.country} · {event.ticket_status}</p></div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(event)} className="p-2 rounded-lg text-gray-400 hover:text-neon-cyan"><Pencil size={16} /></button>
                <button onClick={() => handleDelete(event.id)} className="p-2 rounded-lg text-gray-400 hover:text-error-400"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-4" onClick={() => setShowModal(false)}>
          <div className="glass-strong rounded-2xl p-8 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-display font-bold text-white">{editing ? t.admin.tour.editEvent : t.admin.tour.addEvent}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white"><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div><label className="block text-sm text-gray-400 mb-1">{t.admin.tour.date}</label><input type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white focus:outline-none focus:border-gold-400/40" /></div>
              <div><label className="block text-sm text-gray-400 mb-1">{t.admin.tour.venue}</label><input required value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white focus:outline-none focus:border-gold-400/40" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-sm text-gray-400 mb-1">{t.admin.tour.city}</label><input required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white focus:outline-none focus:border-gold-400/40" /></div>
                <div><label className="block text-sm text-gray-400 mb-1">{t.admin.tour.country}</label><input required value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white focus:outline-none focus:border-gold-400/40" /></div>
              </div>
              <div><label className="block text-sm text-gray-400 mb-1">{t.admin.tour.ticketUrl}</label><input value={form.ticket_url} onChange={(e) => setForm({ ...form, ticket_url: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white focus:outline-none focus:border-gold-400/40" /></div>
              <div><label className="block text-sm text-gray-400 mb-1">{t.admin.tour.ticketStatus}</label>
                <select value={form.ticket_status} onChange={(e) => setForm({ ...form, ticket_status: e.target.value as TicketStatus })} className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white focus:outline-none focus:border-gold-400/40">
                  <option value="available">{t.admin.tour.available}</option><option value="sold_out">{t.admin.tour.soldOut}</option><option value="limited">{t.admin.tour.limited}</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50">{saving && <Loader2 size={16} className="animate-spin" />} {t.admin.tour.save}</button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">{t.admin.tour.cancel}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}