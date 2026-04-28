import axios from "axios";
import { useEffect, useState } from "react";
import type { Movie, MovieResponse } from "../types/movies";

export const useCustomFetch = (url: string) => {
	const [movies, setMovies] = useState<Movie[]>([]);
	const [isloading, setIsLoading] = useState(true);
	const [iserror, setIsError] = useState(false);

	useEffect(() => {
		const fetchMovies = async () => {
			setIsLoading(true);
			// URL 마지막에 하드코딩된 page=1 대신 ${currentPage} 삽입

			try {
				const { data } = await axios.get<MovieResponse>(url, {
					headers: {
						Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
					},
				});
				setMovies(data.results);
			} catch (error) {
				return setIsError(true);
			} finally {
				setIsLoading(false);
			}
			window.scrollTo(0, 0);
		};
		fetchMovies();
	}, [url]);
	return { movies, isloading, iserror };
};
