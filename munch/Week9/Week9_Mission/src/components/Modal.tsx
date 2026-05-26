import { clearCart } from "../features/cart/cartSlice";
import { closeModal } from "../features/modal/modalSlice";
import { useDispatch, useSelector } from "../hooks/useCustomRedux";

const Modal = () => {
  const dispatch = useDispatch();
  const { isOpen } = useSelector((state) => state.modal);

  if (!isOpen) return null;

  const handleClose = () => {
    dispatch(closeModal());
  };

  const handleConfirm = () => {
    dispatch(clearCart());
    dispatch(closeModal());
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 flex flex-col items-center gap-6 shadow-lg">
        <p className="text-lg font-semibold">정말 삭제하시겠습니까?</p>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={handleClose}
            className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-100 cursor-pointer"
          >
            아니요
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-500 cursor-pointer"
          >
            네
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
