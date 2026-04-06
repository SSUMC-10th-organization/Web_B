import { useNavigate, useParams } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import { useCustomFetch } from "../hooks/useCustomFetch";
import type { Credits, CrewMember, MovieDetail } from "../types/movieDetail";

export default function MovieDetailPage() {
	const { movieId } = useParams<{ movieId: string }>();
	const navigate = useNavigate();

	const {
		data: movie,
		isLoading: loadingMovie,
		error: errorMovie,
	} = useCustomFetch<MovieDetail>(movieId ? `/movie/${movieId}` : "");

	const { data: credits, isLoading: loadingCredits } = useCustomFetch<Credits>(
		movieId ? `movie/${movieId}/credits` : "",
	);

	const isLoading = loadingMovie || loadingCredits;
	const error = errorMovie;

	if (isLoading) return <LoadingSpinner />;

	if (error || !movie) {
		return (
			<div className="flex justify-center items-center h-96">
				<p className="text-red-500 text-lg">영화를 찾을 수 없습니다.</p>
			</div>
		);
	}

	const directors: CrewMember[] =
		credits?.crew.filter((c) => c.job === "Director") ?? [];
	const topCast = credits?.cast.slice(0, 20) ?? [];

	return (
		<div className="min-h-screen bg-black text-white">
			<div className="relative w-full h-[480px]">
				{movie.backdrop_path && (
					<img
						src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
						alt={movie.title}
						className="w-full h-full object-cover object-center"
					/>
				)}
				<div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
				<div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

				<button
					type="button"
					onClick={() => navigate(-1)}
					className=" absolute top-6 left-6 px-4 py-2 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white text-sm transition-all"
				>
					⬅️뒤로
				</button>

				<div className="absolute bottom-8 left-8 flex gap-6 items-end">
					<img
						src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
						alt={movie.title}
						className="w-32 rounded-xl shadow-2xl hidden sm:block"
					/>
					<div>
						<h1 className="text-4xl font-bold mb-1">{movie.title}</h1>
						{movie.tagline && (
							<p className="text-gray-300 italic mb-3 text-sm">
								{movie.tagline}
							</p>
						)}
						<div className="flex flex-wrap gap-2 text-sm text-gray-300 mb-3">
							<span>⭐ {movie.vote_average.toFixed(1)}</span>
							<span>·</span>
							<span>{movie.release_date?.slice(0, 4)}</span>
							<span>·</span>
							<span>{movie.runtime}분</span>
						</div>
						<div className="flex flex-wrap gap-2">
							{movie.genres.map((g) => (
								<span
									key={g.id}
									className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs"
								>
									{g.name}
								</span>
							))}
						</div>
					</div>
				</div>
			</div>

			<div className="px-8 py-8 max-w-4xl">
				<h2 className="text-xl font-bold mb-3 border-l-4 border-purple-400 pl-3">
					줄거리
				</h2>
				<p className="text-gray-300 leading-relaxed">
					{movie.overview || "줄거리 정보가 없습니다."}
				</p>
			</div>

			{directors.length > 0 && (
				<div className="px-8 pb-6">
					<h2 className="text-xl font-bold mb-4 border-l-4 border-purple-400 pl-3">
						감독
					</h2>
					<div className="flex gap-4">
						{directors.map((d) => (
							<div key={d.id} className="flex items-center gap-3">
								{d.profile_path ? (
									<img
										src={`https://image.tmdb.org/t/p/w185${d.profile_path}`}
										alt={d.name}
										className="w-12 h-12 rounded-full object-cover"
									/>
								) : (
									<div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-gray-400 text-xs">
										없음
									</div>
								)}
								<span className="text-sm font-medium">{d.name}</span>
							</div>
						))}
					</div>
				</div>
			)}

			{topCast.length > 0 && (
				<div className="px-8 pb-12">
					<h2 className="text-xl font-bold mb-4 border-l-4 border-purple-400 pl-3">
						출연진
					</h2>
					<div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-10 gap-4">
						{topCast.map((actor) => (
							<div
								key={actor.id}
								className="flex flex-col items-center text-center"
							>
								{actor.profile_path ? (
									<img
										src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
										alt={actor.name}
										className="w-16 h-16 rounded-full object-cover mb-2 border-2 border-gray-700"
									/>
								) : (
									<div className="w-16 h-16 rounded-full bg-gray-700 mb-2 flex items-center justify-center text-gray-400 text-xs border-2 border-gray-600">
										없음
									</div>
								)}
								<p className="text-xs font-semibold leading-tight">
									{actor.name}
								</p>
								<p className="text-xs text-gray-400 leading-tight mt-0.5 line-clamp-2">
									{actor.character}
								</p>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
