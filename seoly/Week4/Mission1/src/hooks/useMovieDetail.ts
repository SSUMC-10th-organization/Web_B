import axios from "axios";
import { useEffect, useState } from "react";
import { data, useParams } from "react-router-dom";
import type { Cast, Credits, Crew, Movie } from "../types/movie";

const useMovieDetail = (p0?: string) => {
	const { movieId } = useParams<{ movieId: string }>();

	const [movie, setMovie] = useState<Movie | null>(null);

	const [cast, setCast] = useState<Cast[]>([]);
	const [director, setDirector] = useState<Crew | null>(null);

	const [isPending, setIsPending] = useState(true);
	const [isError, setIsError] = useState(false);

	useEffect(() => {
		const fetchMovieDetail = async () => {
			setIsPending(true);
			try {
				const { data: movieData } = await axios.get<Movie>(
					`https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`,
					{
						headers: {
							Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
						},
					},
				);
				setMovie(movieData);

				const { data: creditData } = await axios.get<Credits>(
					`https://api.themoviedb.org/3/movie/${movieId}/credits`,
					{
						headers: {
							Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
						},
					},
				);
				setCast(creditData.cast);
				const directorInfo = creditData.crew.find(
					(person) => person.job === "Director",
				);
				setDirector(directorInfo || null);
			} catch {
				setIsError(true);
			} finally {
				setIsPending(false);
			}
		};

		fetchMovieDetail();
	}, [movieId]);

	return { isPending, isError, movie, cast, director };
};
export default useMovieDetail;
