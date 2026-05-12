import { useEffect, useMemo, useState } from "react";

const STALE_TIME = 5 * 60 * 1_000;

interface CacheEntry<T> {
	data: T;
	lastFetched: number;
}

export const useCustomFetch = <T>(url: string) => {
	const [data, setData] = useState<T | null>(null);
	const [isPending, setIsPending] = useState<boolean>(false);
	const [isError, setIsError] = useState<boolean>(false);

	const storageKey = useMemo(() => url, [url]);

	useEffect(() => {
		setIsError(false);

		const fetchData = async () => {
			const currentTime = Date.now();
			const cachedItem = localStorage.getItem(storageKey);

			if (cachedItem) {
				try {
					const cachedData: CacheEntry<T> = JSON.parse(cachedItem);

					if (currentTime - cachedData.lastFetched < STALE_TIME) {
						setData(cachedData.data);
						setIsPending(false);
						console.log(`[Cache Hit] Using fresh data for: ${url}`);
						return;
					}

					setData(cachedData.data);
					console.log(`[Cache Stale] Refetching data for: ${url}`);
				} catch {
					localStorage.removeItem(storageKey);
					console.warn(
						`[Cache Error] Corrupted cache for: ${url}. Cache cleared.`,
					);
				}
			}

			setIsPending(true);

			try {
				const response = await fetch(url);

				if (!response.ok) {
					throw new Error(`HTTP Status: ${response.status}`);
				}

				const newData: T = await response.json();

				setData(newData);
				const newCacheEntry: CacheEntry<T> = {
					data: newData,
					lastFetched: Date.now(),
				};
				localStorage.setItem(storageKey, JSON.stringify(newCacheEntry));
			} catch (error) {
				setIsError(true);
				console.error("Fetch Failed:", error);
			} finally {
				setIsPending(false);
			}
		};

		fetchData();
	}, [url, storageKey]);

	return { data, isPending, isError };
};
