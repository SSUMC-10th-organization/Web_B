import { useEffect, useState } from "react";
import { tmdb } from "../api/tmdb";

export function useCustomFetch<T>(url: string, params?: object) {
	const [data, setData] = useState<T | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const paramsString = params ? JSON.stringify(params) : "";

	useEffect(() => {
		if (!url) return;

		const fetchData = async () => {
			setIsLoading(true);
			setError(null);
			try {
				const parsedParams = paramsString
					? JSON.parse(paramsString)
					: undefined;
				const { data } = await tmdb.get<T>(url, { params: parsedParams });
				setData(data);
			} catch {
				setError("데이터를 불러오는 데 실패했습니다.");
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, [url, paramsString]);

	return { data, isLoading, error };
}
