import { useModalStore } from "../store/modalStore";
import { useCartStore } from "../store/cartStore";

export default function Footer() {
    const { total } = useCartStore();
    const { openModal } = useModalStore();

    return (
        <footer className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200">
        <div className="w-1/2 max-w-[600px] mx-auto py-2">
        
        {/* 하단 총 가격 섹션 */}
      <div className="flex justify-between items-end mb-1.5 px-1 mt-1.5">
        <h4 className="text-lg font-bold text-gray-700">총 가격</h4>
        <span className="text-xl font-extrabold text-indigo-600">
          ₩ {total.toLocaleString()}
        </span>
      </div>

      {/* 전체 삭제 버튼 */}
      <div className="text-center">
        <button type="button"
          className="w-full bg-red-100 hover:bg-red-200 text-red-600 font-bold py-3 px-6 rounded-md transition-colors tracking-wide shadow-sm"
          onClick={() => openModal()}
        >
          장바구니 비우기
        </button>
      </div>
      </div>
      </footer>
    )
}