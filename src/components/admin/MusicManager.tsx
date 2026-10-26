import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, X, Loader2, Music2, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { fetchTracks, createTrack, updateTrack, deleteTrack } from '@/services/api';
import type { Track, TrackType } from '@/lib/types';

export default function MusicManager() {
  const { t } = useLanguage();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Track | null>(null);
  const [form, setForm] = useState({ title: '', type: 'single' as TrackType, genre: '', release_date: '', cover_url: '', audio_url: '', streaming_links: '{"spotify":"","apple_music":"","youtube":""}' });
  const [saving, setSaving] = useState(false);

  const load = async () => { try { setTracks(await fetchTracks()); } finally { setLoading(false); } };
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm({ title: '', type: 'single', genre: '', release_date: '', cover_url: '', audio_url: '', streaming_links: '{"spotify":"","apple_music":"","youtube":""}' }); setShowModal(true); };
  const openEdit = (track: Track) => { setEditing(track); setForm({ title: track.title, type: track.type, genre: track.genre, release_date: track.release_date, cover_url: track.cover_url, audio_url: track.audio_url, streaming_links: JSON.stringify(track.streaming_links ?? {}) }); setShowModal(true); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = { ...form, streaming_links: JSON.parse(form.streaming_links || '{}') };
      if (editing) await updateTrack(editing.id, data);
      else await createTrack(data);
      await load();
      setShowModal(false);
    } finally { setSaving(false); }
  };
  const handleDelete = async (id: string) => { if (confirm('Delete?')) { await deleteTrack(id); await load(); } };

  return (
    <div className="px-6 py-10 max-w-7xl mx-auto space-y-6">
      {/* Bouton Retour au Tableau de Bord */}
      <div>
        <Link to="/admin" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass text-sm font-medium text-gray-300 hover:text-white hover:border-white/25 transition-all">
          <ArrowLeft size={16} /> Tableau de Bord
        </Link>
      </div>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-display font-bold text-white">{t.admin.music.title}</h1>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2"><Plus size={18} /> {t.admin.music.addTrack}</button>
      </div>

      {loading ? <div className="flex justify-center py-20"><Loader2 className="animate-spin text-neon-purple" /></div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tracks.map((track) => (
            <div key={track.id} className="glass rounded-2xl p-4 flex items-center gap-4">
              {track.cover_url ? <img src={track.cover_url} alt="" className="w-16 h-16 rounded-lg object-cover no-select" draggable={false} /> : <div className="w-16 h-16 rounded-lg bg-obsidian-700 flex items-center justify-center"><Music2 size={20} className="text-gray-600" /></div>}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white truncate">{track.title}</p>
                <p className="text-xs text-gray-500">{track.type} · {track.genre}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(track)} className="p-2 rounded-lg text-gray-400 hover:text-neon-cyan"><Pencil size={16} /></button>
                <button onClick={() => handleDelete(track.id)} className="p-2 rounded-lg text-gray-400 hover:text-error-400"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-4" onClick={() => setShowModal(false)}>
          <div className="glass-strong rounded-2xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-display font-bold text-white">{editing ? t.admin.music.editTrack : t.admin.music.addTrack}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white"><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div><label className="block text-sm text-gray-400 mb-1">{t.admin.music.titleField}</label><input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white focus:outline-none focus:border-neon-purple/40" /></div>
              <div><label className="block text-sm text-gray-400 mb-1">{t.admin.music.type}</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as TrackType })} className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white focus:outline-none focus:border-neon-purple/40">
                  <option value="single">{t.admin.music.single}</option><option value="album">{t.admin.music.album}</option><option value="beat">{t.admin.music.beat}</option>
                </select>
              </div>
              <div><label className="block text-sm text-gray-400 mb-1">{t.admin.music.genre}</label><input value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white focus:outline-none focus:border-neon-purple/40" /></div>
              <div><label className="block text-sm text-gray-400 mb-1">{t.admin.music.releaseDate}</label><input type="date" value={form.release_date} onChange={(e) => setForm({ ...form, release_date: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white focus:outline-none focus:border-neon-purple/40" /></div>
              <div><label className="block text-sm text-gray-400 mb-1">{t.admin.music.coverUrl}</label><input value={form.cover_url} onChange={(e) => setForm({ ...form, cover_url: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white focus:outline-none focus:border-neon-purple/40" /></div>
              <div><label className="block text-sm text-gray-400 mb-1">{t.admin.music.audioUrl}</label><input value={form.audio_url} onChange={(e) => setForm({ ...file, audio_url: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white focus:outline-none focus:border-neon-purple/40" /></div>
              <div><label className="block text-sm text-gray-400 mb-1">Streaming Links (JSON)</label><textarea rows={3} value={form.streaming_links} onChange={(e) => setForm({ ...form, streaming_links: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white focus:outline-none focus:border-neon-purple/40 font-mono text-xs resize-none" /></div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50">{saving && <Loader2 size={16} className="animate-spin" />} {t.admin.music.save}</button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">{t.admin.music.cancel}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}