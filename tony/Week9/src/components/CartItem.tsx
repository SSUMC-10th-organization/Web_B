import type { CartItem as CartItemType } from '../constants/cartItems';
import { useCartStore } from '../store/useCartStore';

interface Props {
  item: CartItemType;
}

export default function CartItem({ item }: Props) {
  const { increase, decrease, removeItem, calculateTotals } = useCartStore();

  const handleIncrease = () => {
    increase(item.id);
    calculateTotals();
  };

  const handleDecrease = () => {
    decrease(item.id);
    calculateTotals();
  };

  const handleRemove = () => {
    removeItem(item.id);
    calculateTotals();
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
        <button onClick={handleDecrease} className="w-8 h-8 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 font-bold">
          -
        </button>
        <span className="w-8 text-center font-semibold">{item.amount}</span>
        <button onClick={handleIncrease} className="w-8 h-8 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 font-bold">
          +
        </button>
      </div>

      <button onClick={handleRemove} className="text-gray-400 hover:text-red-500 text-lg ml-2">
        ✕
      </button>
    </div>
  );
}
