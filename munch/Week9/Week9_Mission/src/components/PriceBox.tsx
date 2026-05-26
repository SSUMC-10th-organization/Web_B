import { openModal } from "../features/modal/modalSlice";
import { useDispatch, useSelector } from "../hooks/useCustomRedux";

const PriceBox = () => {
  const { total } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  return (
    <div className="p-12 flex justify-between">
      <button
        type="button"
        onClick={() => dispatch(openModal())}
        className="border p-4 rounded-md cursor-pointer"
      >
        장바구니 초기화
      </button>
      <div>총 가격: {total}원</div>
    </div>
  );
};

export default PriceBox;
