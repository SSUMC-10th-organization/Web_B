import { useParams } from "react-router-dom";
import { LoadingSpinner } from "../components/LoadingSpinner";
import useMovieDetail from "../hooks/useMovieDetail";

const MovieDetailPage = () => {
	const { movieId } = useParams<{ movieId: string }>();

	const { movie, cast, director, isPending, isError } = useMovieDetail(movieId);

	if (isPending) return <LoadingSpinner />;

	if (isError) return <div>영화를 불러오는 중 에러가 발생했습니다.</div>;

	if (!movie) return null;

	return (
		<div className="min-h-screen bg-black text-white p-6 md:p-12">
			<div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10 items-center md:items-start">
				<div className="w-full md:w-1/3 flex-shrink-0">
					<img
						src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
						alt={movie.title}
						className="w-full rounded-2xl border border-gray-800"
					/>
				</div>

				<div className="w-full md:w-2/3 flex flex-col gap-6">
					<h1 className="text-4xl md:text-6xl font-black">{movie.title}</h1>

					<div className="flex items-center gap-4 text-xl">
						<span className="text-yellow-400 font-bold">
							평점: {movie.vote_average.toFixed(1)}
						</span>
						<span className="text-gray-400">|</span>
						<span className="text-gray-400">{movie.release_date}</span>
					</div>

					<div className="bg-gray-800/50 p-6 rounded-xl border border-gray-600">
						<h2 className="text-2xl font-bold mb-4 text-blue-400">줄거리</h2>
						<p className="text-lg leading-relaxed text-gray-200 break-keep">
							{movie.overview || "등록된 줄거리가 없습니다."}
						</p>
					</div>

					<div className="bg-gray-800/50 p-6 rounded-xl border border-gray-600">
						{/* 감독 출연 넣기 */}
						<h2 className="text-2xl font-bold mb-4 text-white">감독/출연</h2>
						<div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-5 gap-x-4 gap-y-10">
							{director && (
								<div className="flex flex-col items-center text-center group">
									<div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden mb-3 border border-gray-800 shadow-lg">
										<img
											src="https://via.placeholder.com/150?text=Director"
											alt={director.name}
											className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
										/>
									</div>
									<p className="text-sm font-bold truncate w-full">
										{director.name}
									</p>
									<p className="text-xs text-gray-400 mt-1">감독</p>
								</div>
							)}

							{cast.map((person) => (
								<div
									key={person.id}
									className="flex flex-col items-center text-center group"
								>
									<div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden mb-3 border border-gray-800 shadow-lg bg-gray-900">
										<img
											src={
												person.profile_path
													? `https://image.tmdb.org/t/p/w185${person.profile_path}`
													: "https://via.placeholder.com/185x278?text=No+Img"
											}
											alt={person.name}
											className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
										/>
									</div>
									<p className="text-sm font-bold leading-tight truncate w-full px-1">
										{person.name}
									</p>

									<p className="text-[11px] text-gray-500 mt-1 leading-snug break-keep px-1">
										{person.character}
									</p>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default MovieDetailPage;
