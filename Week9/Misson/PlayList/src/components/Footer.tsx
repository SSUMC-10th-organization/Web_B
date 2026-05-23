import { useSelector, useDispatch } from "react-redux";
import { type RootState } from "../store/store"; 
import { clearCart } from "../features/cartSlice";

export default function Footer() {
    const { total } = useSelector((state: RootState) => state.cart);
    const dispatch = useDispatch();
    return (
        <footer className="w-1/2 mx-auto mt-8 mb-12">
        
        {/* 하단 총 가격 섹션 */}
      <div className="flex justify-between items-center mb-8">
        <h4 className="text-lg font-bold text-gray-700">총 가격</h4>
        <span className="text-xl font-extrabold text-indigo-600">
          ₩ {total.toLocaleString()}
        </span>
      </div>

      {/* 전체 삭제 버튼 */}
      <div className="text-center">
        <button type="button"
          className="w-full bg-red-100 hover:bg-red-200 text-red-600 font-bold py-3 px-6 rounded-md transition-colors tracking-wide shadow-sm"
          onClick={() => dispatch(clearCart())}
        >
          장바구니 비우기
        </button>
      </div>
      </footer>
    )
}