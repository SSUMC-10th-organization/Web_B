import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../features/cart/cartSlice';
// TODO: modalReducer import 추가
import modalReducer from '../features/modal/modalSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    // TODO: modal reducer 등록
    modal: modalReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
