import { Link, Outlet } from "react-router-dom";

const HomeLayout = () => {
  return (
    <div className="h-dvh flex flex-col bg-black text-white">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
        <Link
          to="/"
          className="text-[#e91e8c] font-bold text-lg tracking-tight"
        >
          돌려돌려LP판
        </Link>
        <div className="flex gap-2">
          <Link
            to="/login"
            className="px-4 py-1.5 text-sm text-white border border-gray-600 rounded hover:border-gray-400 transition-colors"
          >
            로그인
          </Link>
          <Link
            to="/signup"
            className="px-4 py-1.5 text-sm text-white bg-[#e91e8c] rounded hover:bg-[#c2185b] transition-colors"
          >
            회원가입
          </Link>
        </div>
      </nav>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default HomeLayout;
