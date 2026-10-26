import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Loader2, Image as ImageIcon, Upload, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabase';
import { uploadFileToR2 } from '@/services/api';

interface PhotoItem {
  id: string;
  image_url: string;
  caption: string;
  created_at: string;
}

export default function PhotoManager() {
  const { t } = useLanguage();
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<PhotoItem | null>(null);
  const [form, setForm] = useState({ image_url: '', caption: '' });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const loadPhotos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPhotos(data || []);
    } catch (err) {
      console.error('Erreur chargement photos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPhotos();
  }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({ image_url: '', caption: '' });
    setShowModal(true);
  };

  const openEdit = (photo: PhotoItem) => {
    setEditing(photo);
    setForm({ image_url: photo.image_url, caption: photo.caption || '' });
    setShowModal(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // Utilisation directe de la fonction R2
      const url = await uploadFileToR2(file);
      if (url) {
        setForm((prev) => ({ ...prev, image_url: url }));
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert("Une erreur est survenue lors de l'envoi de l'image vers Cloudflare R2.");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        const { error } = await supabase
          .from('photos')
          .update({ image_url: form.image_url, caption: form.caption })
          .eq('id', editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('photos')
          .insert([{ image_url: form.image_url, caption: form.caption }]);
        if (error) throw error;
      }
      await loadPhotos();
      setShowModal(false);
    } catch (err) {
      console.error('Erreur sauvegarde:', err);
      alert("Erreur lors de l'enregistrement de la photo.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette photo ?')) {
      try {
        const { error } = await supabase.from('photos').delete().eq('id', id);
        if (error) throw error;
        await loadPhotos();
      } catch (err) {
        console.error('Erreur suppression:', err);
      }
    }
  };

  return (
    <div className="px-6 py-10 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Link to="/admin" className="btn-secondary flex items-center gap-2">
            <ArrowLeft size={18} /> Tableau de Bord
          </Link>
          <h1 className="text-2xl font-display font-bold text-white">Gestion de la Galerie Photos</h1>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Ajouter une photo
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-neon-cyan" />
        </div>
      ) : photos.length === 0 ? (
        <div className="text-center py-20 glass rounded-2xl">
          <ImageIcon size={48} className="mx-auto text-gray-600 mb-3" />
          <p className="text-gray-400">Aucune photo publiée pour le moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((photo) => (
            <div key={photo.id} className="glass rounded-2xl overflow-hidden flex flex-col justify-between">
              <div>
                {photo.image_url ? (
                  <img src={photo.image_url} alt="Galerie" className="w-full aspect-square object-cover no-select" draggable={false} />
                ) : (
                  <div className="w-full aspect-square bg-obsidian-700 flex items-center justify-center">
                    <ImageIcon size={32} className="text-gray-600" />
                  </div>
                )}
                <div className="p-4">
                  <p className="text-sm text-gray-300 line-clamp-2 italic">"{photo.caption || 'Sans légende'}"</p>
                </div>
              </div>
              <div className="px-4 pb-4 flex items-center justify-between border-t border-white/[0.06] pt-3">
                <span className="text-xs text-gray-500">{new Date(photo.created_at).toLocaleDateString()}</span>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(photo)} className="p-2 rounded-lg text-gray-400 hover:text-neon-cyan transition">
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => handleDelete(photo.id)} className="p-2 rounded-lg text-gray-400 hover:text-error-400 transition">
                    <Trash2 size={16} />
                  </button>
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
              <h2 className="text-xl font-display font-bold text-white">
                {editing ? 'Modifier la photo' : 'Publier une nouvelle photo'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Fichier Image (Stockage)</label>
                <div className="flex items-center gap-2">
                  <label className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-gray-300 hover:text-white hover:border-neon-cyan/40 cursor-pointer transition">
                    {uploading ? <Loader2 size={16} className="animate-spin text-neon-cyan" /> : <Upload size={16} className="text-neon-cyan" />}
                    <span className="text-sm truncate">{uploading ? "Envoi en cours..." : "Choisir une image"}</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" disabled={uploading} />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">URL de l'image</label>
                <input required value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white focus:outline-none focus:border-neon-cyan/40" />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Légende / Commentaire de publication</label>
                <textarea rows={3} value={form.caption} onChange={(e) => setForm({ ...form, caption: e.target.value })} placeholder="Ex: En studio à Yaoundé..." className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white focus:outline-none focus:border-neon-cyan/40 resize-none" />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving || uploading} className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50">
                  {saving && <Loader2 size={16} className="animate-spin" />} Enregistrer
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}