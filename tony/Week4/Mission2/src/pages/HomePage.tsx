import { Outlet } from "react-router-dom";

function HomePage() {
	return (
		<>
			<div>Home</div>
			<Outlet />
		</>
	);
}

export default HomePage;
