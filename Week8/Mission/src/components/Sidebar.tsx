import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useWithdrawMutation } from "../hooks/mutations/useAuthMutation";
import { useAuth } from "../context/AuthContext";

// Props 인터페이스 정의
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {

  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const { tokenA } = useAuth();
  const { mutate: withdrawMutate, isPending } = useWithdrawMutation();

  const handleWithdrawClick = () => {
    if(tokenA)
      setIsWithdrawModalOpen(true);
  };

  const handleConfirmWithdraw = () => {
    // 괄호()를 붙여서 뮤테이션 실행
    withdrawMutate();
    setIsWithdrawModalOpen(false);
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden"; // 스크롤 막기
    } else {
      document.body.style.overflow = "unset"; // 스크롤 원상복구
    }

    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);


  return (
    <>
      <div
        className={`fixed top-[80px] inset-0 bg-black/60 z-40 lg:hidden ${ // ← 큰 화면(lg) 이상에서는 무조건 숨김
            isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
        aria-hidden="true" // 스크린 리더가 단순 배경으로 인식하게 함
      />

      {/* 사이드바 본체 */}
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
            
            <button type="button"  
              onClick={handleWithdrawClick} 
              className="p-3 text-base text-left text-gray-400 hover:text-red-400 transition-all"
            >
              회원탈퇴
            </button>
          </nav>

          {/* 하단 푸터 (필요 시) */}
          <div className="mt-auto pt-6 text-xs text-gray-600 border-t border-gray-800">
            © 2026 돌려돌려LP판
          </div>
        </div>
      </aside>
      {isWithdrawModalOpen && tokenA && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* 모달 밖 클릭 시 닫힘 */}
          <button type="button" className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsWithdrawModalOpen(false)} />
          
          {/* 모달 콘텐츠 */}
          <div className="relative bg-[#2d2f36] w-full max-w-sm p-8 rounded-2xl border border-zinc-700 shadow-2xl animate-in fade-in zoom-in duration-200">
            <h2 className="text-xl font-bold text-white mb-4 text-center">정말로 탈퇴하시겠습니까?</h2>
            <p className="text-zinc-400 text-sm mb-8 text-center leading-relaxed">
              탈퇴 시 계정 정보와 함께 모든 LP판 데이터가 <br />
              <span className="text-red-400 font-bold underline">즉시 삭제되며 복구할 수 없습니다.</span>
            </p>
            
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsWithdrawModalOpen(false)}
                className="flex-1 py-3 bg-zinc-700 text-white rounded-xl font-bold hover:bg-zinc-600 transition-colors"
              >
                아니오
              </button>
              <button
                type="button"
                onClick={handleConfirmWithdraw}
                disabled={isPending}
                className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-500 transition-colors disabled:opacity-50"
              >
                {isPending ? "처리 중..." : "예"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};