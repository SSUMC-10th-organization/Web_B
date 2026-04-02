import { useTheme } from "../ThemeContext";

export function ThemeToggle() {
	const { theme, toggleTheme } = useTheme();

	return (
		<button
			type="button"
			onClick={toggleTheme}
			className="fixed top-5 right-5 p-3 rounded-full bg-gray-100 dark:bg-gray-800 shadow-md hover:ring-2 ring-blue-500 transition-all"
		>
			{theme === "light" ? "🌙" : "☀️"}
		</button>
	);
}
