import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Product, CartItem } from '@/lib/types';

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  checkoutOpen: boolean;
  addItem: (product: Product, size?: string, quantity?: number) => void;
  removeItem: (index: number) => void;
  updateQuantity: (index: number, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  openCheckout: () => void;
  closeCheckout: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem('tabero-cart');
      return stored ? JSON.parse(stored) as CartItem[] : [];
    } catch { return []; }
  });
  const [isOpen, setIsOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  useEffect(() => { localStorage.setItem('tabero-cart', JSON.stringify(items)); }, [items]);

  const addItem = (product: Product, size: string = '', quantity: number = 1) => {
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.product.id === product.id && i.size === size);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity };
        return next;
      }
      return [...prev, { product, quantity, size }];
    });
    setIsOpen(true);
  };
  const removeItem = (index: number) => setItems((prev) => prev.filter((_, i) => i !== index));
  const updateQuantity = (index: number, quantity: number) => {
    if (quantity < 1) return;
    setItems((prev) => prev.map((item, i) => i === index ? { ...item, quantity } : item));
  };
  const clearCart = () => setItems([]);
  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const openCheckout = () => { setIsOpen(false); setCheckoutOpen(true); };
  const closeCheckout = () => setCheckoutOpen(false);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return <CartContext.Provider value={{ items, isOpen, checkoutOpen, addItem, removeItem, updateQuantity, clearCart, openCart, closeCart, openCheckout, closeCheckout, totalItems, subtotal }}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
