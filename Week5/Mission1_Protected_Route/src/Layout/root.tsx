import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar";

export const RootLayout = () => {
	return (
		<div className="flex flex-col min-h-screen bg-black">
			<Navbar />

			<main className="flex-1 bg-black">
				<Outlet />
			</main>
		</div>
	);
};