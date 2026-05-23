import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import cartItems from '../constants/cartItems'; // Step 1에서 만든 데이터 임포트

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
}

// 초기 상태(Initial State) 셋팅
const initialState: CartState = {
  cartItems: cartItems, // 초기 장바구니에 Mock 데이터 할당
  amount: 0,            // 총 수량 초기값
  total: 0,             // 총 금액 초기값
};

// Slice 생성
const cartSlice = createSlice({
  name: 'cart', // 이 슬라이스의 이름 (액션 타입 생성에 사용됨)
  initialState,
  reducers: {
    // 특정 아이템 수량 증가 (payload로 id가 들어옴)
    increase: (state, action: PayloadAction<string>) => {
      const item = state.cartItems.find((cartItem) => cartItem.id === action.payload);
      if (item) {
        item.amount += 1; // RTK의 Immer 라이브러리 덕분에 직접 수정 가능
      }
    },
    
    // 특정 아이템 수량 감소
    decrease: (state, action: PayloadAction<string>) => {
      const item = state.cartItems.find((cartItem) => cartItem.id === action.payload);
      if (item) {
        item.amount -= 1;
        // 감소 결과가 1보다 작아지면 자동 제거
        if (item.amount < 1) {
          state.cartItems = state.cartItems.filter((cartItem) => cartItem.id !== action.payload);
        }
      }
    },
    
    // 아이템 완전 제거
    removeItem: (state, action: PayloadAction<string>) => {
      state.cartItems = state.cartItems.filter((cartItem) => cartItem.id !== action.payload);
    },
    
    // 장바구니 비우기
    clearCart: (state) => {
      state.cartItems = [];
      // 수량/금액 0 초기화는 아래 calculateTotals가 자동으로 호출되며 맞춰집니다.
    },
    
    // 전체 수량(amount)과 합계 금액(total) 계산
    calculateTotals: (state) => {
      let amount = 0;
      let total = 0;
      
      state.cartItems.forEach((item) => {
        amount += item.amount;
        total += item.amount * parseInt(item.price); // price가 문자열이므로 숫자로 변환
      });
      
      state.amount = amount;
      state.total = total;
    },
  },
});

// 컴포넌트에서 사용할 액션 함수들과 Store에 등록할 Reducer 내보내기
export const { increase, decrease, removeItem, clearCart, calculateTotals } = cartSlice.actions;
export default cartSlice.reducer;