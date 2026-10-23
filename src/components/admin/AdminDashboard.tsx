import { Link } from 'react-router-dom';
import { Music2, Video, Calendar, Users, ShoppingBag, Package, Mail, LogOut, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminDashboard() {
  const { t } = useLanguage();
  const { session, signOut } = useAuth();

  const cards = [
    { to: 'music', icon: Music2, title: t.admin.dashboard.musicManager, desc: t.admin.dashboard.musicManagerDesc, color: 'neon-purple' },
    { to: 'video', icon: Video, title: t.admin.dashboard.videoManager, desc: t.admin.dashboard.videoManagerDesc, color: 'neon-cyan' },
    { to: 'tour', icon: Calendar, title: t.admin.dashboard.tourManager, desc: t.admin.dashboard.tourManagerDesc, color: 'gold-400' },
    { to: 'subscribers', icon: Users, title: t.admin.dashboard.subscriberHub, desc: t.admin.dashboard.subscriberHubDesc, color: 'neon-pink' },
    { to: 'store', icon: ShoppingBag, title: t.admin.dashboard.storeManager, desc: t.admin.dashboard.storeManagerDesc, color: 'neon-cyan' },
    { to: 'orders', icon: Package, title: t.admin.dashboard.ordersManager, desc: t.admin.dashboard.ordersManagerDesc, color: 'gold-400' },
    { to: 'messages', icon: Mail, title: t.admin.dashboard.messagesManager, desc: t.admin.dashboard.messagesManagerDesc, color: 'neon-pink' },
  ];

  return (
    <div className="min-h-screen px-6 py-10 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-1">{t.admin.dashboard.title}</h1>
          <p className="text-gray-400 text-sm">{t.admin.dashboard.welcome}, {session?.user?.email ?? 'Admin'}</p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/" className="btn-ghost flex items-center gap-2"><ExternalLink size={16} /> {t.admin.dashboard.backToSite}</Link>
          <button onClick={signOut} className="btn-secondary flex items-center gap-2 text-error-400"><LogOut size={16} /> {t.admin.dashboard.logout}</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <Link key={card.to} to={`/admin/${card.to}`} className="group glass rounded-2xl p-6 hover:border-white/20 transition-all duration-300">
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 bg-${card.color}/10 text-${card.color} group-hover:scale-110 transition-transform`}>
              <card.icon size={24} />
            </div>
            <h3 className="font-display font-semibold text-white mb-1">{card.title}</h3>
            <p className="text-sm text-gray-500">{card.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
