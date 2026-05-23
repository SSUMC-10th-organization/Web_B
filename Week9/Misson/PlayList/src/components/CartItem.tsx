import { useDispatch } from "react-redux";
import { increase, decrease } from "../features/cartSlice"; // 경로를 확인해 주세요

// 1. 부모(CartContainer)로부터 받을 데이터 타입 정의
interface CartItemProps {
  id: string;
  title: string;
  singer: string;
  price: string;
  img: string;
  amount: number;
}

export default function CartItem({ id, title, singer, price, img, amount }: CartItemProps) {
  const dispatch = useDispatch();

  return (
    <article className="flex items-center justify-between mb-6">
      {/* 왼쪽: 음반 이미지와 상세 정보 */}
      <div className="flex items-center gap-5">
        <img 
          src={img} 
          alt={title} 
          className="w-20 h-20 object-cover rounded-md shadow-sm" 
        />
        <div>
          <h4 className="font-bold tracking-wide text-gray-800">{title}</h4>
          <h4 className="text-sm text-gray-500">{singer}</h4>
          {/* 가격을 숫자로 변환 후 콤마(,) 추가 */}
          <h4 className="text-gray-600 mt-1 font-semibold">
            ₩ {Number(price).toLocaleString()}
          </h4>
        </div>
      </div>

      {/* 오른쪽: 수량 조절 버튼 (위/아래 화살표) */}
      <div className="flex flex-col items-center">
        {/* 수량 증가 버튼 */}
        <button type="button"
          className="text-indigo-600 hover:text-indigo-800 transition-colors"
          onClick={() => dispatch(increase(id))}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <title>수량 증가</title>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
          </svg>
        </button>

        {/* 현재 수량 표시 */}
        <p className="font-semibold text-lg">{amount}</p>

        {/* 수량 감소 버튼 */}
        <button type="button"
          className="text-indigo-600 hover:text-indigo-800 transition-colors"
          onClick={() => dispatch(decrease(id))}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <title>수량 감소</title>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </article>
  );
}