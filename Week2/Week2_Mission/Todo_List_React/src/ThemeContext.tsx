import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
	theme: Theme;
	toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	// 로컬 스토리지에서 이전 설정을 가져오거나 기본값을 'light'로 설정
	const [theme, setTheme] = useState<Theme>(() => {
		return (localStorage.getItem("theme") as Theme) || "light";
	});

	useEffect(() => {
		const root = window.document.documentElement; // <html> 태그
		if (theme === "dark") {
			root.classList.add("dark");
		} else {
			root.classList.remove("dark");
		}
		localStorage.setItem("theme", theme);
	}, [theme]);

	const toggleTheme = () => {
		setTheme((prev) => (prev === "light" ? "dark" : "light"));
	};

	return (
		<ThemeContext.Provider value={{ theme, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	);
}

export const useTheme = () => {
	const context = useContext(ThemeContext);
	if (!context) throw new Error("ThemeProvider 안에서 사용하세요!");
	return context;
};
