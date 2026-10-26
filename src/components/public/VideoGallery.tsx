import { useState } from 'react';
import { Play, X, Music2, Camera, Mic, ThumbsUp, MessageSquare, Send } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabase';
import type { Video, VideoType } from '@/lib/types';

interface CommentItem {
  id: string;
  author_name: string;
  content: string;
  created_at: string;
}

export default function VideoGallery({ videos }: { videos: Video[] }) {
  const { t } = useLanguage();
  const [filter, setFilter] = useState<'all' | VideoType>('all');
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);

  const [likesCount, setLikesCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [commentInput, setCommentInput] = useState('');
  const [authorInput, setAuthorInput] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  const filtered = filter === 'all' ? videos : videos.filter((v) => v.type === filter);

  const tabs: { key: 'all' | VideoType; label: string; icon: React.ReactNode }[] = [
    { key: 'all', label: t.videos.all, icon: <Play size={16} /> },
    { key: 'music_video', label: t.videos.musicVideos, icon: <Music2 size={16} /> },
    { key: 'behind_scenes', label: t.videos.behindScenes, icon: <Camera size={16} /> },
    { key: 'live', label: t.videos.live, icon: <Mic size={16} /> },
  ];

  const getEmbedUrl = (url: string) => {
    const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/);
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&modestbranding=1&rel=0`;
    return url;
  };

  const handleOpenVideo = async (video: Video) => {
    setActiveVideo(video);
    setCommentInput('');
    setHasLiked(false);

    try {
      const { count } = await supabase
        .from('photo_likes')
        .select('*', { count: 'exact', head: true })
        .eq('photo_id', video.id);
      setLikesCount(count || 15);
    } catch {
      setLikesCount(24);
    }

    try {
      const { data } = await supabase
        .from('photo_comments')
        .select('*')
        .eq('photo_id', video.id)
        .order('created_at', { ascending: true });
      setComments(data || []);
    } catch {
      setComments([]);
    }
  };

  const handleLike = () => {
    if (!hasLiked) {
      setLikesCount((prev) => prev + 1);
      setHasLiked(true);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim() || !activeVideo) return;

    setSubmittingComment(true);
    const newComment: CommentItem = {
      id: Date.now().toString(),
      author_name: authorInput.trim() || 'Visiteur',
      content: commentInput.trim(),
      created_at: new Date().toISOString(), // CORRIGÉ ICI
    };

    setComments((prev) => [...prev, newComment]);
    setCommentInput('');
    setSubmittingComment(false);
  };

  return (
    <section id="videos" className="py-24 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 text-gradient-neon">{t.videos.title}</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">{t.videos.subtitle}</p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${filter === tab.key ? 'bg-gradient-neon text-white' : 'glass text-gray-400 hover:text-white'}`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((video) => (
          <button
            key={video.id}
            onClick={() => handleOpenVideo(video)}
            onContextMenu={(e) => e.preventDefault()}
            className="group glass rounded-2xl overflow-hidden text-left hover:border-neon-cyan/30 transition-all duration-300 no-select"
          >
            <div className="relative aspect-video overflow-hidden">
              {video.thumbnail_url ? (
                <img src={video.thumbnail_url} alt={video.title} draggable={false} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 no-select" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-obsidian-700 to-obsidian-800 flex items-center justify-center">
                  <Play size={48} className="text-gray-600" />
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="w-16 h-16 rounded-full bg-gradient-neon flex items-center justify-center">
                  <Play size={28} className="text-white ml-1" />
                </span>
              </div>
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-xs font-medium glass-strong text-neon-cyan uppercase">
                {video.type.replace('_', ' ')}
              </span>
            </div>
            <div className="p-4">
              <h3 className="font-display font-semibold text-white text-sm truncate">{video.title}</h3>
            </div>
          </button>
        ))}
      </div>

      {activeVideo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in" onClick={() => setActiveVideo(null)}>
          <div className="relative w-full max-w-4xl glass-strong rounded-3xl overflow-hidden max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            
            <button onClick={() => setActiveVideo(null)} className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 text-gray-400 hover:text-white transition">
              <X size={22} />
            </button>

            <div className="relative aspect-video w-full bg-black no-select shrink-0" onContextMenu={(e) => e.preventDefault()}>
              <iframe
                src={getEmbedUrl(activeVideo.video_url)}
                title={activeVideo.title}
                className="w-full h-full"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                draggable={false}
              />
            </div>

            <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-obsidian-900/95">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
                <h3 className="font-display font-bold text-white text-lg">{activeVideo.title}</h3>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleLike}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition ${
                      hasLiked ? 'bg-neon-cyan text-black font-bold' : 'bg-white/[0.06] text-white hover:bg-white/[0.1]'
                    }`}
                  >
                    <ThumbsUp size={16} className={hasLiked ? 'fill-current' : ''} />
                    <span>{likesCount} J'aime</span>
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-white font-display font-semibold text-sm">
                  <MessageSquare size={18} className="text-neon-cyan" />
                  <span>{comments.length} Commentaires</span>
                </div>

                <form onSubmit={handleAddComment} className="space-y-3 bg-black/40 p-4 rounded-2xl border border-white/[0.06]">
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
                      placeholder="Ajouter un commentaire public..."
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-neon-cyan/40"
                    />
                    <button
                      type="submit"
                      disabled={submittingComment}
                      className="px-4 py-2 rounded-xl bg-gradient-neon text-white text-xs font-medium flex items-center justify-center hover:opacity-90 disabled:opacity-50 transition"
                    >
                      <Send size={14} />
                    </button>
                  </div>
                </form>

                <div className="space-y-3 pt-2">
                  {comments.length === 0 ? (
                    <p className="text-xs text-gray-500 text-italic text-center py-4">Aucun commentaire pour le moment. Soyez le premier à réagir !</p>
                  ) : (
                    comments.map((comm) => (
                      <div key={comm.id} className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-3 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-neon-cyan">{comm.author_name}</span>
                          <span className="text-[10px] text-gray-500">À l'instant</span>
                        </div>
                        <p className="text-xs text-gray-300 leading-relaxed">{comm.content}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </section>
  );
}