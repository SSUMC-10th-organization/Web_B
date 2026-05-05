import { Link, useParams } from "react-router-dom";
import { LoadingSpinner } from "../components/LoadingSpinner";
import MovieCard from "../components/MovieCard";
import useMovies from "../hooks/useMovies";

export default function MoviesPage() {
	const { movieId } = useParams<{ movieId: string }>();
	const { movies, page, setPage, isError, isPending } = useMovies(movieId);

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
