import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Loader2, ShoppingBag, Download } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '@/services/api';
import type { Product, ProductCategory } from '@/lib/types';

export default function StoreManager() {
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', category: 'merch' as ProductCategory, product_type: 'merch',
    price: '', currency: 'EUR', image_url: '', sizes: '', stock: '', audio_url: '', file_url: '',
  });

  const load = async () => { try { setProducts(await fetchProducts()); } finally { setLoading(false); } };
  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({ title: '', description: '', category: 'merch', product_type: 'merch', price: '', currency: 'EUR', image_url: '', sizes: '', stock: '', audio_url: '', file_url: '' });
    setShowModal(true);
  };
  const openEdit = (product: Product) => {
    setEditing(product);
    setForm({
      title: product.title, description: product.description, category: product.category,
      product_type: product.product_type, price: String(product.price), currency: product.currency,
      image_url: product.image_url, sizes: (product.sizes ?? []).join(','), stock: String(product.stock),
      audio_url: product.audio_url, file_url: product.file_url,
    });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try {
      const data = {
        title: form.title, description: form.description, category: form.category,
        product_type: form.product_type, price: parseFloat(form.price) || 0, currency: form.currency,
        image_url: form.image_url, sizes: form.sizes ? form.sizes.split(',').map((s) => s.trim()).filter(Boolean) : [],
        stock: parseInt(form.stock) || 0, audio_url: form.audio_url, file_url: form.file_url,
      };
      if (editing) await updateProduct(editing.id, data);
      else await createProduct(data);
      await load();
      setShowModal(false);
    } finally { setSaving(false); }
  };
  const handleDelete = async (id: string) => { if (confirm('Delete?')) { await deleteProduct(id); await load(); } };

  const formatPrice = (price: number, currency: string) => {
    const symbol = currency === 'EUR' ? '€' : currency === 'USD' ? '$' : currency;
    return `${price.toFixed(2)} ${symbol}`;
  };

  return (
    <div className="px-6 py-10 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-display font-bold text-white">{t.admin.store.title}</h1>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2"><Plus size={18} /> {t.admin.store.addProduct}</button>
      </div>
      {loading ? <div className="flex justify-center py-20"><Loader2 className="animate-spin text-neon-purple" /></div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product.id} className="glass rounded-2xl p-4 flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-obsidian-700 flex items-center justify-center flex-shrink-0">
                {product.image_url ? <img src={product.image_url} alt="" className="w-full h-full object-cover no-select" draggable={false} /> : product.category === 'digital' ? <Download size={20} className="text-neon-cyan" /> : <ShoppingBag size={20} className="text-gray-600" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white truncate">{product.title}</p>
                <p className="text-xs text-gray-500">{product.category} · {product.product_type} · {formatPrice(product.price, product.currency)}</p>
                <p className="text-xs text-gray-600">Stock: {product.stock}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(product)} className="p-2 rounded-lg text-gray-400 hover:text-neon-cyan"><Pencil size={16} /></button>
                <button onClick={() => handleDelete(product.id)} className="p-2 rounded-lg text-gray-400 hover:text-error-400"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-4" onClick={() => setShowModal(false)}>
          <div className="glass-strong rounded-2xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-display font-bold text-white">{editing ? t.admin.store.editProduct : t.admin.store.addProduct}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white"><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div><label className="block text-sm text-gray-400 mb-1">{t.admin.store.titleField}</label><input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white focus:outline-none focus:border-neon-purple/40" /></div>
              <div><label className="block text-sm text-gray-400 mb-1">{t.admin.store.descriptionField}</label><textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white focus:outline-none focus:border-neon-purple/40 resize-none" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-sm text-gray-400 mb-1">{t.admin.store.category}</label>
                  <select value={form.category} onChange={(e) => { const cat = e.target.value as ProductCategory; setForm({ ...form, category: cat, product_type: cat === 'digital' ? 'album' : 'merch' }); }} className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white focus:outline-none focus:border-neon-purple/40">
                    <option value="merch">{t.admin.store.merch}</option><option value="digital">{t.admin.store.digital}</option>
                  </select>
                </div>
                <div><label className="block text-sm text-gray-400 mb-1">{t.admin.store.productType}</label><input value={form.product_type} onChange={(e) => setForm({ ...form, product_type: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white focus:outline-none focus:border-neon-purple/40" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-sm text-gray-400 mb-1">{t.admin.store.price}</label><input type="number" step="0.01" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white focus:outline-none focus:border-neon-purple/40" /></div>
                <div><label className="block text-sm text-gray-400 mb-1">{t.admin.store.currency}</label>
                  <select value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white focus:outline-none focus:border-neon-purple/40">
                    <option value="EUR">EUR (€)</option><option value="USD">USD ($)</option><option value="XOF">XOF (CFA)</option>
                  </select>
                </div>
              </div>
              <div><label className="block text-sm text-gray-400 mb-1">{t.admin.store.imageUrl}</label><input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white focus:outline-none focus:border-neon-purple/40" /></div>
              {form.category === 'merch' && (
                <>
                  <div><label className="block text-sm text-gray-400 mb-1">{t.admin.store.sizes}</label><input value={form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })} placeholder={t.admin.store.sizesHelp} className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white focus:outline-none focus:border-neon-purple/40" /></div>
                  <div><label className="block text-sm text-gray-400 mb-1">{t.admin.store.stock}</label><input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white focus:outline-none focus:border-neon-purple/40" /></div>
                </>
              )}
              {form.category === 'digital' && (
                <>
                  <div><label className="block text-sm text-gray-400 mb-1">{t.admin.store.audioUrl}</label><input value={form.audio_url} onChange={(e) => setForm({ ...form, audio_url: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white focus:outline-none focus:border-neon-purple/40" /></div>
                  <div><label className="block text-sm text-gray-400 mb-1">{t.admin.store.fileUrl}</label><input value={form.file_url} onChange={(e) => setForm({ ...form, file_url: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white focus:outline-none focus:border-neon-purple/40" /></div>
                </>
              )}
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50">{saving && <Loader2 size={16} className="animate-spin" />} {t.admin.store.save}</button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">{t.admin.store.cancel}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
