import cartItems from '../constants/cartItems';
import { create } from 'zustand';

// 상태(State) 타입 정의
interface CartItemType {
  id: string;
  title: string;
  singer: string;
  price: string; // Mock 데이터에서 price가 문자열
  img: string;
  amount: number;
}

interface CartState {
  cartItems: CartItemType[];
  amount: number;
  total: number;
  increase : (id : string) => void;
  decrease : (id : string) => void;
  removeItem : (id : string) => void;
  clearCart : () => void;
  calculateTotals : () => void;
}

export const useCartStore = create<CartState>(set => ({
    cartItems: cartItems, // 초기 장바구니에 Mock 데이터 할당
    amount: 0,            // 총 수량 초기값
    total: 0,
    increase : (id : string) => set((state) => ({
        cartItems: state.cartItems.map((item) =>
      item.id === id ? { ...item, amount: item.amount + 1 } : item
    ),
    })),
    decrease : (id : string) => set((state) => ({
        cartItems: state.cartItems
            .map((item) => item.id === id ? { ...item, amount: item.amount - 1 } : item)
            .filter((item) => item.amount > 0),
    })),
    removeItem: (id) => set((state) => ({
        cartItems: state.cartItems.filter((item) => item.id !== id),
    })),
    clearCart : () => set(() =>({
        cartItems : [],
    })),
    calculateTotals : () => set((state) => {
        let tempAmount = 0;
        let tempTotal = 0;
      
        state.cartItems.forEach((item) => {
        tempAmount += item.amount;
        tempTotal += item.amount * Number(item.price); // price가 문자열이므로 숫자로 변환
        });

        return {
            amount : tempAmount,
            total : tempTotal,
        }
    }),

}));
