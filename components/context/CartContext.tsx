'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';

type CartItem = {
  id: string;
  animal_id: string;
  name: string;
  price: number;
  image: string;
  animal_type: string;
};

type CartContextType = {
  items: CartItem[];
  addItem: (animal: any) => Promise<void>;
  removeItem: (animalId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: number;
  totalPrice: number;
  loading: boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const fetchCart = async () => {
    if (!user) {
      setItems([]);
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from('carts')
      .select('*, animals(*)')
      .eq('user_id', user.id);
    if (!error && data) {
      const mapped = data.map((cart: any) => ({
        id: cart.id,
        animal_id: cart.animal_id,
        name: cart.animals.name,
        price: cart.animals.price,
        image: cart.animals.images?.[0] || '/placeholder.jpg',
        animal_type: cart.animals.animal_type,
      }));
      setItems(mapped);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addItem = async (animal: any) => {
    if (!user) throw new Error('Login required');
    const { error } = await supabase
      .from('carts')
      .insert({ user_id: user.id, animal_id: animal.id });
    if (error) throw error;
    await fetchCart();
  };

  const removeItem = async (animalId: string) => {
    if (!user) return;
    const item = items.find(i => i.animal_id === animalId);
    if (!item) return;
    await supabase.from('carts').delete().eq('id', item.id);
    await fetchCart();
  };

  const clearCart = async () => {
    if (!user) return;
    await supabase.from('carts').delete().eq('user_id', user.id);
    await fetchCart();
  };

  const totalItems = items.length;
  const totalPrice = items.reduce((sum, i) => sum + i.price, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, totalItems, totalPrice, loading }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};