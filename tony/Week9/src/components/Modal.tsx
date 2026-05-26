import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { closeModal } from '../features/modal/modalSlice';
import { clearCart, calculateTotals } from '../features/cart/cartSlice';

export default function Modal() {
  // ========================
  // TODO 22: useSelector로 modal.isOpen을 가져오세요
  // ========================
  const isOpen = useSelector(/* 여기를 채워보세요 */(state: RootState) => state.modal.isOpen);
  const dispatch = useDispatch<AppDispatch>();

  // ========================
  // TODO 23: isOpen이 false이면 null을 반환해서 모달을 숨기세요
  // ========================
  /* 여기를 채워보세요 */

  const handleConfirm = () => {
    // ========================
    // TODO 24: "네" 버튼 클릭 시
    // 1. clearCart() dispatch
    // 2. calculateTotals() dispatch
    // 3. closeModal() dispatch
    // ========================
    /* 여기를 채워보세요 */
  };

  const handleCancel = () => {
    // ========================
    // TODO 25: "아니요" 버튼 클릭 시
    // closeModal()을 dispatch하세요
    // ========================
    /* 여기를 채워보세요 */
  };

  return (
    // 어두운 반투명 오버레이
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 shadow-2xl max-w-sm w-full mx-4">
        <h2 className="text-xl font-bold text-center mb-2">장바구니 비우기</h2>
        <p className="text-gray-500 text-center mb-6">
          모든 음반을 삭제할까요?
        </p>
        <div className="flex gap-3">
          <button
            onClick={handleCancel}
            className="flex-1 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-semibold"
          >
            아니요
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 font-semibold"
          >
            네
          </button>
        </div>
      </div>
    </div>
  );
}
