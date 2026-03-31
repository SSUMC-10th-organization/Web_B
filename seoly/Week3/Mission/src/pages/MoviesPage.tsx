import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LoadingSpinner } from "../components/LoadingSpinner";
import MovieCard from "../components/MovieCard";
import type { Movie, MovieResponse } from "../types/movie";

export default function MoviesPage() {
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
							Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`, // 본인 TMDB 토큰으로 교체
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

	if (isPending) {
		return <LoadingSpinner />;
	}

	if (isError) {
		return (
			<div>
				<span className="text-red-500 text-2xl">에러가 발생했습니다.</span>
			</div>
		);
	}

	return (
		<div>
			<div className="flex items-center justify-center gap-4 mt-5">
				<button
					type="button"
					className="px-4 py-2 rounded-lg shadow-md bg-blue-600 text-white cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed"
					disabled={page === 1}
					onClick={() => setPage((prev) => prev - 1)}
				>
					{`<`}
				</button>
				<span className="font-bold">{page}페이지</span>
				<button
					type="button"
					className="px-4 py-2 rounded-lg shadow-md bg-blue-600 text-white cursor-pointer"
					onClick={() => setPage((prev) => prev + 1)}
				>
					{`>`}
				</button>
			</div>
			<div className="p-10 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 ld:grid-cols-5 xl:grid-cols-6">
				{movies.map((movie) => (
					<Link key={movie.id} to={`/movies/${movie.id}`}>
						<MovieCard movie={movie} />
					</Link>
				))}
			</div>
		</div>
	);
}
