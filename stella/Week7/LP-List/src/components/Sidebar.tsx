import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { deleteAccount } from "../apis/auth";
import { queryClient } from "../App";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { accessToken, logout } = useAuth();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      queryClient.clear(); // 모든 캐시 제거
      logout();
      navigate("/login", { replace: true });
    },
    onError: (error) => {
      console.error("탈퇴 실패:", error);
      alert("탈퇴에 실패했습니다.");
    },
  });

  const handleDeleteConfirm = () => {
    setShowModal(false);
    deleteMutation.mutate();
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      )}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[#111] z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#222]">
          <span className="text-white font-bold text-base">메뉴</span>
          <button
            onClick={onClose}
            className="text-[#ccc] hover:text-white transition-colors text-xl leading-none"
          >
            ✕
          </button>
        </div>
        <nav className="flex flex-col p-4 gap-1">
          <Link
            to="/search"
            onClick={onClose}
            className="px-4 py-3 text-sm text-[#ccc] rounded-md hover:bg-[#1a1a1a] hover:text-white transition-colors"
          >
            🔍 찾기
          </Link>
          <Link
            to={accessToken ? "/my" : "/login"}
            onClick={onClose}
            className="px-4 py-3 text-sm text-[#ccc] rounded-md hover:bg-[#1a1a1a] hover:text-white transition-colors"
          >
            👤 마이페이지
          </Link>
          {accessToken && (
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-3 text-sm text-red-400 rounded-md hover:bg-[#1a1a1a] hover:text-red-300 transition-colors text-left"
            >
              🚪 탈퇴하기
            </button>
          )}
        </nav>
      </aside>

      {/* 탈퇴 확인 모달 */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-80 text-center">
            <p className="text-lg font-semibold mb-2">정말 탈퇴하시겠습니까?</p>
            <p className="text-sm text-gray-500 mb-6">
              탈퇴 시 모든 게시글, 댓글, 좋아요, 사용자 정보가 삭제됩니다.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleDeleteConfirm}
                disabled={deleteMutation.isPending}
                className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors disabled:bg-gray-300"
              >
                {deleteMutation.isPending ? "처리 중..." : "예"}
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                아니오
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
