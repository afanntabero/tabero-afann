import { ExternalLink, User, ImageIcon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import PhotoGallery from '@/components/public/PhotoGallery';

export default function EPK() {
  const { t } = useLanguage();

  // Lien officiel direct du Press-Book de l'artiste
  const pressBookUrl = "https://cdn.fbsbx.com/v/t59.2708-21/759058494_1539945743672323_6814954476588726906_n.pdf/pressbook_organized-2.pdf?_nc_cat=107&ccb=1-7&_nc_sid=2b0e22&_nc_ohc=MeVeG2ocHoQ7kNvwFmP2el&_nc_oc=AdpG2FORB5vlwETqdBxBMwnLnPwvc2TH1FGm-pbBl_ZbyiZpypOGptaKxCpx_WhD89-ZZAdg4ejKWY2UkwAlhE6&_nc_zt=7&_nc_ht=cdn.fbsbx.com&_nc_gid=XmliJjZ4UTFXYkEOR4Q&_nc_ss=7b2a8&oh=03_Q7CdD6F9SDdAzJQydQuyQtmuWHjkBAwnpGX4wWPzRkz4homHHq&oe=6ADF9DD8&dl=1#no_universal_links";

  return (
    <section id="epk" className="py-24 px-6 max-w-7xl mx-auto space-y-20">
      {/* En-tête de section */}
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 text-gradient-gold">{t.epk.title}</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">{t.epk.subtitle}</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Colonne Biographie */}
        <div className="space-y-6 glass p-8 rounded-3xl border border-white/10">
          <div className="flex items-center gap-3">
            <User className="text-neon-purple" size={24} />
            <h3 className="text-2xl font-display font-semibold text-white">{t.epk.bio}</h3>
          </div>
          <p className="text-gray-300 leading-relaxed text-base">{t.epk.bioText}</p>
          
          <div className="pt-2">
            <a
              href={pressBookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-gold text-white font-display font-medium hover:opacity-90 shadow-lg transition-all"
            >
              <ExternalLink size={20} /> Consulter le Dossier de Presse officiel
            </a>
          </div>
        </div>

        {/* Colonne Plateformes de Streaming */}
        <div className="space-y-6 glass p-8 rounded-3xl border border-white/10">
          <div>
            <h3 className="text-sm font-display font-semibold text-gray-400 uppercase tracking-wider mb-4">
              {t.epk.streamingBadges || "Plateformes de Streaming Officielles"}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {['Spotify', 'Apple Music', 'YouTube', 'SoundCloud', 'Deezer'].map((p) => (
                <span 
                  key={p} 
                  className="px-4 py-3 rounded-xl glass text-sm font-medium text-gray-300 hover:text-neon-cyan hover:border-neon-cyan/30 transition-all text-center flex items-center justify-center"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Intégration de notre Galerie Photo sécurisée et dynamique */}
      <div className="pt-12 border-t border-white/10">
        <PhotoGallery />
      </div>
    </section>
  );
}