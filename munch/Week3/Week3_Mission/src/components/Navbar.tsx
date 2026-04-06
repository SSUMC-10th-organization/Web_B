import { NavLink } from "react-router-dom";

const NAV_ITEMS = [
	{ label: "홈", path: "/" },
	{ label: "인기 영화", path: "/popular" },
	{ label: "상영 중", path: "/nPlaying" },
	{ label: "평점 높은", path: "/topRate" },
	{ label: "개봉 예정", path: "/upcoming" },
];

export default function Navbar() {
	return (
		<nav className="flex gap-6 px-10 py-4">
			{NAV_ITEMS.map(({ label, path }) => (
				<NavLink
					key={path}
					to={path}
					end={path === "/"}
					className={({ isActive }) =>
						isActive
							? "text-green-500 font-semibold"
							: "text-gray-500 hover:text-gray-800 transition-colors"
					}
				>
					{label}
				</NavLink>
			))}
		</nav>
	);
}
