import { NavLink } from "react-router-dom";

const Navbar = () => {
	return (
		<nav className="flex justify-start gap-4 p-6 bg-white">
			<NavLink
				to="/"
				end
				className={({ isActive }) => `font-bold transition-colors 
        ${isActive ? "text-blue-600 underline underline-offset-8" : "text-gray-500 hover:text-gray-800"}`}
			>
				홈
			</NavLink>
			<NavLink
				to="/popular"
				end
				className={({ isActive }) => `font-bold transition-colors 
        ${isActive ? "text-blue-600 underline underline-offset-8" : "text-gray-500 hover:text-gray-800"}`}
			>
				인기 영화
			</NavLink>
			<NavLink
				to="/playing"
				end
				className={({ isActive }) => `font-bold transition-colors 
        ${isActive ? "text-blue-600 underline underline-offset-8" : "text-gray-500 hover:text-gray-800"}`}
			>
				상영 중
			</NavLink>
			<NavLink
				to="/rate"
				end
				className={({ isActive }) => `font-bold transition-colors 
        ${isActive ? "text-blue-600 underline underline-offset-8" : "text-gray-500 hover:text-gray-800"}`}
			>
				평점 높은
			</NavLink>
			<NavLink
				to="/upcoming"
				end
				className={({ isActive }) => `font-bold transition-colors 
        ${isActive ? "text-blue-600 underline underline-offset-8" : "text-gray-500 hover:text-gray-800"}`}
			>
				개봉 예정
			</NavLink>
		</nav>
	);
};

export default Navbar;
