import useCartStore from "../hooks/useCartStore";
import CartItem from "./CartItem";

const CartList = () => {
  const { cartItems } = useCartStore();

  if (cartItems.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-400 text-lg">장바구니가 비었습니다.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <ul>
        {cartItems.map((item) => (
          <CartItem key={item.id} lp={item} />
        ))}
      </ul>
    </div>
  );
};

export default CartList;
