import { useEffect, useState } from "react";

const cache = new Map<string, { data: unknown; timestamp: number }>();

interface UseCustomQueryOptions<T> {
	queryKey: string[];
	queryFn: () => Promise<T>;
	staleTime?: number;
	retry?: number;
}

interface UseCustomQueryResult<T> {
	data: T | null;
	isPending: boolean;
	isError: boolean;
	error: Error | null;
}

export function useCustomQuery<T>({
	queryKey,
	queryFn,
	staleTime = 0,
	retry = 0,
}: UseCustomQueryOptions<T>): UseCustomQueryResult<T> {
	const cacheKey = queryKey.join("-");

	const [data, setData] = useState<T | null>(null);
	const [isPending, setIsPending] = useState(false);
	const [isError, setIsError] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	// biome-ignore lint/correctness/useExhaustiveDependencies: queryFn을 deps에 넣으면 매 렌더마다 재요청됨
	useEffect(() => {
		const fetchWithRetry = async (remainingRetry: number): Promise<T> => {
			try {
				return await queryFn();
			} catch (err) {
				if (remainingRetry > 0) {
					return fetchWithRetry(remainingRetry - 1);
				}
				throw err;
			}
		};

		const fetchData = async () => {
			const cached = cache.get(cacheKey);
			if (cached) {
				const isFresh = Date.now() - cached.timestamp < staleTime;
				if (isFresh) {
					setData(cached.data as T);
					return;
				}
			}

			setIsPending(true);
			setIsError(false);
			setError(null);

			try {
				const result = await fetchWithRetry(retry);
				cache.set(cacheKey, { data: result, timestamp: Date.now() });
				setData(result);
			} catch (err) {
				setIsError(true);
				setError(err as Error);
			} finally {
				setIsPending(false);
			}
		};

		fetchData();
	}, [cacheKey, staleTime, retry]);

	return { data, isPending, isError, error };
}
