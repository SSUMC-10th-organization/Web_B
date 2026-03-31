import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { LoadingSpinner } from "../components/LoadingSpinner";
import type { Movie } from "../types/movie";

const MovieDetailPage = () => {
	const { movieId } = useParams<{ movieId: string }>();

	const [movie, setMovie] = useState<Movie | null>(null);
	const [isPending, setIsPending] = useState(true);
	const [isError, setIsError] = useState(false);

	useEffect(() => {
		const fetchMovieDetail = async () => {
			setIsPending(true);
			try {
				const { data } = await axios.get<Movie>(
					`https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`,
					{
						headers: {
							Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
						},
					},
				);
				setMovie(data);
			} catch {
				setIsError(true);
			} finally {
				setIsPending(false);
			}
		};

		fetchMovieDetail();
	}, [movieId]);

	if (isPending) return <LoadingSpinner />;
	if (isError || !movie)
		return (
			<div className="text-white text-center p-20 font-bold">
				영화 정보를 불러오지 못했습니다.
			</div>
		);

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

					<div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
						<h2 className="text-2xl font-bold mb-4 text-blue-400">줄거리</h2>
						<p className="text-lg leading-relaxed text-gray-200 break-keep">
							{movie.overview || "등록된 줄거리가 없습니다."}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default MovieDetailPage;
