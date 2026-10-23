import { Link } from 'react-router-dom';
import { Music2, Instagram, Twitter, Youtube, Facebook } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/[0.06] py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-6">
        <Link to="/" className="font-display font-bold text-xl tracking-wider text-gradient-neon">TABERO AFANN</Link>
        <p className="text-sm text-gray-500 italic">"{t.footer.tagline}"</p>
        <div className="flex items-center gap-4">
          {[Instagram, Twitter, Youtube, Facebook].map((Icon, i) => (
            <a key={i} href="#" onClick={(e) => e.preventDefault()} className="p-2.5 rounded-xl glass text-gray-400 hover:text-neon-cyan transition-all no-select">
              <Icon size={18} />
            </a>
          ))}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Music2 size={14} />
          <span>© {year} Tabero Afann. {t.footer.rights}</span>
        </div>
      </div>
    </footer>
  );
}
