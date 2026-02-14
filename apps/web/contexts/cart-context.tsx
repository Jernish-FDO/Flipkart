"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './auth-context';
import { cartApi } from '@/lib/api';

interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    images: string[];
    stockQuantity: number;
  };
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  isLoading: boolean;
  addItem: (productId: string, quantity: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const refreshCart = async () => {
    if (!token) {
      setItems([]);
      return;
    }

    try {
      setIsLoading(true);
      const data = await cartApi.get(token);
      setItems(data.items || []);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshCart();
  }, [token]);

  const addItem = async (productId: string, quantity: number) => {
    if (!token) {
      throw new Error('Please login to add items to cart');
    }

    await cartApi.addItem(productId, quantity, token);
    await refreshCart();
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!token) return;
    
    await cartApi.updateItem(productId, quantity, token);
    await refreshCart();
  };

  const removeItem = async (productId: string) => {
    if (!token) return;
    
    await cartApi.removeItem(productId, token);
    await refreshCart();
  };

  const clearCart = async () => {
    if (!token) return;
    
    await cartApi.clear(token);
    await refreshCart();
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + (Number(item.product.price) * item.quantity), 0);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        isLoading,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
