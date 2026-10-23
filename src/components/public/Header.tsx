import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe, Lock, ShoppingBag } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

export default function Header() {
  const { t, lang, toggleLang } = useLanguage();
  const { totalItems, openCart } = useCart();
  const { session } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    async function checkAdminStatus() {
      if (!session?.user) {
        setIsAdmin(false);
        return;
      }

      try {
        const { data } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single();

        setIsAdmin(data?.is_admin === true);
      } catch {
        setIsAdmin(false);
      }
    }

    checkAdminStatus();
  }, [session]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const links = [
    { to: '/', label: t.nav.home },
    { to: '/music', label: t.nav.music },
    { to: '/videos', label: t.nav.videos },
    { to: '/epk', label: t.nav.epk },
    { to: '/tour', label: t.nav.tour },
    { to: '/store', label: t.nav.store },
    { to: '/contact', label: t.nav.contact },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass-strong shadow-lg shadow-black/30' : 'bg-transparent'}`}>
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="font-display font-bold text-xl tracking-wider text-gradient-neon">TABERO AFANN</Link>
        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${location.pathname === l.to ? 'text-white neon-border' : 'text-gray-400 hover:text-white'}`}>
              {l.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button onClick={toggleLang} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white glass transition-all">
            <Globe size={16} />
            <span className="uppercase">{lang}</span>
          </button>
          <button onClick={openCart} className="relative p-2 rounded-lg text-gray-300 hover:text-white glass transition-all">
            <ShoppingBag size={18} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-neon text-white text-xs font-bold flex items-center justify-center animate-glow-pulse">{totalItems}</span>
            )}
          </button>

          {/* Affiché UNIQUEMENT si l'utilisateur est un administrateur */}
          {isAdmin && (
            <Link to="/admin" className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-neon-purple transition-all">
              <Lock size={16} />
              {t.nav.admin}
            </Link>
          )}

          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-lg text-gray-300 hover:text-white glass">
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>
      {menuOpen && (
        <div className="md:hidden glass-strong border-t border-white/[0.06] animate-fade-in">
          <div className="px-6 py-4 flex flex-col gap-1">
            {links.map((l) => (
              <Link key={l.to} to={l.to} className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${location.pathname === l.to ? 'text-white bg-white/[0.05]' : 'text-gray-400 hover:text-white'}`}>
                {l.label}
              </Link>
            ))}

            {/* Affiché UNIQUEMENT sur mobile si l'utilisateur est un administrateur */}
            {isAdmin && (
              <Link to="/admin" className="px-4 py-3 rounded-lg text-sm font-medium text-gray-400 hover:text-white flex items-center gap-2">
                <Lock size={16} /> {t.nav.admin}
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}