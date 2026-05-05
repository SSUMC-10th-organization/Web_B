import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

const HomeLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { accessToken } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-[#121212] text-white">
      <Navbar toggleSidebar={() => setIsSidebarOpen((prev) => !prev)} />

      <div className="flex flex-1 relative overflow-hidden">
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-40"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <aside
          className={`
            fixed top-0 left-0 z-50
            w-56 h-full
            bg-[#0a0a0a] border-r border-gray-800
            transform transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <div className="p-6 flex flex-col gap-4 pt-8">
            {!accessToken ? (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsSidebarOpen(false)}
                  className="text-sm hover:text-[#e91e8c] flex items-center gap-2 transition-colors"
                >
                  🔑 로그인
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsSidebarOpen(false)}
                  className="text-sm hover:text-[#e91e8c] flex items-center gap-2 transition-colors"
                >
                  📝 회원가입
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/search"
                  onClick={() => setIsSidebarOpen(false)}
                  className="text-sm hover:text-[#e91e8c] flex items-center gap-2 transition-colors"
                >
                  🔍 찾기
                </Link>
                <Link
                  to="/mypage"
                  onClick={() => setIsSidebarOpen(false)}
                  className="text-sm hover:text-[#e91e8c] flex items-center gap-2 transition-colors"
                >
                  👤 마이페이지
                </Link>
              </>
            )}
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto p-6 relative">
          <Outlet />

          <Link
            to="/lp/create"
            className="fixed bottom-8 right-8 bg-[#e91e8c] hover:bg-[#c2185b] text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg text-2xl transition-transform hover:scale-110 z-50"
            aria-label="LP 추가"
          >
            +
          </Link>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default HomeLayout;
