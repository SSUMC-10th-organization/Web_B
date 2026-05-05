import clsx from "clsx";
import { THEME, useTheme } from "./context/ThemeProvider";

export default function ThemeContent() {
	const { theme } = useTheme();
	const isLightMode = theme === THEME.Light;

	return (
		<div
			className={clsx("p-4 h-dvh", isLightMode ? "bg-white" : "bg-gray-800")}
		>
			ThemeContent
		</div>
	);
}
