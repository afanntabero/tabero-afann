import { useState, useEffect } from 'react';
import { ShoppingBag, Play, Pause, Download, Plus, Eye, X, Check, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { useAudioPlayer } from '@/contexts/AudioPlayerContext';
import { fetchProducts } from '@/services/api';
import type { Product, ProductCategory } from '@/lib/types';

export default function Store() {
  const { t } = useLanguage();
  const { addItem } = useCart();
  const { togglePlay, isPlaying } = useAudioPlayer();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | ProductCategory>('all');
  const [quickView, setQuickView] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [added, setAdded] = useState<string | null>(null);

  useEffect(() => { fetchProducts().then(setProducts).catch(() => {}).finally(() => setLoading(false)); }, []);

  const filtered = filter === 'all' ? products : products.filter((p) => p.category === filter);

  const tabs: { key: 'all' | ProductCategory; label: string; icon: React.ReactNode }[] = [
    { key: 'all', label: t.store.all, icon: <ShoppingBag size={16} /> },
    { key: 'merch', label: t.store.merch, icon: <ShoppingBag size={16} /> },
    { key: 'digital', label: t.store.digital, icon: <Download size={16} /> },
  ];

  const handleAddToCart = (product: Product, size: string = '') => {
    addItem(product, size, 1);
    setAdded(product.id);
    setTimeout(() => setAdded(null), 1500);
  };

  const openQuickView = (product: Product) => {
    setQuickView(product);
    setSelectedSize(product.sizes?.[0] ?? '');
  };

  const formatPrice = (price: number, currency: string) => {
    const symbol = currency === 'EUR' ? '€' : currency === 'USD' ? '$' : currency;
    return `${price.toFixed(2)} ${symbol}`;
  };

  const stockBadge = (stock: number, isDigital: boolean) => {
    if (isDigital) return <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30">{t.store.download}</span>;
    if (stock === 0) return <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-error-400/10 text-error-400 border border-error-400/30">{t.store.outOfStock}</span>;
    if (stock <= 10) return <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-warning-400/10 text-warning-400 border border-warning-400/30">{t.store.lowStock}</span>;
    return <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-success-400/10 text-success-400 border border-success-400/30">{t.store.inStock}</span>;
  };

  return (
    <section id="store" className="py-24 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 text-gradient-neon">{t.store.title}</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">{t.store.subtitle}</p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {tabs.map((tab) => (
          <button key={tab.key} onClick={() => setFilter(tab.key)} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${filter === tab.key ? 'bg-gradient-neon text-white' : 'glass text-gray-400 hover:text-white'}`}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 size={32} className="animate-spin text-neon-purple" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-500">No products available.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((product) => {
            const isDigital = product.category === 'digital';
            return (
              <div key={product.id} className="group glass rounded-2xl overflow-hidden hover:border-neon-purple/30 transition-all duration-300 flex flex-col">
                <div className="relative aspect-square overflow-hidden bg-obsidian-700 flex items-center justify-center">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.title} draggable={false} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 no-select" />
                  ) : (
                    <div className={`w-full h-full flex items-center justify-center ${isDigital ? 'bg-gradient-to-br from-neon-purple/10 to-neon-cyan/10' : 'bg-gradient-to-br from-obsidian-700 to-obsidian-800'}`}>
                      {isDigital ? <Download size={48} className="text-neon-cyan/40" /> : <ShoppingBag size={48} className="text-gray-600" />}
                    </div>
                  )}
                  <span className="absolute top-3 left-3">{stockBadge(product.stock, isDigital)}</span>
                  <button onClick={() => openQuickView(product)} className="absolute top-3 right-3 p-2 rounded-lg glass-strong text-gray-300 hover:text-neon-cyan transition-colors opacity-0 group-hover:opacity-100 duration-300">
                    <Eye size={16} />
                  </button>
                  {isDigital && product.audio_url && (
                    <button onClick={togglePlay} className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="w-14 h-14 rounded-full bg-gradient-neon flex items-center justify-center animate-glow-pulse">
                        {isPlaying ? <Pause size={24} className="text-white" /> : <Play size={24} className="text-white ml-1" />}
                      </span>
                    </button>
                  )}
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-display font-semibold text-white text-sm truncate mb-1">{product.title}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2 mb-3 flex-1">{product.description}</p>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-lg font-display font-bold text-gradient-neon">{formatPrice(product.price, product.currency)}</span>
                    <button
                      onClick={() => handleAddToCart(product, product.sizes?.[0] ?? '')}
                      disabled={product.stock === 0 && !isDigital}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-neon text-white text-sm font-medium hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {added === product.id ? <Check size={16} /> : <Plus size={16} />}
                      {added === product.id ? 'Added' : t.store.addToCart}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {quickView && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fade-in" onClick={() => setQuickView(null)}>
          <div className="glass-strong rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-display font-bold text-white">{quickView.title}</h3>
              <button onClick={() => setQuickView(null)} className="p-2 rounded-lg text-gray-400 hover:text-white"><X size={20} /></button>
            </div>
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="w-full sm:w-48 aspect-square rounded-xl overflow-hidden bg-obsidian-700 flex items-center justify-center flex-shrink-0">
                {quickView.image_url ? (
                  <img src={quickView.image_url} alt={quickView.title} draggable={false} className="w-full h-full object-cover no-select" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-obsidian-700 to-obsidian-800">
                    {quickView.category === 'digital' ? <Download size={40} className="text-neon-cyan/40" /> : <ShoppingBag size={40} className="text-gray-600" />}
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-3">
                <p className="text-sm text-gray-400">{quickView.description}</p>
                <div className="flex items-center gap-2">
                  {stockBadge(quickView.stock, quickView.category === 'digital')}
                  <span className="text-2xl font-display font-bold text-gradient-neon">{formatPrice(quickView.price, quickView.currency)}</span>
                </div>
                {quickView.category === 'merch' && quickView.sizes && quickView.sizes.length > 0 && (
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">{t.store.sizes}</label>
                    <div className="flex flex-wrap gap-2">
                      {quickView.sizes.map((size) => (
                        <button key={size} onClick={() => setSelectedSize(size)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedSize === size ? 'bg-gradient-neon text-white' : 'glass text-gray-400 hover:text-white'}`}>
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {quickView.category === 'digital' && quickView.audio_url && (
                  <div className="flex items-center gap-3 p-3 rounded-xl glass">
                    <button onClick={togglePlay} className="w-10 h-10 rounded-full bg-gradient-neon flex items-center justify-center">
                      {isPlaying ? <Pause size={18} className="text-white" /> : <Play size={18} className="text-white ml-0.5" />}
                    </button>
                    <span className="text-sm text-gray-400">{t.store.preview}</span>
                  </div>
                )}
                <button
                  onClick={() => { handleAddToCart(quickView, selectedSize); setQuickView(null); }}
                  disabled={quickView.stock === 0 && quickView.category === 'merch'}
                  className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-40"
                >
                  <ShoppingBag size={18} /> {t.store.addToCart}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
