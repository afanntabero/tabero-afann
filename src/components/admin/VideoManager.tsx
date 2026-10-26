import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, X, Loader2, Video as VideoIcon, Upload, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { fetchVideos, createVideo, updateVideo, deleteVideo } from '@/services/api';
import type { Video, VideoType } from '@/lib/types';

export default function VideoManager() {
  const { t } = useLanguage();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Video | null>(null);
  const [form, setForm] = useState({ title: '', type: 'music_video' as VideoType, video_url: '', thumbnail_url: '' });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = async () => { try { setVideos(await fetchVideos()); } finally { setLoading(false); } };
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm({ title: '', type: 'music_video', video_url: '', thumbnail_url: '' }); setShowModal(true); };
  const openEdit = (video: Video) => { setEditing(video); setForm({ title: video.title, type: video.type, video_url: video.video_url, thumbnail_url: video.thumbnail_url }); setShowModal(true); };

  // Gestion de l'upload de la vidéo vers Cloudflare R2
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      // Appel vers ton API backend ou route d'upload connectée à R2
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'upload vers le serveur");
      }

      const data = await response.json();
      if (data.url) {
        setForm((prev) => ({ ...prev, video_url: data.url }));
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert("Une erreur est survenue lors de l'envoi de la vidéo.");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setSaving(true);
    try { 
      if (editing) {
        await updateVideo(editing.id, form); 
      } else {
        await createVideo(form); 
      }
      await load(); 
      setShowModal(false); 
    } finally { 
      setSaving(false); 
    }
  };

  const handleDelete = async (id: string) => { 
    if (confirm('Êtes-vous sûr de vouloir supprimer cette vidéo ?')) { 
      await deleteVideo(id); 
      await load(); 
    } 
  };

  return (
    <div className="px-6 py-10 max-w-7xl mx-auto space-y-6">
      {/* Bouton Retour au Tableau de Bord */}
      <div>
        <Link to="/admin" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass text-sm font-medium text-gray-300 hover:text-white hover:border-white/25 transition-all">
          <ArrowLeft size={16} /> Tableau de Bord
        </Link>
      </div>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-display font-bold text-white">{t.admin.video.title}</h1>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2"><Plus size={18} /> {t.admin.video.addVideo}</button>
      </div>
      {loading ? <div className="flex justify-center py-20"><Loader2 className="animate-spin text-neon-cyan" /></div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((video) => (
            <div key={video.id} className="glass rounded-2xl overflow-hidden">
              {video.thumbnail_url ? <img src={video.thumbnail_url} alt="" className="w-full aspect-video object-cover no-select" draggable={false} /> : <div className="w-full aspect-video bg-obsidian-700 flex items-center justify-center"><VideoIcon size={24} className="text-gray-600" /></div>}
              <div className="p-4 flex items-center justify-between">
                <div><p className="font-medium text-white truncate">{video.title}</p><p className="text-xs text-gray-500">{video.type.replace('_', ' ')}</p></div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(video)} className="p-2 rounded-lg text-gray-400 hover:text-neon-cyan"><Pencil size={16} /></button>
                  <button onClick={() => handleDelete(video.id)} className="p-2 rounded-lg text-gray-400 hover:text-error-400"><Trash2 size={16} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-4" onClick={() => setShowModal(false)}>
          <div className="glass-strong rounded-2xl p-8 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-display font-bold text-white">{editing ? t.admin.video.editVideo : t.admin.video.addVideo}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white"><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">{t.admin.video.titleField}</label>
                <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white focus:outline-none focus:border-neon-cyan/40" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">{t.admin.video.type}</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as VideoType })} className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white focus:outline-none focus:border-neon-cyan/40">
                  <option value="music_video">{t.admin.video.musicVideo}</option>
                  <option value="behind_scenes">{t.admin.video.behindScenes}</option>
                  <option value="live">{t.admin.video.live}</option>
                </select>
              </div>

              {/* Champ d'upload direct de fichier vidéo vers R2 */}
              <div>
                <label className="block text-sm text-gray-400 mb-1">Fichier Vidéo (R2 Upload)</label>
                <div className="flex items-center gap-2">
                  <label className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-gray-300 hover:text-white hover:border-neon-cyan/40 cursor-pointer transition">
                    {uploading ? <Loader2 size={16} className="animate-spin text-neon-cyan" /> : <Upload size={16} className="text-neon-cyan" />}
                    <span className="text-sm truncate">{uploading ? "Envoi en cours..." : "Choisir une vidéo"}</span>
                    <input type="file" accept="video/*" onChange={handleFileUpload} className="hidden" disabled={uploading} />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">{t.admin.video.videoUrl}</label>
                <input required value={form.video_url} onChange={(e) => setForm({ ...form, video_url: e.target.value })} placeholder="https://..." className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white focus:outline-none focus:border-neon-cyan/40" />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">{t.admin.video.thumbnailUrl}</label>
                <input value={form.thumbnail_url} onChange={(e) => setForm({ ...form, thumbnail_url: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white focus:outline-none focus:border-neon-cyan/40" />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving || uploading} className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50">
                  {saving && <Loader2 size={16} className="animate-spin" />} {t.admin.video.save}
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">{t.admin.video.cancel}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}