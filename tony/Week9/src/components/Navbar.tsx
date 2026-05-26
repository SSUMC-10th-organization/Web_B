import { useSelector } from 'react-redux';
import type { RootState } from '../store';

export default function Navbar() {
  // ========================
  // TODO 9: useSelector로 cart.amount를 가져오세요
  // ========================
  const amount = useSelector((state: RootState) => state.cart.amount);

  return (
    <nav className="bg-gray-900 text-white px-8 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">UMC PlayList</h1>
      <div className="relative">
        <span className="text-2xl">🛒</span>
        {amount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
            {amount}
          </span>
        )}
      </div>
    </nav>
  );
}
