import useCartStore from "../hooks/useCartStore";

const PriceBox = () => {
  const { total, cartItems, openModal } = useCartStore();

  return (
    <div className="p-12 flex justify-between">
      {cartItems.length > 0 && (
        <button
          type="button"
          onClick={openModal}
          className="border p-4 rounded-md cursor-pointer"
        >
          장바구니 초기화
        </button>
      )}
      <div>총 가격: {total}원</div>
    </div>
  );
};

export default PriceBox;
