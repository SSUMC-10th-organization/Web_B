import { create } from 'zustand';
import cartItems from '../constants/cartItems';
import type { CartItem } from '../constants/cartItems';

interface CartStore {
  cartItems: CartItem[];
  amount: number;
  total: number;
  isOpen: boolean;
  increase: (id: string) => void;
  decrease: (id: string) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  calculateTotals: () => void;
  openModal: () => void;
  closeModal: () => void;
}

export const useCartStore = create<CartStore>((set) => ({
  cartItems: cartItems,
  amount: 0,
  total: 0,
  isOpen: false,

  increase: (id) => set((state) => {
    const item = state.cartItems.find((i) => i.id === id);
    if (item) item.amount += 1;
    return { cartItems: [...state.cartItems] };
  }),

  decrease: (id) => set((state) => {
    const item = state.cartItems.find((i) => i.id === id);
    if (item) {
      item.amount -= 1;
      if (item.amount <= 0) {
        return { cartItems: state.cartItems.filter((i) => i.id !== id) };
      }
    }
    return { cartItems: [...state.cartItems] };
  }),

  removeItem: (id) => set((state) => ({
    cartItems: state.cartItems.filter((i) => i.id !== id),
  })),

  clearCart: () => set({ cartItems: [], amount: 0, total: 0 }),

  calculateTotals: () => set((state) => {
    let amount = 0;
    let total = 0;
    state.cartItems.forEach((item) => {
      amount += item.amount;
      total += item.amount * Number(item.price);
    });
    return { amount, total };
  }),

  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
}));
