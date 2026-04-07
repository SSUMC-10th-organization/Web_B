import axios from "axios";
import { useEffect, useState } from "react";
import type { Movie, MovieResponse } from "../types/movie";

const useMovies = (p0?: string) => {
	const [movies, setMovies] = useState<Movie[]>([]);
	const [isPending, setIsPending] = useState(false);
	const [isError, setIsError] = useState(false);
	const [page, setPage] = useState(1);

	useEffect(() => {
		const fetchMovies = async () => {
			setIsPending(true);

			try {
				const { data } = await axios.get<MovieResponse>(
					`https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=${page}`,
					{
						headers: {
							Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
						},
					},
				);
				setMovies(data.results);
			} catch {
				setIsError(true);
			} finally {
				setIsPending(false);
			}
		};

		fetchMovies();
	}, [page]);

	return { movies, page, setPage, isError, isPending };
};

export default useMovies;
