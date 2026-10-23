import { useState } from 'react';
import { Play, Pause, ExternalLink, Music2, Disc, Headphones } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAudioPlayer } from '@/contexts/AudioPlayerContext';
import type { Track, TrackType } from '@/lib/types';

export default function Discography({ tracks }: { tracks: Track[] }) {
  const { t } = useLanguage();
  const { currentTrack, isPlaying, playTrack, togglePlay } = useAudioPlayer();
  const [filter, setFilter] = useState<'all' | TrackType>('all');

  const filtered = filter === 'all' ? tracks : tracks.filter((tr) => tr.type === filter);

  const tabs: { key: 'all' | TrackType; label: string; icon: React.ReactNode }[] = [
    { key: 'all', label: t.discography.all, icon: <Music2 size={16} /> },
    { key: 'single', label: t.discography.singles, icon: <Disc size={16} /> },
    { key: 'album', label: t.discography.albums, icon: <Disc size={16} /> },
    { key: 'beat', label: t.discography.beats, icon: <Headphones size={16} /> },
  ];

  return (
    <section id="discography" className="py-24 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 text-gradient-neon">{t.discography.title}</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">{t.discography.subtitle}</p>
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

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {filtered.map((track) => {
          const isCurrent = currentTrack?.id === track.id;
          const isThisPlaying = isCurrent && isPlaying;
          return (
            <div key={track.id} className="group glass rounded-2xl overflow-hidden hover:border-neon-purple/30 transition-all duration-300">
              <div className="relative aspect-square overflow-hidden">
                {track.cover_url ? (
                  <img src={track.cover_url} alt={track.title} draggable={false} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 no-select" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-obsidian-700 to-obsidian-800 flex items-center justify-center">
                    <Music2 size={48} className="text-gray-600" />
                  </div>
                )}
                {track.audio_url && (
                  <button
                    onClick={() => (isCurrent ? togglePlay() : playTrack(track))}
                    className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <span className="w-14 h-14 rounded-full bg-gradient-neon flex items-center justify-center animate-glow-pulse">
                      {isThisPlaying ? <Pause size={24} className="text-white" /> : <Play size={24} className="text-white ml-1" />}
                    </span>
                  </button>
                )}
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-xs font-medium glass-strong text-neon-cyan uppercase">
                  {track.type}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-display font-semibold text-white text-sm truncate mb-1">{track.title}</h3>
                <p className="text-xs text-gray-500 mb-3">{track.genre} · {new Date(track.release_date).getFullYear()}</p>
                {track.streaming_links && Object.keys(track.streaming_links).length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(track.streaming_links).map(([platform, url]) => (
                      <a key={platform} href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-gray-400 hover:text-neon-cyan transition-colors no-select">
                        <ExternalLink size={12} /> {platform}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
