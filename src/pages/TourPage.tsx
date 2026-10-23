import { useState, useEffect } from 'react';
import Tour from '@/components/public/Tour';
import { fetchEvents } from '@/services/api';
import type { Event } from '@/lib/types';

export default function TourPage() {
  const [events, setEvents] = useState<Event[]>([]);
  useEffect(() => { fetchEvents().then(setEvents).catch(() => {}); }, []);
  return (
    <div className="pt-20">
      <Tour events={events} />
    </div>
  );
}
