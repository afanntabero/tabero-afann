import { Link } from 'react-router-dom';
import { Play, Video, Mail } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAudioPlayer } from '@/contexts/AudioPlayerContext';
import type { Track } from '@/lib/types';

export default function Hero({ latestTrack }: { latestTrack?: Track | null }) {
  const { t } = useLanguage();
  const { playTrack } = useAudioPlayer();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <div className="absolute inset-0 bg-gradient-to-br from-obsidian-900 via-obsidian-950 to-black" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-purple/20 rounded-full blur-[120px] animate-glow-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-neon-cyan/15 rounded-full blur-[100px] animate-glow-pulse" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(139,92,246,0.08),transparent_50%)]" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-neon-cyan font-medium mb-8 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
          {t.hero.badge}
        </div>
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-bold tracking-tight mb-6 animate-slide-up">
          <span className="text-gradient-neon">{t.hero.title}</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
          {t.hero.subtitle}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <button
            onClick={() => latestTrack && playTrack(latestTrack)}
            disabled={!latestTrack?.audio_url}
            className="btn-primary flex items-center gap-2 disabled:opacity-50"
          >
            <Play size={20} /> {t.hero.listenNow}
          </button>
          <Link to="/videos" className="btn-secondary flex items-center gap-2">
            <Video size={20} /> {t.hero.watchVideo}
          </Link>
          <Link to="/contact" className="btn-ghost flex items-center gap-2">
            <Mail size={18} /> {t.hero.bookArtist}
          </Link>
        </div>
        {latestTrack?.cover_url && (
          <div className="mt-16 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="relative inline-block">
              <img src={latestTrack.cover_url} alt={latestTrack.title} draggable={false} className="w-48 h-48 md:w-56 md:h-56 rounded-2xl object-cover neon-border no-select" />
              <div className="absolute -inset-3 bg-gradient-neon opacity-20 blur-2xl rounded-3xl -z-10" />
            </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-gray-600 flex items-start justify-center p-1.5">
          <div className="w-1 h-2 rounded-full bg-neon-cyan" />
        </div>
      </div>
    </section>
  );
}
