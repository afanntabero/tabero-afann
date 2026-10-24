import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Globe, Lock, ShoppingBag, ShieldAlert, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';

export default function Header() {
  const { t, lang, toggleLang } = useLanguage();
  const { totalItems, openCart } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

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

  const handleAdminClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowAdminModal(true);
  };

  const handleReturnToSite = () => {
    setShowAdminModal(false);
    navigate('/');
  };

  const handleProceedToLogin = () => {
    setShowAdminModal(false);
    navigate('/admin');
  };

  return (
    <>
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

            {/* Bouton Admin déclenchant le message d'avertissement */}
            <button onClick={handleAdminClick} className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-neon-purple transition-all">
              <Lock size={16} />
              {t.nav.admin}
            </button>

            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-lg text-gray-300 hover:text-white glass">
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>

        {/* Menu Mobile */}
        {menuOpen && (
          <div className="md:hidden glass-strong border-t border-white/[0.06] animate-fade-in">
            <div className="px-6 py-4 flex flex-col gap-1">
              {links.map((l) => (
                <Link key={l.to} to={l.to} className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${location.pathname === l.to ? 'text-white bg-white/[0.05]' : 'text-gray-400 hover:text-white'}`}>
                  {l.label}
                </Link>
              ))}

              <button onClick={handleAdminClick} className="px-4 py-3 rounded-lg text-sm font-medium text-gray-400 hover:text-white flex items-center gap-2 text-left w-full">
                <Lock size={16} /> {t.nav.admin}
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Modal d'Avertissement Accès Restreint */}
      {showAdminModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="glass-strong border border-white/10 rounded-2xl p-6 max-w-md w-full text-center shadow-2xl relative">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
              <ShieldAlert size={32} />
            </div>

            <h3 className="text-xl font-bold text-white mb-2">Accès Restreint</h3>
            
            <p className="text-gray-300 text-sm mb-6 leading-relaxed">
              Cette partie est strictement réservée à l'administrateur du site.
            </p>

            <div className="flex flex-col gap-3">
              <button 
                onClick={handleReturnToSite}
                className="w-full py-3 px-4 rounded-xl font-medium bg-gradient-neon text-white flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-purple-500/25"
              >
                <ArrowLeft size={18} />
                Retourner sur le site
              </button>

              <button 
                onClick={handleProceedToLogin}
                className="text-xs text-gray-500 hover:text-gray-300 transition-colors pt-2 underline"
              >
                Je suis l'administrateur (Se connecter)
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}