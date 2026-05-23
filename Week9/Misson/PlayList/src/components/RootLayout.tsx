import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer"; 
import CartContainer from "./CartContainer";
import Modal from "./Modal";
import { type RootState } from "../store/store";
import { useSelector } from "react-redux";

export default function RootLayout() {
  const { isOpen } = useSelector((state: RootState) => state.modal);
  return (
    <div className="min-h-screen flex flex-col relative">
      {/* isOpen이 true일 때만 Modal 컴포넌트를 화면에 띄웁니다. */}
      {isOpen && <Modal />}
      <Navbar />
      <main className="flex-grow">
        <Outlet /> 
      </main>
      <CartContainer></CartContainer>
      <Footer />
    </div>
  );
}