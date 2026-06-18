import { NavLink } from "react-router-dom";

const Navbar = () => {
	const baseStyle = {
		textDecoration: "none",
		fontWeight: "bold",
		padding: "8px 12px",
		borderRadius: "8px",
	};

	return (
		<nav
			style={{
				display: "flex",
				gap: "8px",
				padding: "16px 24px",
				backgroundColor: "#1e1e2e",
			}}
		>
			<NavLink
				to="/"
				end
				style={({ isActive }) => ({
					...baseStyle,
					backgroundColor: isActive ? "#6366f1" : "transparent",
					color: isActive ? "white" : "#a5b4fc",
				})}
			>
				홈
			</NavLink>
			<NavLink
				to="/movies/popular"
				style={({ isActive }) => ({
					...baseStyle,
					backgroundColor: isActive ? "#6366f1" : "transparent",
					color: isActive ? "white" : "#a5b4fc",
				})}
			>
				인기 영화
			</NavLink>
			<NavLink
				to="/movies/now_playing"
				style={({ isActive }) => ({
					...baseStyle,
					backgroundColor: isActive ? "#6366f1" : "transparent",
					color: isActive ? "white" : "#a5b4fc",
				})}
			>
				현재 상영
			</NavLink>
			<NavLink
				to="/movies/top_rated"
				style={({ isActive }) => ({
					...baseStyle,
					backgroundColor: isActive ? "#6366f1" : "transparent",
					color: isActive ? "white" : "#a5b4fc",
				})}
			>
				최고 평점
			</NavLink>
			<NavLink
				to="/movies/upcoming"
				style={({ isActive }) => ({
					...baseStyle,
					backgroundColor: isActive ? "#6366f1" : "transparent",
					color: isActive ? "white" : "#a5b4fc",
				})}
			>
				개봉 예정
			</NavLink>
		</nav>
	);
};

export default Navbar;
