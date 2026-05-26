import { create } from "zustand";
import cartItems from "../constants/cartItems";
import type { CartItems } from "../types/cart";

interface CartStore {
	//상태
	cartItems: CartItems;
	amount: number;
	total: number;
	isOpen: boolean;

	//액션
	increase: (id: string) => void;
	decrease: (id: string) => void;
	removeItem: (id: string) => void;
	clearCart: () => void;
	calculateTotals: () => void;
	openModal: () => void;
	closeModal: () => void;
}

const useCartStore = create<CartStore>((set) => ({
	cartItems,
	amount: 0,
	total: 0,
	isOpen: false,

	increase: (id) =>
		set((state) => {
			const item = state.cartItems.find((cart) => cart.id === id);
			if (!item) return state;
			return {
				cartItems: state.cartItems.map((cart) =>
					cart.id === id ? { ...cart, amount: cart.amount + 1 } : cart,
				),
			};
		}),
	decrease: (id) =>
		set((state) => {
			const item = state.cartItems.find((cart) => cart.id === id);
			if (!item) return state;

			if (item.amount <= 1) {
				return {
					cartItems: state.cartItems.filter((cart) => cart.id !== id),
				};
			}

			return {
				cartItems: state.cartItems.map((cart) =>
					cart.id === id ? { ...cart, amount: cart.amount - 1 } : cart,
				),
			};
		}),

	removeItem: (id) =>
		set((state) => ({
			cartItems: state.cartItems.filter((cart) => cart.id !== id),
		})),

	clearCart: () => set({ cartItems: [], amount: 0, total: 0 }),

	calculateTotals: () =>
		set((state) => {
			let amount = 0;
			let total = 0;
			state.cartItems.forEach((item) => {
				amount += item.amount;
				total += item.amount * item.price;
			});
			return { amount, total };
		}),

	openModal: () => set({ isOpen: true }),
	closeModal: () => set({ isOpen: false }),
}));

export default useCartStore;
