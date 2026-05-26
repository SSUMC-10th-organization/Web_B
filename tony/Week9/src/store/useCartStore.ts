// ================================================================
// 미션 3 - Zustand로 리팩토링
// Redux의 cartSlice + modalSlice를 하나의 Zustand store로 통합해요
// ================================================================
import { create } from 'zustand';
import cartItems, { CartItem } from '../constants/cartItems';

// ========================
// TODO 26: 스토어 타입을 정의하세요
// - cartItems, amount, total (cart 상태)
// - isOpen (modal 상태)
// - increase, decrease, removeItem, clearCart, calculateTotals (cart 액션)
// - openModal, closeModal (modal 액션)
// ========================
interface CartStore {
  // 상태
  cartItems: CartItem[];
  amount: number;
  total: number;
  isOpen: boolean;

  // 액션 — 타입을 직접 채워보세요
  increase: /* 여기를 채워보세요 */(id: string) => void;
  decrease: (id: string) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  calculateTotals: () => void;
  openModal: () => void;
  closeModal: () => void;
}

// ========================
// TODO 27: create로 Zustand store를 만드세요
// Redux cartSlice + modalSlice의 로직을 set((state) => {...}) 형태로 옮기세요
// ========================
export const useCartStore = create<CartStore>((set) => ({
  // 초기 상태
  cartItems: /* 여기를 채워보세요 */cartItems,
  amount: 0,
  total: 0,
  isOpen: false,

  // ========================
  // TODO 28: increase
  // id에 해당하는 아이템의 amount를 +1
  // ========================
  increase: (id) =>
    set((state) => {
      /* 여기를 채워보세요 */
      return state;
    }),

  // ========================
  // TODO 29: decrease
  // id에 해당하는 아이템의 amount를 -1
  // amount가 1 이하면 해당 아이템 제거
  // ========================
  decrease: (id) =>
    set((state) => {
      /* 여기를 채워보세요 */
      return state;
    }),

  // ========================
  // TODO 30: removeItem
  // id에 해당하는 아이템 제거
  // ========================
  removeItem: (id) =>
    set((state) => ({
      /* 여기를 채워보세요 */
    })),

  // ========================
  // TODO 31: clearCart
  // 모든 아이템 제거, amount/total 0으로 초기화
  // ========================
  clearCart: () =>
    set(/* 여기를 채워보세요 */),

  // ========================
  // TODO 32: calculateTotals
  // cartItems를 순회해서 amount와 total 재계산
  // ========================
  calculateTotals: () =>
    set((state) => {
      /* 여기를 채워보세요 */
      return state;
    }),

  // ========================
  // TODO 33: openModal / closeModal
  // isOpen을 true/false로 변경
  // ========================
  openModal: () => set(/* 여기를 채워보세요 */),
  closeModal: () => set(/* 여기를 채워보세요 */),
}));
