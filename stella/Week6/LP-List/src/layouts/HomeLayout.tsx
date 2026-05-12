import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { Link } from "react-router-dom";

export const HomeLayout = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      <Footer />

      {/* 플로팅 버튼 */}
      <Link
        to="/lp/create"
        className="fixed bottom-8 right-8 w-14 h-14 bg-black text-white text-2xl rounded-full flex items-center justify-center shadow-lg hover:bg-[#333] transition-colors z-30"
        aria-label="LP 추가"
      >
        +
      </Link>
    </div>
  );
};
