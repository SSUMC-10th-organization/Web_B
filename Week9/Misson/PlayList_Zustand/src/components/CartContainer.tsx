import { useEffect } from "react";
import { useCartStore } from "../store/cartStore";
import CartItem from "./CartItem";

export default function CartContainer() {
  const {calculateTotals, amount, cartItems} = useCartStore();

  // 2. [Step 6] 장바구니 아이템(수량, 삭제 등)에 변화가 있을 때마다 총 합계를 다시 계산합니다.
  useEffect(() => {
    calculateTotals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[calculateTotals]);

  // 3. 예외 처리: 장바구니에 담긴 아이템이 하나도 없을 때 보여줄 화면
  if (amount < 1) {
    return (
      <section className="max-w-[600px] mx-auto min-h-[90vh] flex flex-col justify-center items-center text-center px-4">
        <header>
          <h2 className="text-3xl font-extrabold text-gray-800 mb-4 tracking-wide">
            당신의 장바구니
          </h2>
          <h4 className="text-gray-500 text-lg mt-8">
            현재 장바구니가 비어 있습니다. 😢
          </h4>
        </header>
      </section>
    );
  }

  // 정상 출력: 장바구니에 아이템이 있을 때의 화면
  return (
    <section className="max-w-[600px] mx-auto my-12 px-4 pb-24">
      <header className="text-center mb-10">
        <h2 className="text-3xl font-extrabold text-gray-800 tracking-wide">
          당신의 장바구니
        </h2>
      </header>

      {/* 음반 리스트 영역 */}
      <div>
        {cartItems.map((item) => (
          // map을 돌며 개별 CartItem 컴포넌트에 props를 전달하여 뿌려줍니다.
          <CartItem key={item.id} {...item} />
        ))}
      </div>

      {/* 구분선 */}
      <hr className="border-gray-200 my-6" />

      
    </section>
  );
}