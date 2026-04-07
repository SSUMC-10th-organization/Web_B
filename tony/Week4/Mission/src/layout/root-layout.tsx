//navbar 만들기 (고정된 레이아웃)
// // src/layout/root-layout.tsx
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const RootLayout = () => {
	return (
		<>
			<Navbar />
			<Outlet /> //children 경로에 해당하는 페이지를 여기에 랜딩해줘! 라는 자리 표시자.
		</>
	);
};

export default RootLayout;
