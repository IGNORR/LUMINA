import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from '../hooks/useTranslation';

const CartContext = createContext();

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
};

const sumPrices = (items) =>
  items.reduce((sum, item) => sum + (Number(item.price) || 0), 0);

export const CartProvider = ({ children }) => {
  const { t } = useTranslation();
  const [cart, setCart] = useState(() => {
    const stored = localStorage.getItem('cart');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item) => {
    if (item.sold) {
      toast.error(t('cart.toast.sold'));
      return;
    }

    const exists = cart.some((cartItem) => cartItem.id === item.id);

    if (exists) {
      toast.error(t('cart.toast.alreadyInCart'));
      return;
    }

    toast.success(t('cart.toast.addedToCart'));

    setCart((prev) => [...prev, item]);
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => setCart([]);

  const cartTotal = useMemo(() => sumPrices(cart), [cart]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
};