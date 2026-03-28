import clsx from "clsx";
import type { Theme } from "./context/ThemeProvider";
import { useTheme } from "./context/ThemeProvider";
import ThemeToggleButton from "./ThemeToggleButton";
export default function Navbar() {
	const { theme, toggleTheme } = useTheme();

	const isLightMode = theme === "LIGHT";

	console.log(theme);
	return (
		<nav
			className={clsx(
				"p-4 w-full flex justify-end",
				isLightMode ? "bg-white" : "bg-gray-800",
			)}
		>
			<ThemeToggleButton />
		</nav>
	);
}
