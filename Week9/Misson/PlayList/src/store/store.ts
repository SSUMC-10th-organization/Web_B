import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../features/cartSlice'; 

export const store = configureStore({
  reducer: {
    cart: cartReducer, // cartSlice.reducer를 cartReducer로 커스텀
  },
});

// TypeScript 환경에서 useSelector와 useDispatch를 안전하게 쓰기 위한 타입 내보내기
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;