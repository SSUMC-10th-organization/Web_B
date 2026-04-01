import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { LoadingSpinner } from "../components/LoadingSpinner";
import type { Movie } from "../types/movie";

const MovieDetailPage = () => {
	const { movieId } = useParams<{ movieId: string }>();

	const [movie, setMovie] = useState<Movie | undefined>(undefined);
	const [isPending, setIsPending] = useState(false);
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

	if (isError) {
		return (
			<div>
				<span className="text-red-500 text-2xl">에러가 발생했습니다.</span>
			</div>
		);
	}

	return (
		<>
			<div>
				<img
					src={`https://image.tmdb.org/t/p/w200${movie?.poster_path}`}
					alt="movie poster"
				/>
			</div>
			<div>
				<h1>{movie?.title}</h1>
				<p>{movie?.vote_average.toFixed(1)}</p>
				<p>{movie?.release_date}</p>

				<p>{movie?.overview}</p>
			</div>
			{isPending && (
				<div className="flex items-center justify-center h-dvh">
					<LoadingSpinner />
				</div>
			)}
		</>
	);
};

export default MovieDetailPage;
