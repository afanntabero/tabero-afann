import { Link } from 'react-router-dom';
import { Play, Video, Mail } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAudioPlayer } from '@/contexts/AudioPlayerContext';
import type { Track } from '@/lib/types';

export default function Hero({ latestTrack }: { latestTrack?: Track | null }) {
  const { t } = useLanguage();
  const { playTrack } = useAudioPlayer();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-10 pb-16 bg-black">
      {/* Fond noir total et uniforme */}
      <div className="absolute inset-0 bg-black z-0" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center -mt-10">
        {/* Titre principal remonté légèrement */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-tight mb-4 text-white">
          TABERO AFANN
        </h1>

        {/* Sous-texte exact de la maquette en gras */}
        <div className="mb-8 space-y-1">
          <p className="text-2xl md:text-3xl font-display font-bold text-white">
            #M@ ding<span className="text-red-500">❤️</span>
          </p>
          <p className="text-2xl md:text-3xl font-display font-bold text-white">
            min@!.#
          </p>
        </div>

        {/* Boutons d'action */}
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

        {/* Pochette du dernier morceau */}
        {latestTrack?.cover_url && (
          <div className="mt-12 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="relative inline-block">
              <img src={latestTrack.cover_url} alt={latestTrack.title} draggable={false} className="w-44 h-44 md:w-52 md:h-52 rounded-2xl object-cover neon-border no-select" />
              <div className="absolute -inset-3 bg-gradient-neon opacity-20 blur-2xl rounded-3xl -z-10" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}