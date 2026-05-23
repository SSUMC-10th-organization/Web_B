import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer"; 
import CartContainer from "./CartContainer";

export default function RootLayout() {
  return (
    <div className = "min-h-screen flex flex-col">
      <Navbar /> 
      <main className="flex-grow">
        <Outlet /> 
      </main>
      <CartContainer></CartContainer>
      <Footer />
    </div>
  );
}