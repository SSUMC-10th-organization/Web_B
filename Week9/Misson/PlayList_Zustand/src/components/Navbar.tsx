import { useCartStore } from "../store/cartStore";


export default function Navbar() {
    const { amount } = useCartStore();

  return (
    <nav className="h-[10vh] w-full bg-indigo-600 text-white flex justify-between items-center px-8 shadow-md">
      {/* 왼쪽: 웹 이름 (굵은 흰색 폰트) */}
      <div className="text-2xl font-bold tracking-wider select-none">
        UMC PLAYLIST
      </div>

      {/* 오른쪽: 장바구니 카트 아이콘 및 총 개수 */}
      <div className="relative flex items-center p-2">
        {/* Tailwind 내장 SVG로 그린 장바구니 카트 이미지 */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-7 w-7"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
            <title>장바구니</title>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength="1"
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>

        {/* 현재 장바구니에 있는 총 개수 배지 (우측 상단 정렬) */}
        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
          {amount}
        </div>
      </div>
    </nav>
  );
}
