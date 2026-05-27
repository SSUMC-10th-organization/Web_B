import { FaShoppingCart } from "react-icons/fa";
import { useDispatch, useSelector } from "../hooks/useCustomRedux";
import { CalculateTotals, type CartState } from "./../slices/cartSlice";
import { useEffect } from "react";

export const Navbar = () => {
  const { amount } = useSelector((state): CartState => state.cart);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(CalculateTotals());
  });
  return (
    <div className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <h1 className="text-2xl font-semibold">Jihyun</h1>
      <div className="flex items-center space-x-2">
        <FaShoppingCart className="text-2xl" />
        <span className="text-xl font-medium">{amount}</span>
      </div>
    </div>
  );
};

export default Navbar;
