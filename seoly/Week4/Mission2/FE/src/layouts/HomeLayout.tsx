import { Outlet } from "react-router-dom";
import Header from "../components/Header";

const HomeLayout = () => {
	return (
		<div className="h-dvh flex flex-col">
			{/* h-dvh: 화면 전체를 영역으로 잡게 하는 역할 */}
			<Header />
			<main className="bg-[#000000] flex-1">
				<Outlet />
			</main>
			<footer></footer>
		</div>
	);
};

export default HomeLayout;
