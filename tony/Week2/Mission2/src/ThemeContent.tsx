import clsx from "clsx";
import { type Theme, useTheme } from "./context/ThemeProvider";

export default function ThemeContent({ count }: { count: number }) {
	const { theme, toggleTheme } = useTheme();

	const isLightMode = theme === "LIGHT";
	return (
		<div
			className={clsx(
				"p-4 h-dvh w-full",
				isLightMode ? "bg-white" : "bg-gray-800",
			)}
		>
			{" "}
			ThemeContent
		</div>
	);
}
