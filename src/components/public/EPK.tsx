import { Download, User, ImageIcon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAudioPlayer } from '@/contexts/AudioPlayerContext';

export default function EPK() {
  const { t } = useLanguage();
  const { currentTrack } = useAudioPlayer();

  return (
    <section id="epk" className="py-24 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 text-gradient-gold">{t.epk.title}</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">{t.epk.subtitle}</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <User className="text-neon-purple" size={24} />
            <h3 className="text-2xl font-display font-semibold text-white">{t.epk.bio}</h3>
          </div>
          <p className="text-gray-400 leading-relaxed text-lg">{t.epk.bioText}</p>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-gold text-white font-display font-medium hover:opacity-90 transition-all"
          >
            <Download size={20} /> {t.epk.downloadPress}
          </a>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-display font-semibold text-white mb-4 flex items-center gap-2">
              <ImageIcon size={20} className="text-neon-cyan" /> {t.epk.gallery}
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {currentTrack?.cover_url && (
                <img src={currentTrack.cover_url} alt="" draggable={false} className="aspect-square rounded-xl object-cover glass no-select" />
              )}
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="aspect-square rounded-xl glass flex items-center justify-center bg-gradient-to-br from-obsidian-700 to-obsidian-800">
                  <ImageIcon size={24} className="text-gray-600" />
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-display font-semibold text-gray-500 uppercase tracking-wider mb-3">{t.epk.streamingBadges}</h3>
            <div className="flex flex-wrap gap-3">
              {['Spotify', 'Apple Music', 'YouTube', 'SoundCloud', 'Deezer'].map((p) => (
                <span key={p} className="px-4 py-2 rounded-lg glass text-sm text-gray-300 hover:text-neon-cyan transition-colors">{p}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
