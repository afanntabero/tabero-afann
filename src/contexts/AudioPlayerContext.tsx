import { createContext, useContext, useRef, useState, useEffect, type ReactNode } from 'react';
import type { Track } from '@/lib/types';

interface AudioPlayerContextValue {
  currentTrack: Track | null;
  isPlaying: boolean;
  progress: number;
  duration: number;
  volume: number;
  playTrack: (track: Track) => void;
  togglePlay: () => void;
  seek: (time: number) => void;
  setVolume: (v: number) => void;
  stop: () => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextValue | null>(null);

export function AudioPlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.7);

  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'metadata';
    audio.volume = volume;
    audioRef.current = audio;
    const onTimeUpdate = () => setProgress(audio.currentTime);
    const onLoaded = () => setDuration(audio.duration);
    const onEnded = () => setIsPlaying(false);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoaded);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoaded);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const playTrack = (track: Track) => {
    const audio = audioRef.current;
    if (!audio || !track.audio_url) return;
    if (currentTrack?.id === track.id) { togglePlay(); return; }
    setCurrentTrack(track);
    audio.src = track.audio_url;
    audio.play().catch(() => {});
  };
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio || !audio.src) return;
    if (audio.paused) { audio.play().catch(() => {}); } else { audio.pause(); }
  };
  const seek = (time: number) => { const audio = audioRef.current; if (audio) { audio.currentTime = time; setProgress(time); } };
  const setVolume = (v: number) => { const audio = audioRef.current; if (audio) audio.volume = v; setVolumeState(v); };
  const stop = () => { const audio = audioRef.current; if (audio) { audio.pause(); audio.src = ''; } setCurrentTrack(null); setIsPlaying(false); setProgress(0); setDuration(0); };

  return <AudioPlayerContext.Provider value={{ currentTrack, isPlaying, progress, duration, volume, playTrack, togglePlay, seek, setVolume, stop }}>{children}</AudioPlayerContext.Provider>;
}

export function useAudioPlayer() {
  const ctx = useContext(AudioPlayerContext);
  if (!ctx) throw new Error('useAudioPlayer must be used within AudioPlayerProvider');
  return ctx;
}
