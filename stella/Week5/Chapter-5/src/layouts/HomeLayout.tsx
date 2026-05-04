import { Link, Outlet } from "react-router-dom";

export const HomeLayout = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* 네비게이션 */}
      <nav className="flex items-center justify-between px-6 py-4 bg-[#111] border-b border-[#222]">
        <Link to="/" className="text-white font-bold text-base tracking-tight">
          ...
        </Link>
        <div className="flex gap-2">
          <Link
            to="/login"
            className="px-4 py-1.5 text-sm text-[#ccc] border border-[#444] rounded-md hover:bg-[#1a1a1a] transition-colors"
          >
            로그인
          </Link>
          <Link
            to="/signup"
            className="px-4 py-1.5 text-sm text-black bg-white border-[#444] rounded-md hover:bg-[#ccc] transition-colors"
          >
            회원가입
          </Link>
        </div>
      </nav>

      {/* 페이지 컨텐츠 */}
      <main className="flex-1 flex items-center justify-center">
        <Outlet />
      </main>
    </div>
  );
};
