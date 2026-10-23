import { useState, useEffect } from 'react';
import Hero from '@/components/public/Hero';
import Discography from '@/components/public/Discography';
import VideoGallery from '@/components/public/VideoGallery';
import EPK from '@/components/public/EPK';
import Tour from '@/components/public/Tour';
import Newsletter from '@/components/public/Newsletter';
import Contact from '@/components/public/Contact';
import { fetchTracks, fetchVideos, fetchEvents } from '@/services/api';
import type { Track, Video, Event } from '@/lib/types';

export default function HomePage() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    Promise.all([fetchTracks(), fetchVideos(), fetchEvents()])
      .then(([t, v, e]) => { setTracks(t); setVideos(v); setEvents(e); })
      .catch(() => {});
  }, []);

  return (
    <>
      <Hero latestTrack={tracks[0]} />
      <Discography tracks={tracks} />
      <VideoGallery videos={videos} />
      <EPK />
      <Tour events={events} />
      <Newsletter />
      <Contact />
    </>
  );
}
