// src/hooks/useCustomFetch.ts

import axios from "axios";
import { useEffect, useState } from "react";

const useCustomFetch = (url: string) => {
	const [data, setData] = useState<any>(null);
	const [isPending, setIsPending] = useState(true);
	const [isError, setIsError] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			setIsPending(true);
			try {
				const response = await axios.get(url, {
					headers: {
						Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
					},
				});
				setData(response.data);
			} catch (error) {
				setIsError(true);
			} finally {
				setIsPending(false);
			}
		};
		fetchData();
	}, [url]);

	// 이 3개를 꾸러미로 돌려줍니다.
	return { data, isPending, isError };
};

export default useCustomFetch;
