import { Play, Pause, SkipBack, Volume2, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAudioPlayer } from '@/contexts/AudioPlayerContext';

function formatTime(s: number) {
  if (!s || isNaN(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

export default function AudioPlayer() {
  const { t } = useLanguage();
  const { currentTrack, isPlaying, progress, duration, volume, togglePlay, seek, setVolume, stop } = useAudioPlayer();

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 glass-strong border-t border-white/[0.08] animate-fade-in no-select">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {currentTrack.cover_url ? (
            <img src={currentTrack.cover_url} alt={currentTrack.title} draggable={false} className="w-12 h-12 rounded-lg object-cover no-select" />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-gradient-neon flex items-center justify-center">
              <Play size={20} className="text-white" />
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">{currentTrack.title}</p>
            <p className="text-xs text-gray-500 truncate">{currentTrack.genre}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => seek(Math.max(0, progress - 10))} className="p-2 rounded-lg text-gray-400 hover:text-white transition-colors">
            <SkipBack size={18} />
          </button>
          <button onClick={togglePlay} className="w-10 h-10 rounded-full bg-gradient-neon flex items-center justify-center hover:opacity-90 transition-opacity">
            {isPlaying ? <Pause size={18} className="text-white" /> : <Play size={18} className="text-white ml-0.5" />}
          </button>
          <button onClick={stop} className="p-2 rounded-lg text-gray-400 hover:text-error-400 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2 flex-1 max-w-md">
          <span className="text-xs text-gray-500 w-10 text-right">{formatTime(progress)}</span>
          <input
            type="range"
            min={0} max={duration || 0} value={progress}
            onChange={(e) => seek(Number(e.target.value))}
            className="flex-1 h-1.5 rounded-full bg-white/10 appearance-none cursor-pointer accent-neon-purple"
          />
          <span className="text-xs text-gray-500 w-10">{formatTime(duration)}</span>
        </div>

        <div className="hidden md:flex items-center gap-2">
          <Volume2 size={18} className="text-gray-400" />
          <input
            type="range" min={0} max={1} step={0.01} value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-20 h-1.5 rounded-full bg-white/10 appearance-none cursor-pointer accent-neon-cyan"
          />
        </div>
      </div>
      <span className="sr-only">{t.discography.playPreview}</span>
    </div>
  );
}
