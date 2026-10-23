import { useState } from 'react';
import { Play, X, Music2, Camera, Mic } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Video, VideoType } from '@/lib/types';

export default function VideoGallery({ videos }: { videos: Video[] }) {
  const { t } = useLanguage();
  const [filter, setFilter] = useState<'all' | VideoType>('all');
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);

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
            onClick={() => setActiveVideo(video)}
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in" onClick={() => setActiveVideo(null)}>
          <div className="relative w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setActiveVideo(null)} className="absolute -top-12 right-0 text-gray-400 hover:text-white transition-colors">
              <X size={28} />
            </button>
            <div className="relative aspect-video rounded-2xl overflow-hidden neon-border no-select" onContextMenu={(e) => e.preventDefault()}>
              <iframe
                src={getEmbedUrl(activeVideo.video_url)}
                title={activeVideo.title}
                className="w-full h-full"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                draggable={false}
              />
            </div>
            <h3 className="mt-4 font-display font-semibold text-white text-lg">{activeVideo.title}</h3>
          </div>
        </div>
      )}
    </section>
  );
}
