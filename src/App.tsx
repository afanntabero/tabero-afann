import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { AudioPlayerProvider } from '@/contexts/AudioPlayerContext';
import { CartProvider } from '@/contexts/CartContext';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import AudioPlayer from '@/components/public/AudioPlayer';
import CartDrawer from '@/components/public/CartDrawer';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import HomePage from '@/pages/HomePage';
import MusicPage from '@/pages/MusicPage';
import VideosPage from '@/pages/VideosPage';
import EPKPage from '@/pages/EPKPage';
import TourPage from '@/pages/TourPage';
import ContactPage from '@/pages/ContactPage';
import StorePage from '@/pages/StorePage';
import AdminPage from '@/pages/AdminPage';
import MusicManager from '@/components/admin/MusicManager';
import VideoManager from '@/components/admin/VideoManager';
import TourManager from '@/components/admin/TourManager';
import SubscriberHub from '@/components/admin/SubscriberHub';
import StoreManager from '@/components/admin/StoreManager';
import OrdersManager from '@/components/admin/OrdersManager';
import MessagesManager from '@/components/admin/MessagesManager';
import CheckoutModal from '@/components/public/CheckoutModal';

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-obsidian-950">
      <Header />
      <main>{children}</main>
      <Footer />
      <AudioPlayer />
      <CartDrawer />
      <CheckoutModal />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AudioPlayerProvider>
          <CartProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
                <Route path="/music" element={<PublicLayout><MusicPage /></PublicLayout>} />
                <Route path="/videos" element={<PublicLayout><VideosPage /></PublicLayout>} />
                <Route path="/epk" element={<PublicLayout><EPKPage /></PublicLayout>} />
                <Route path="/tour" element={<PublicLayout><TourPage /></PublicLayout>} />
                <Route path="/store" element={<PublicLayout><StorePage /></PublicLayout>} />
                <Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/admin/music" element={<ProtectedRoute><MusicManager /></ProtectedRoute>} />
                <Route path="/admin/video" element={<ProtectedRoute><VideoManager /></ProtectedRoute>} />
                <Route path="/admin/tour" element={<ProtectedRoute><TourManager /></ProtectedRoute>} />
                <Route path="/admin/subscribers" element={<ProtectedRoute><SubscriberHub /></ProtectedRoute>} />
                <Route path="/admin/store" element={<ProtectedRoute><StoreManager /></ProtectedRoute>} />
                <Route path="/admin/orders" element={<ProtectedRoute><OrdersManager /></ProtectedRoute>} />
                <Route path="/admin/messages" element={<ProtectedRoute><MessagesManager /></ProtectedRoute>} />
              </Routes>
            </BrowserRouter>
          </CartProvider>
        </AudioPlayerProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
