import { useState } from "react";

function useLocalStorage<T>(key: string, initialValue: T) {
	const [storedValue, setStoredValue] = useState<T>(() => {
		try {
			const item = window.localStorage.getItem(key);
			return item ? (JSON.parse(item) as T) : initialValue;
		} catch (error) {
			console.error(`useLocalStorage 읽기 오류 [${key}]:`, error);
			return initialValue;
		}
	});

	const setValue = (value: T) => {
		try {
			setStoredValue(value);
			window.localStorage.setItem(key, JSON.stringify(value));
		} catch (error) {
			console.error(`useLocalStorage 쓰기 오류 [${key}]:`, error);
		}
	};

	const removeValue = () => {
		try {
			setStoredValue(initialValue);
			window.localStorage.removeItem(key);
		} catch (error) {
			console.error(`useLocalStorage 삭제 오류 [${key}]:`, error);
		}
	};

	return { storedValue, setValue, removeValue } as const;
}

export default useLocalStorage;
