import type { ReactNode } from "react";
import { createContext, useContext } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

// 1. 공용 주머니의 규격 정의
const AuthContext = createContext<any>(null);

// 2. 주머니를 관리하는 '공급자(Provider)' 컴포넌트
export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [tokenA, setTokenA] = useLocalStorage("accessToken", null);
	const [tokenR, setTokenR] = useLocalStorage("refreshToken", null);
	const [nickname, setNick] = useLocalStorage("nickname", null);

	const logout = () => {
		setTokenA(null);
		setTokenR(null);
		setNick(null);
	};

	// 모든 자식 컴포넌트에게 이 값과 함수들을 공유합니다.
	return (
		<AuthContext.Provider
			value={{ tokenA, setTokenA, setTokenR, nickname, setNick, logout }}
		>
			{children}
		</AuthContext.Provider>
	);
};

// 다른 곳에서 편하게 꺼내 쓸 수 있는 커스텀 훅
export const useAuth = () => useContext(AuthContext);
