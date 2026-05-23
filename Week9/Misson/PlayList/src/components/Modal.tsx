import { useDispatch } from "react-redux";
import { closeModal } from "../features/modalSlice";
import { clearCart } from "../features/cartSlice";

export default function Modal() {
  const dispatch = useDispatch();

  return (
    // 전체를 덮는 어두운 반투명 배경 (Overlay)
    <aside className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-[100]">
      {/* 모달 본체 */}
      <div className="bg-white w-[90%] max-w-[400px] p-8 rounded-lg text-center shadow-xl">
        <h4 className="text-lg font-semibold mb-6">장바구니를 전부 비우시겠습니까?</h4>
        
        <div className="flex justify-around gap-4">
          {/* 네 버튼: 비우고 + 닫기 */}
          <button type="button"
            className="flex-1 border border-indigo-600 text-indigo-600 py-2 rounded-md font-bold hover:bg-indigo-50 transition-colors"
            onClick={() => {
              dispatch(clearCart());
              dispatch(closeModal());
            }}
          >
            네
          </button>

          {/* 아니요 버튼: 그냥 닫기 */}
          <button type="button"
            className="flex-1 bg-red-500 text-white py-2 rounded-md font-bold hover:bg-red-600 transition-colors"
            onClick={() => dispatch(closeModal())}
          >
            아니요
          </button>
        </div>
      </div>
    </aside>
  );
}