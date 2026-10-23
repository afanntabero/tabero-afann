import { Calendar, MapPin, Ticket } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Event as EventType } from '@/lib/types';

const statusColors: Record<string, string> = {
  available: 'text-success-400 bg-success-400/10 border-success-400/30',
  sold_out: 'text-error-400 bg-error-400/10 border-error-400/30',
  limited: 'text-warning-400 bg-warning-400/10 border-warning-400/30',
};

export default function Tour({ events }: { events: EventType[] }) {
  const { t } = useLanguage();
  const now = new Date();
  const upcoming = events.filter((e) => new Date(e.date) >= now);

  return (
    <section id="tour" className="py-24 px-6 max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 text-gradient-neon">{t.tour.title}</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">{t.tour.subtitle}</p>
      </div>

      {upcoming.length === 0 ? (
        <div className="text-center py-16 glass rounded-2xl">
          <Calendar size={48} className="mx-auto text-gray-600 mb-4" />
          <p className="text-gray-500">{t.tour.noShows}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {upcoming.map((event) => {
            const date = new Date(event.date);
            return (
              <div key={event.id} className="glass rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 hover:border-neon-purple/30 transition-all">
                <div className="flex flex-col items-center justify-center w-16 h-16 rounded-xl bg-gradient-neon text-white flex-shrink-0">
                  <span className="text-xs uppercase font-medium opacity-80">{date.toLocaleDateString('en', { month: 'short' })}</span>
                  <span className="text-2xl font-display font-bold">{date.getDate()}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-display font-semibold text-white text-lg mb-1">{event.venue}</h3>
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <MapPin size={14} /> {event.city}, {event.country}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${statusColors[event.ticket_status]}`}>
                    {t.tour[({ available: 'available', sold_out: 'soldOut', limited: 'limited' } as const)[event.ticket_status]]}
                  </span>
                  {event.ticket_url && event.ticket_status !== 'sold_out' && (
                    <a href={event.ticket_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-neon text-white text-sm font-medium hover:opacity-90 transition-all no-select">
                      <Ticket size={16} /> {t.tour.buyTickets}
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
