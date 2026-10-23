import { useState, useEffect } from 'react';
import { Package, ChevronDown, ChevronUp, Calendar, DollarSign, Download, Truck } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { fetchOrders, updateOrderDelivery } from '@/services/api';
import type { Order, DeliveryStatus } from '@/lib/types';

export default function OrdersManager() {
  const { t } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState<DeliveryStatus>('pending');

  useEffect(() => { loadOrders(); }, []);

  const loadOrders = async () => {
    try {
      const data = await fetchOrders();
      setOrders(data);
    } catch { setOrders([]); }
    finally { setLoading(false); }
  };

  const handleSave = async (id: string) => {
    try {
      await updateOrderDelivery(id, editStatus);
      setOrders((prev) => prev.map((o) => o.id === id ? { ...o, delivery_status: editStatus } : o));
      setEditingId(null);
    } catch { /* keep current state on error */ }
  };

  const formatPrice = (price: number, currency: string) => {
    const symbol = currency === 'EUR' ? '€' : currency === 'USD' ? '$' : currency;
    return `${price.toFixed(2)} ${symbol}`;
  };

  const paymentColor = (s: string) => s === 'paid' ? 'text-green-400 bg-green-400/10' : s === 'failed' ? 'text-error-400 bg-error-400/10' : s === 'refunded' ? 'text-orange-400 bg-orange-400/10' : 'text-yellow-400 bg-yellow-400/10';
  const deliveryColor = (s: string) => s === 'delivered' ? 'text-green-400 bg-green-400/10' : s === 'shipped' ? 'text-blue-400 bg-blue-400/10' : s === 'not_applicable' ? 'text-gray-500 bg-gray-500/10' : 'text-yellow-400 bg-yellow-400/10';

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Package size={32} className="text-neon-cyan animate-pulse" /></div>;
  }

  return (
    <div className="px-6 py-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-white mb-1">{t.admin.orders.title}</h1>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
          <Package size={48} className="text-gray-600" />
          <p className="text-gray-400">{t.admin.orders.noOrders}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="glass rounded-2xl overflow-hidden">
              <button onClick={() => setExpandedId(expandedId === order.id ? null : order.id)} className="w-full p-4 flex items-center gap-4 text-left hover:bg-white/[0.02] transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-white truncate">{order.customer_email}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${paymentColor(order.payment_status)}`}>{t.admin.orders[order.payment_status as keyof typeof t.admin.orders] ?? order.payment_status}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Calendar size={11} /> {new Date(order.created_at).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1"><DollarSign size={11} /> {formatPrice(order.total_amount, order.currency)}</span>
                    <span className="text-gray-400">{t.admin.orders[order.order_type as keyof typeof t.admin.orders] ?? order.order_type}</span>
                  </div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${deliveryColor(order.delivery_status)}`}>{t.admin.orders[order.delivery_status as keyof typeof t.admin.orders] ?? order.delivery_status}</span>
                {expandedId === order.id ? <ChevronUp size={18} className="text-gray-500" /> : <ChevronDown size={18} className="text-gray-500" />}
              </button>

              {expandedId === order.id && (
                <div className="border-t border-white/[0.06] p-4 space-y-4 bg-obsidian-800/20">
                  <div>
                    <p className="text-sm font-display font-semibold text-white mb-2">{t.admin.orders.items}</p>
                    <div className="space-y-2">
                      {order.order_items?.map((item) => (
                        <div key={item.id} className="flex items-center justify-between text-sm py-2 px-3 rounded-lg bg-obsidian-800/40">
                          <div>
                            <span className="text-white">{item.product_title}</span>
                            {item.selected_variant && <span className="text-gray-500"> — {item.selected_variant}</span>}
                            <span className="text-gray-500"> ×{item.quantity}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400">{formatPrice(item.unit_price * item.quantity, order.currency)}</span>
                            {item.has_download_access && item.download_url && (
                              <a href={item.download_url} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg bg-neon-cyan/10 text-neon-cyan hover:bg-neon-cyan/20 transition-colors"><Download size={14} /></a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {order.shipping_address && (
                    <div className="text-sm text-gray-400 p-3 rounded-lg bg-obsidian-800/40">
                      <p className="flex items-center gap-2 text-white font-medium mb-1"><Truck size={14} /> {t.checkout.shippingInfo}</p>
                      <p>{order.shipping_full_name}</p>
                      <p>{order.shipping_address}</p>
                      <p>{order.shipping_city}, {order.shipping_postal_code}</p>
                      <p>{order.shipping_country}</p>
                    </div>
                  )}

                  {order.delivery_status !== 'not_applicable' && (
                    editingId === order.id ? (
                      <div className="flex items-center gap-2">
                        <select value={editStatus} onChange={(e) => setEditStatus(e.target.value as DeliveryStatus)} className="bg-obsidian-800 border border-white/[0.08] rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-neon-cyan/50">
                          <option value="pending">{t.admin.orders.pending}</option>
                          <option value="shipped">{t.admin.orders.shipped}</option>
                          <option value="delivered">{t.admin.orders.delivered}</option>
                        </select>
                        <button onClick={() => handleSave(order.id)} className="btn-primary text-sm px-4 py-2">{t.admin.orders.save}</button>
                        <button onClick={() => setEditingId(null)} className="btn-secondary text-sm px-4 py-2">{t.admin.orders.cancel}</button>
                      </div>
                    ) : (
                      <button onClick={() => { setEditingId(order.id); setEditStatus(order.delivery_status); }} className="btn-secondary text-sm flex items-center gap-2">
                        <Package size={14} /> {t.admin.orders.updateDelivery}
                      </button>
                    )
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
