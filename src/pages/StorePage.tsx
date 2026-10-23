import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle2, XCircle, Download, ArrowLeft, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabase';
import Store from '@/components/public/Store';
import type { Order, OrderItem } from '@/lib/types';

export default function StorePage() {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const status = searchParams.get('status');
  const orderId = searchParams.get('order');

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === 'success' && orderId) {
      setLoading(true);
      supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('id', orderId)
        .single()
        .then(({ data, error }) => {
          if (!error && data) setOrder(data as Order);
          setLoading(false);
        });
    }
  }, [status, orderId]);

  const clearParams = () => setSearchParams({});

  if (status === 'success') {
    return (
      <div className="pt-20 min-h-screen px-6 flex items-center justify-center">
        <div className="w-full max-w-lg glass-strong rounded-2xl p-8 text-center">
          {loading ? (
            <Loader2 size={48} className="text-neon-cyan animate-spin mx-auto mb-4" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-green-500/15 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} className="text-green-400" />
            </div>
          )}
          <h2 className="text-2xl font-display font-bold text-white mb-3">{t.checkout.success}</h2>
          <p className="text-gray-400 mb-6">{t.checkout.successDesc}</p>

          {order && (
            <div className="mb-6 text-left p-4 rounded-xl border border-white/[0.06] bg-obsidian-800/30">
              <p className="text-xs text-gray-500 mb-3">{t.checkout.orderRef}: <span className="text-gray-300 font-mono">{order.id.slice(0, 8)}</span></p>
              {order.order_items?.some((item: OrderItem) => item.has_download_access) && (
                <div>
                  <p className="text-sm font-display font-semibold text-white mb-3">{t.checkout.downloadYourPurchases}</p>
                  <div className="space-y-2">
                    {order.order_items.filter((item: OrderItem) => item.has_download_access && item.download_url).map((item: OrderItem) => (
                      <a key={item.id} href={item.download_url} download className="flex items-center gap-2 p-3 rounded-lg bg-neon-cyan/10 text-neon-cyan hover:bg-neon-cyan/20 transition-colors text-sm">
                        <Download size={16} /> {item.product_title}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <button onClick={clearParams} className="btn-primary flex items-center gap-2 mx-auto">
            <ArrowLeft size={16} /> {t.checkout.backToStore}
          </button>
        </div>
      </div>
    );
  }

  if (status === 'cancelled') {
    return (
      <div className="pt-20 min-h-screen px-6 flex items-center justify-center">
        <div className="w-full max-w-lg glass-strong rounded-2xl p-8 text-center">
          <div className="w-20 h-20 rounded-full bg-error-500/15 flex items-center justify-center mx-auto mb-6">
            <XCircle size={40} className="text-error-400" />
          </div>
          <h2 className="text-2xl font-display font-bold text-white mb-3">{t.checkout.error}</h2>
          <p className="text-gray-400 mb-6">{t.checkout.errorDesc}</p>
          <button onClick={clearParams} className="btn-primary flex items-center gap-2 mx-auto">
            <ArrowLeft size={16} /> {t.checkout.backToStore}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20">
      <Store />
    </div>
  );
}
