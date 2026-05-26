import { useDispatch } from 'react-redux';
import type { CartItem as CartItemType } from '../constants/cartItems';
import { increase, decrease, removeItem, calculateTotals } from '../features/cart/cartSlice';
import type { AppDispatch } from '../store';

interface Props {
  item: CartItemType;
}

export default function CartItem({ item }: Props) {
  const dispatch = useDispatch<AppDispatch>();

  const handleIncrease = () => {
    dispatch(increase(item.id));
    dispatch(calculateTotals());
  };

  const handleDecrease = () => {
    dispatch(decrease(item.id));
    dispatch(calculateTotals());
  };

  const handleRemove = () => {
    dispatch(removeItem(item.id));
    dispatch(calculateTotals());
  };

  return (
    <div className="flex items-center gap-4 p-4 border-b border-gray-200 bg-white">
      <img src={item.img} alt={item.title} className="w-20 h-20 object-cover rounded" />

      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-sm truncate">{item.title}</h3>
        <p className="text-gray-500 text-xs mt-0.5">{item.singer}</p>
        <p className="text-gray-800 font-bold text-sm mt-1">${item.price}</p>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={handleDecrease}
          className="w-8 h-8 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 font-bold"
        >
          -
        </button>
        <span className="w-8 text-center font-semibold">{item.amount}</span>
        <button
          onClick={handleIncrease}
          className="w-8 h-8 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 font-bold"
        >
          +
        </button>
      </div>

      <button onClick={handleRemove} className="text-gray-400 hover:text-red-500 text-lg ml-2">
        ✕
      </button>
    </div>
  );
}
