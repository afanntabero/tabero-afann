import { useState, useEffect } from 'react';
import VideoGallery from '@/components/public/VideoGallery';
import { fetchVideos } from '@/services/api';
import type { Video } from '@/lib/types';

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  useEffect(() => { fetchVideos().then(setVideos).catch(() => {}); }, []);
  return (
    <div className="pt-20">
      <VideoGallery videos={videos} />
    </div>
  );
}
