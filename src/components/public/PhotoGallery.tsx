import { useState, useEffect } from 'react';
import { Heart, MessageSquare, Share2, X, Loader2, Image as ImageIcon, Send, ShieldAlert } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface PhotoItem {
  id: string;
  image_url: string;
  caption: string;
  created_at: string;
}

interface CommentItem {
  id: string;
  author_name: string;
  content: string;
  created_at: string;
}

export default function PhotoGallery() {
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePhoto, setActivePhoto] = useState<PhotoItem | null>(null);

  const [likesCount, setLikesCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [commentInput, setCommentInput] = useState('');
  const [authorInput, setAuthorInput] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

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
      console.error('Erreur chargement galerie photos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPhotos();
  }, []);

  const openPhotoModal = async (photo: PhotoItem) => {
    setActivePhoto(photo);
    setCommentInput('');
    setHasLiked(false);

    try {
      const { count } = await supabase
        .from('photo_likes')
        .select('*', { count: 'exact', head: true })
        .eq('photo_id', photo.id);
      
      setLikesCount(count || 0);
    } catch (err) {
      console.error('Erreur likes:', err);
    }

    try {
      const { data } = await supabase
        .from('photo_comments')
        .select('*')
        .eq('photo_id', photo.id)
        .order('created_at', { ascending: true });

      setComments(data || []);
    } catch (err) {
      console.error('Erreur commentaires:', err);
    }
  };

  const handleLike = async () => {
    if (!activePhoto || hasLiked) return;
    try {
      const { error } = await supabase
        .from('photo_likes')
        .insert([{ photo_id: activePhoto.id }]);

      if (!error) {
        setLikesCount((prev) => prev + 1);
        setHasLiked(true);
      }
    } catch (err) {
      console.error('Erreur lors du like:', err);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePhoto || !commentInput.trim()) return;

    setSubmittingComment(true);
    try {
      const name = authorInput.trim() || 'Visiteur';
      const { data, error } = await supabase
        .from('photo_comments')
        .insert([{ photo_id: activePhoto.id, author_name: name, content: commentInput.trim() }])
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setComments((prev) => [...prev, data]);
        setCommentInput('');
      }
    } catch (err) {
      console.error('Erreur ajout commentaire:', err);
      alert("Erreur lors de l'envoi du commentaire.");
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleShare = () => {
    if (navigator.share && activePhoto) {
      navigator.share({
        title: 'Tabero Afann - Galerie',
        text: activePhoto.caption || 'Découvrez cette photo de Tabero Afann',
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Lien copié dans le presse-papier !');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-neon-cyan" size={36} />
      </div>
    );
  }

  if (photos.length === 0) {
    return null;
  }

  return (
    <section id="gallery" className="py-24 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 text-gradient-neon">Galerie Photo</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">Moments forts et coulisses de Tabero Afann.</p>
      </div>

      {/* Grille de photos sécurisée */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {photos.map((photo) => (
          <button
            key={photo.id}
            onClick={() => openPhotoModal(photo)}
            onContextMenu={(e) => e.preventDefault()}
            className="group glass rounded-2xl overflow-hidden text-left hover:border-neon-cyan/35 transition-all duration-300 no-select relative"
          >
            <div className="relative aspect-square overflow-hidden bg-obsidian-800">
              {photo.image_url ? (
                <>
                  <img
                    src={photo.image_url}
                    alt={photo.caption || 'Galerie'}
                    draggable={false}
                    onContextMenu={(e) => e.preventDefault()}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 pointer-events-none select-none"
                  />
                  {/* Calque de protection invisible */}
                  <div className="absolute inset-0 z-10 bg-transparent" />
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon size={48} className="text-gray-600" />
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                <span className="px-4 py-2 rounded-xl bg-black/70 backdrop-blur-md text-white text-sm font-medium border border-white/10 flex items-center gap-2">
                  <ShieldAlert size={16} className="text-neon-cyan" /> Agrandir & Commenter
                </span>
              </div>
            </div>
            {photo.caption && (
              <div className="p-4">
                <p className="font-display text-gray-300 text-sm line-clamp-2">"{photo.caption}"</p>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Modale sécurisée (sans téléchargement) */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in"
          onClick={() => setActivePhoto(null)}
        >
          <div
            className="relative w-full max-w-4xl glass-strong rounded-3xl overflow-hidden flex flex-col lg:flex-row max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute top-4 right-4 z-30 p-2 rounded-full bg-black/70 text-gray-400 hover:text-white transition"
            >
              <X size={22} />
            </button>

            {/* Partie gauche : Photo ultra-protégée */}
            <div 
              className="lg:w-3/5 bg-black flex items-center justify-center relative overflow-hidden select-none"
              onContextMenu={(e) => e.preventDefault()}
            >
              <img
                src={activePhoto.image_url}
                alt="Aperçu protégé"
                className="max-h-[70vh] lg:max-h-[90vh] w-full object-contain pointer-events-none select-none"
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
              />
              <div className="absolute inset-0 z-10 bg-transparent" />
            </div>

            {/* Partie droite : Infos, Likes et Commentaires */}
            <div className="lg:w-2/5 flex flex-col h-[60vh] lg:h-[90vh] bg-obsidian-900/95 border-l border-white/[0.08]">
              <div className="p-4 border-b border-white/[0.08]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-500">{new Date(activePhoto.created_at).toLocaleDateString()}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-neon-cyan/10 text-neon-cyan font-mono">Protégé 🔒</span>
                </div>
                <p className="text-white text-sm font-medium leading-relaxed">{activePhoto.caption || 'Aucune légende'}</p>
              </div>

              <div className="px-4 py-3 border-b border-white/[0.08] flex items-center justify-between text-xs text-gray-400">
                <span>❤️ {likesCount} J'aime</span>
                <span>💬 {comments.length} Commentaires</span>
              </div>

              <div className="flex border-b border-white/[0.08] p-1">
                <button
                  onClick={handleLike}
                  disabled={hasLiked}
                  className={`flex-1 py-2 flex items-center justify-center gap-2 rounded-xl text-xs font-semibold transition ${
                    hasLiked ? 'text-neon-pink bg-neon-pink/10' : 'text-gray-300 hover:bg-white/[0.04]'
                  }`}
                >
                  <Heart size={16} className={hasLiked ? 'fill-current' : ''} /> {hasLiked ? 'Aimé' : "J'aime"}
                </button>
                <button
                  onClick={handleShare}
                  className="flex-1 py-2 flex items-center justify-center gap-2 rounded-xl text-xs font-semibold text-gray-300 hover:bg-white/[0.04] transition"
                >
                  <Share2 size={16} /> Partager
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {comments.length === 0 ? (
                  <p className="text-xs text-gray-500 text-center py-8">Soyez le premier à commenter cette photo !</p>
                ) : (
                  comments.map((comm) => (
                    <div key={comm.id} className="bg-white/[0.03] rounded-xl p-3 border border-white/[0.05]">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-neon-cyan">{comm.author_name}</span>
                        <span className="text-[10px] text-gray-500">{new Date(comm.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-xs text-gray-300 leading-relaxed">{comm.content}</p>
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={handleAddComment} className="p-3 border-t border-white/[0.08] bg-black/40 space-y-2">
                <input
                  type="text"
                  placeholder="Votre nom ou pseudo..."
                  value={authorInput}
                  onChange={(e) => setAuthorInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-neon-cyan/40"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Écrire un commentaire..."
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-neon-cyan/40"
                  />
                  <button
                    type="submit"
                    disabled={submittingComment}
                    className="p-2.5 rounded-xl bg-gradient-neon text-white flex items-center justify-center hover:opacity-90 disabled:opacity-50 transition"
                  >
                    {submittingComment ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}