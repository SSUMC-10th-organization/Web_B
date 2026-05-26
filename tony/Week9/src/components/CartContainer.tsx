import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { calculateTotals } from '../features/cart/cartSlice';
import { openModal } from '../features/modal/modalSlice';
import CartItem from './CartItem';

export default function CartContainer() {
  const cartItems = useSelector((state: RootState) => state.cart.cartItems);
  const amount = useSelector((state: RootState) => state.cart.amount);
  const total = useSelector((state: RootState) => state.cart.total);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(calculateTotals());
  }, [cartItems, dispatch]);

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400">
        <p className="text-4xl mb-4">🎵</p>
        <p className="text-lg">장바구니가 비어있어요</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {cartItems.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>

      <div className="mt-4 bg-white border border-gray-200 rounded-lg p-5 flex justify-between items-center">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide">총 수량</p>
          <p className="text-2xl font-bold mt-1">{amount}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400 uppercase tracking-wide">총 금액</p>
          <p className="text-2xl font-bold mt-1">${total.toLocaleString()}</p>
        </div>
      </div>

      <button
        onClick={() => dispatch(openModal())}
        className="mt-4 w-full py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-700 font-semibold tracking-wide"
      >
        전체 삭제
      </button>
    </div>
  );
}
