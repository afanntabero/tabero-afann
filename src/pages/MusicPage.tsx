import { useState, useEffect } from 'react';
import Discography from '@/components/public/Discography';
import { fetchTracks } from '@/services/api';
import type { Track } from '@/lib/types';

export default function MusicPage() {
  const [tracks, setTracks] = useState<Track[]>([]);
  useEffect(() => { fetchTracks().then(setTracks).catch(() => {}); }, []);
  return (
    <div className="pt-20">
      <Discography tracks={tracks} />
    </div>
  );
}
