import { useEffect, useState, type Dispatch, type SetStateAction } from "react";

export const useLocalStorage = <T,>(
	key: string,
	initial: T,
): [T, Dispatch<SetStateAction<T>>] => {
	const [value, setValue] = useState<T>(() => {
		const saved = localStorage.getItem(key);

		if (saved === null || saved === "null") {
			return initial;
		}

		try {
			return JSON.parse(saved) as T;
		} catch {
			return initial;
		}
	});

	useEffect(() => {
		if (value === null || value === undefined) {
			localStorage.removeItem(key);
			return;
		}

		localStorage.setItem(key, JSON.stringify(value));
	}, [key, value]);

	return [value, setValue];
};