import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import MovieCard from "../components/MovieCard";
import type { Movie } from "../types/movie";

interface MoviePageProps {
	endpoint: string;
}

export default function MoviePage({ endpoint }: MoviePageProps) {
	const [movies, setMovies] = useState<Movie[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [totalPages, setTotalPages] = useState<number>(1);

	const [searchParams, setSearchParams] = useSearchParams();
	const page = Number(searchParams.get("page") ?? 1);

	const setPage = (newPage: number) => {
		setSearchParams({ page: String(newPage) });
	};

	useEffect(() => {
		const fetchMovies = async () => {
			setIsLoading(true);
			setError(null);

			try {
				const { data } = await axios.get(
					`https://api.themoviedb.org/3/movie/${endpoint}?language=ko-KR&page=${page}`,
					{
						headers: {
							Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
						},
					},
				);
				setMovies(data.results);
				setTotalPages(data.total_pages);
			} catch {
				setError("영화 데이터를 불러오는 데 실패했습니다. 다시 시도해주세요.");
			} finally {
				setIsLoading(false);
			}
		};

		fetchMovies();
	}, [endpoint, page]);

	const isFirst = page === 1;
	const isLast = page === totalPages;

	const btnBase =
		"px-4 py-2 rounded-lg transition-all duration-150 active:scale-95";
	const btnActive = "bg-purple-400 text-white hover:bg-green-400";
	const btnDisabled = "bg-gray-200 text-gray-400 cursor-not-allowed";

	return (
		<div className="px-10">
			<div className="flex justify-center items-center gap-4 py-6">
				<button
					type="button"
					onClick={() => setPage(page - 1)}
					disabled={isFirst}
					className={`${btnBase} ${isFirst ? btnDisabled : btnActive}`}
				>
					{"<"}
				</button>
				<span className="text-gray-700 font-medium">{page} 페이지</span>
				<button
					type="button"
					onClick={() => setPage(page + 1)}
					disabled={isLast}
					className={`${btnBase} ${isLast ? btnDisabled : btnActive}`}
				>
					{">"}
				</button>
			</div>

			{isLoading ? (
				<LoadingSpinner />
			) : error ? (
				<div className="flex justify-center items-center h-96">
					<p className="text-red-500 text-lg">{error}</p>
				</div>
			) : (
				<div className="p-10 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
					{movies.map((movie) => (
						<MovieCard key={movie.id} movie={movie} />
					))}
				</div>
			)}
		</div>
	);
}
