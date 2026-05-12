import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { accessToken } = useAuth();

  return (
    <>
      {/* 오버레이 */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      )}

      {/* 사이드바 */}
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
          {accessToken ? (
            <Link
              to="/my"
              onClick={onClose}
              className="px-4 py-3 text-sm text-[#ccc] rounded-md hover:bg-[#1a1a1a] hover:text-white transition-colors"
            >
              👤 마이페이지
            </Link>
          ) : (
            <Link
              to="/login"
              onClick={onClose}
              className="px-4 py-3 text-sm text-[#ccc] rounded-md hover:bg-[#1a1a1a] hover:text-white transition-colors"
            >
              👤 마이페이지
            </Link>
          )}
        </nav>
      </aside>
    </>
  );
};
