import { ShoppingBag, X, Plus, Minus, Trash2, CreditCard } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';

export default function CartDrawer() {
  const { t } = useLanguage();
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal, totalItems, clearCart, openCheckout } = useCart();

  if (!isOpen) return null;

  const formatPrice = (price: number, currency: string) => {
    const symbol = currency === 'EUR' ? '€' : currency === 'USD' ? '$' : currency;
    return `${price.toFixed(2)} ${symbol}`;
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end animate-fade-in" onClick={closeCart}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative w-full max-w-md h-full glass-strong border-l border-white/[0.08] flex flex-col animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <ShoppingBag size={22} className="text-neon-cyan" />
            <h2 className="text-lg font-display font-bold text-white">{t.cart.title}</h2>
            {totalItems > 0 && <span className="px-2 py-0.5 rounded-full bg-neon-purple/20 text-neon-purple text-xs font-medium">{totalItems}</span>}
          </div>
          <button onClick={closeCart} className="p-2 rounded-lg text-gray-400 hover:text-white transition-colors"><X size={20} /></button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-6">
            <ShoppingBag size={48} className="text-gray-600" />
            <p className="text-gray-400 font-medium">{t.cart.empty}</p>
            <p className="text-sm text-gray-500">{t.cart.emptyDesc}</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.map((item, index) => (
                <div key={index} className="glass rounded-xl p-3 flex gap-3">
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-obsidian-700 flex items-center justify-center">
                    {item.product.image_url ? (
                      <img src={item.product.image_url} alt={item.product.title} draggable={false} className="w-full h-full object-cover no-select" />
                    ) : (
                      <ShoppingBag size={20} className="text-gray-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{item.product.title}</p>
                    <p className="text-xs text-gray-500 mb-1">{item.product.category === 'merch' ? `${t.cart.size}: ${item.size || t.cart.sizeDefault}` : t.store.download}</p>
                    <p className="text-sm font-display font-semibold text-neon-cyan">{formatPrice(item.product.price, item.product.currency)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center gap-1 glass rounded-lg p-0.5">
                        <button onClick={() => updateQuantity(index, item.quantity - 1)} className="p-1 rounded text-gray-400 hover:text-white"><Minus size={14} /></button>
                        <span className="text-xs text-white w-6 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(index, item.quantity + 1)} className="p-1 rounded text-gray-400 hover:text-white"><Plus size={14} /></button>
                      </div>
                      <button onClick={() => removeItem(index)} className="ml-auto p-1.5 rounded-lg text-gray-400 hover:text-error-400 transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-white/[0.06] p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">{t.cart.subtotal}</span>
                <span className="text-xl font-display font-bold text-white">{formatPrice(subtotal, 'EUR')}</span>
              </div>
              <p className="text-xs text-gray-500 flex items-center gap-2">
                <CreditCard size={14} /> {t.checkout.creditCardDesc}
              </p>
              <button onClick={openCheckout} className="btn-primary w-full flex items-center justify-center gap-2">
                <CreditCard size={18} /> {t.cart.checkout}
              </button>
              <button onClick={clearCart} className="w-full text-sm text-gray-400 hover:text-error-400 transition-colors">{t.cart.clearCart}</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
