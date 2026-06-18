import { useEffect, useRef, useState } from "react";

function useThrottle<T>(value: T, interval: number): T {
	const [throttledValue, setThrottledValue] = useState<T>(value);
	const lastUpdatedAt = useRef<number>(0);
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		const now = Date.now();
		const remaining = interval - (now - lastUpdatedAt.current);

		if (remaining <= 0) {
			if (timerRef.current) {
				clearTimeout(timerRef.current);
				timerRef.current = null;
			}
			lastUpdatedAt.current = now;
			setThrottledValue(value);
		} else {
			timerRef.current = setTimeout(() => {
				lastUpdatedAt.current = Date.now();
				setThrottledValue(value);
				timerRef.current = null;
			}, remaining);
		}

		return () => {
			if (timerRef.current) {
				clearTimeout(timerRef.current);
				timerRef.current = null;
			}
		};
	}, [value, interval]);

	return throttledValue;
}

export default useThrottle;
