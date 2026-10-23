import { useState } from 'react';
import { X, CreditCard, Mail, User, MapPin, Loader2, AlertCircle, Lock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { supabase } from '@/lib/supabase';

export default function CheckoutModal() {
  const { t } = useLanguage();
  const { items, checkoutOpen, closeCheckout, subtotal } = useCart();
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [status, setStatus] = useState<'form' | 'processing' | 'error'>('form');
  const [errorMsg, setErrorMsg] = useState('');

  if (!checkoutOpen) return null;

  const hasMerch = items.some((i) => i.product.category === 'merch');
  const hasDigital = items.some((i) => i.product.category === 'digital');
  const needsShipping = hasMerch;
  const missingSize = items.some((i) => i.product.category === 'merch' && i.product.sizes.length > 0 && !i.size);

  const formatPrice = (price: number, currency: string) => {
    const symbol = currency === 'EUR' ? '€' : currency === 'USD' ? '$' : currency;
    return `${price.toFixed(2)} ${symbol}`;
  };

  const currency = items[0]?.product.currency ?? 'EUR';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (missingSize) { setErrorMsg(t.checkout.requiredForMerch); setStatus('error'); return; }
    if (!email) return;
    if (needsShipping && (!fullName || !address || !city || !country || !postalCode)) return;

    setStatus('processing');
    setErrorMsg('');

    try {
      const orderType = hasMerch && hasDigital ? 'mixed' : hasMerch ? 'physical' : 'digital';
      const { data, error } = await supabase.functions.invoke('stripe-checkout', {
        body: {
          items: items.map((i) => ({
            product_id: i.product.id,
            product_title: i.product.title,
            quantity: i.quantity,
            unit_price: i.product.price,
            selected_variant: i.size || '',
            category: i.product.category,
            file_url: i.product.file_url,
          })),
          customer_email: email,
          full_name: fullName,
          shipping: needsShipping ? { full_name: fullName, address, city, country, postal_code: postalCode } : null,
          order_type: orderType,
          currency,
        },
      });

      if (error) throw new Error(error.message);
      if (data?.url) {
        localStorage.setItem('tabero-cart', '[]');
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const inputClass = 'w-full bg-obsidian-800/60 border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-neon-cyan/50 focus:ring-1 focus:ring-neon-cyan/30 outline-none transition-all';

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 animate-fade-in" onClick={closeCheckout}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-strong rounded-2xl border border-white/[0.08] animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-white/[0.06] sticky top-0 bg-obsidian-900/90 backdrop-blur-md z-10">
          <div className="flex items-center gap-2">
            <CreditCard size={22} className="text-neon-cyan" />
            <h2 className="text-lg font-display font-bold text-white">{t.checkout.title}</h2>
          </div>
          <button onClick={closeCheckout} className="p-2 rounded-lg text-gray-400 hover:text-white transition-colors"><X size={20} /></button>
        </div>

        {status === 'processing' ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 size={48} className="text-neon-cyan animate-spin" />
            <p className="text-gray-300 font-medium">{t.checkout.processing}</p>
          </div>
        ) : status === 'error' ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-error-500/15 flex items-center justify-center">
              <AlertCircle size={32} className="text-error-400" />
            </div>
            <h3 className="text-xl font-display font-bold text-white">{t.checkout.error}</h3>
            <p className="text-sm text-gray-400 max-w-sm">{errorMsg || t.checkout.errorDesc}</p>
            <button onClick={() => setStatus('form')} className="btn-primary mt-2">{t.checkout.backToStore}</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <p className="text-sm text-gray-400">{t.checkout.subtitle}</p>

            <div>
              <label className="text-sm text-gray-300 font-medium flex items-center gap-2 mb-2"><Mail size={14} /> {t.checkout.email}</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={inputClass} />
            </div>

            {needsShipping ? (
              <div className="space-y-4 p-4 rounded-xl border border-white/[0.06] bg-obsidian-800/30">
                <div>
                  <p className="text-sm font-display font-semibold text-white mb-1">{t.checkout.shippingInfo}</p>
                  <p className="text-xs text-gray-500">{t.checkout.shippingInfoDesc}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-300 font-medium flex items-center gap-2 mb-2"><User size={14} /> {t.checkout.fullName}</label>
                  <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className="text-sm text-gray-300 font-medium flex items-center gap-2 mb-2"><MapPin size={14} /> {t.checkout.address}</label>
                  <input type="text" required value={address} onChange={(e) => setAddress(e.target.value)} className={inputClass} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-300 font-medium mb-2 block">{t.checkout.city}</label>
                    <input type="text" required value={city} onChange={(e) => setCity(e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className="text-sm text-gray-300 font-medium mb-2 block">{t.checkout.postalCode}</label>
                    <input type="text" required value={postalCode} onChange={(e) => setPostalCode(e.target.value)} className={inputClass} />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-300 font-medium mb-2 block">{t.checkout.country}</label>
                  <input type="text" required value={country} onChange={(e) => setCountry(e.target.value)} className={inputClass} />
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl border border-neon-cyan/20 bg-neon-cyan/[0.04]">
                <p className="text-sm font-display font-semibold text-white mb-1">{t.checkout.digitalOnly}</p>
                <p className="text-xs text-gray-400">{t.checkout.digitalOnlyDesc}</p>
              </div>
            )}

            <div className="p-4 rounded-xl border border-white/[0.06] bg-obsidian-800/30">
              <p className="text-sm font-display font-semibold text-white mb-3">{t.checkout.orderSummary}</p>
              <div className="space-y-2 mb-3">
                {items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-gray-300">{item.product.title}{item.size ? ` (${item.size})` : ''} ×{item.quantity}</span>
                    <span className="text-gray-400">{formatPrice(item.product.price * item.quantity, item.product.currency)}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between pt-3 border-t border-white/[0.06]">
                <span className="text-white font-medium">{t.checkout.total}</span>
                <span className="text-lg font-display font-bold text-neon-cyan">{formatPrice(subtotal, currency)}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-white/[0.06] bg-obsidian-800/30">
              <p className="text-sm font-display font-semibold text-white mb-3">{t.checkout.paymentMethod}</p>
              <div className="flex items-center gap-3 p-3 rounded-xl border border-neon-cyan/20 bg-neon-cyan/[0.04]">
                <div className="w-10 h-10 rounded-lg bg-neon-cyan/10 flex items-center justify-center">
                  <CreditCard size={20} className="text-neon-cyan" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{t.checkout.creditCard}</p>
                  <p className="text-xs text-gray-500">{t.checkout.creditCardDesc}</p>
                </div>
                <Lock size={16} className="text-gray-500" />
              </div>
            </div>

            <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2 text-base">
              <CreditCard size={18} /> {t.checkout.payNow} — {formatPrice(subtotal, currency)}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
