import React from "react";
import { Link } from "react-router-dom";

// Props 인터페이스 정의
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <>
      {/* 1. 뒷배경 (Backdrop): 정적 요소 에러 방지를 위해 role과 tabIndex 설정 혹은 버튼화 */}
      <div
        className={`fixed top-[80px] inset-0 bg-black/60 z-40 lg:hidden ${ // ← 큰 화면(lg) 이상에서는 무조건 숨김
            isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
        aria-hidden="true" // 스크린 리더가 단순 배경으로 인식하게 함
      />

      {/* 2. 사이드바 본체 */}
      <aside
        className={`fixed top-[80px] left-0 z-50 w-72 h-[calc(100vh-80px)] bg-gray-900 border-r border-gray-800 shadow-2xl transition-transform duration-300 ease-in-out z-50 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full p-6 text-white">
          {/* 상단 헤더 영역 */}
          <div className="flex justify-between items-center mb-10">
            <span className="text-2xl font-bold text-purple-400">메뉴</span>
          </div>

          {/* 메뉴 리스트 */}
          <nav className="flex flex-col gap-2">
            <Link 
              to="/mypage" 
              onClick={onClose} 
              className="p-3 text-lg font-medium rounded-lg hover:bg-purple-600/20 hover:text-purple-400 transition-all"
            >
              👤 마이페이지
            </Link>
            
            <div className="h-px bg-gray-800 my-4" />
            
            <Link 
              to="/settings" 
              onClick={onClose} 
              className="p-3 text-base text-gray-400 hover:text-white transition-all"
            >
              ⚙️ 환경 설정
            </Link>
          </nav>

          {/* 하단 푸터 (필요 시) */}
          <div className="mt-auto pt-6 text-xs text-gray-600 border-t border-gray-800">
            © 2026 돌려돌려LP판
          </div>
        </div>
      </aside>
    </>
  );
};