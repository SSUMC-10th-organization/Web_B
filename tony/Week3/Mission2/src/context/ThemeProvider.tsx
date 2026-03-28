import type { PropsWithChildren } from "react";
import { createContext, useContext, useState } from "react";

export type Theme = "LIGHT" | "DARK";

//상태에 대한 interface를 만들어준다.
interface IThemeContextState {
	//테마는 enum이나 type으로 관리해주면 된다.
	theme: Theme;
}

type TThemeContextAction = {
	toggleTheme: () => void;
};

//useContext를 쓰려면 선언이 필요함
export const ThemeContext = createContext<
	(IThemeContextState & TThemeContextAction) | undefined
>(undefined);

//우산을 만들어준다
export const ThemeProvider = ({ children }: PropsWithChildren) => {
	//값을 받아옴
	const [theme, setTheme] = useState<Theme>("LIGHT");
	const toggleTheme = (): void => {
		setTheme((prevTheme): Theme => (prevTheme === "LIGHT" ? "DARK" : "LIGHT"));
	};

	return (
		<ThemeContext.Provider value={{ theme, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	);
};

export const useTheme = (): IThemeContextState & TThemeContextAction => {
	const context = useContext(ThemeContext);

	if (!context) {
		throw new Error("useThme must be used within a ThemeProvider");
	}
	return context;
};
