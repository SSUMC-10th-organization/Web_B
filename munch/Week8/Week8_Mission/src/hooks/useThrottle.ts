import { useCallback, useEffect, useRef } from "react";

function useThrottle<T extends unknown[]>(
	callback: (...args: T) => void,
	interval: number = 1000,
): (...args: T) => void {
	const lastCalledRef = useRef<number>(0);
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		return () => {
			if (timerRef.current) {
				clearTimeout(timerRef.current);
			}
		};
	}, [interval]);

	const throttledCallback = useCallback(
		(...args: T) => {
			const now = Date.now();
			const elapsed = now - lastCalledRef.current;

			if (elapsed >= interval) {
				lastCalledRef.current = now;
				callback(...args);
			} else {
				if (timerRef.current) clearTimeout(timerRef.current);
				timerRef.current = setTimeout(() => {
					lastCalledRef.current = Date.now();
					callback(...args);
				}, interval - elapsed);
			}
		},
		[callback, interval],
	);

	return throttledCallback;
}

export default useThrottle;
