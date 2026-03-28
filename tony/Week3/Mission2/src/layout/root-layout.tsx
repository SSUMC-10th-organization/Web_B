//navbar 만들기 (고정된 레이아웃)
// // src/layout/root-layout.tsx
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const RootLayout = () => {
  return (
    <>
        <Navbar />
        <Outlet />
    </>
  );
};

export default RootLayout;