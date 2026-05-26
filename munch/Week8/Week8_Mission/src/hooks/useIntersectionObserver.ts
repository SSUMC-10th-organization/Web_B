import { useEffect, useRef } from "react";
import useThrottle from "./useThrottle";

export const useIntersectionObserver = (
	callback: () => void,
	hasNextPage: boolean | undefined,
	interval: number = 1000,
) => {
	const observerRef = useRef<HTMLDivElement>(null);

	const throttledCallback = useThrottle(callback, interval);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && hasNextPage) {
					throttledCallback();
				}
			},
			{ threshold: 0.5 },
		);

		if (observerRef.current) {
			observer.observe(observerRef.current);
		}

		return () => observer.disconnect();
	}, [throttledCallback, hasNextPage]);

	return observerRef;
};
