import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { LpFormModal } from "../components/LpFormModal";

export const HomeLayout = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center">
        <Outlet />
      </main>
      <Footer />

      {/* 플로팅 + 버튼 */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-black text-white text-2xl rounded-full flex items-center justify-center shadow-lg hover:bg-[#333] transition-colors z-30"
        aria-label="LP 추가"
      >
        +
      </button>

      {/* LP 작성 모달 */}
      {isModalOpen && <LpFormModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};
