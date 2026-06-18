import axios from "axios";
import type { Language, MovieSearchResponse } from "../types/movie";

const tmdb = axios.create({
	baseURL: "https://api.themoviedb.org/3",
	headers: {
		Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
	},
});

export const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";
export const IMAGE_ORIGINAL = "https://image.tmdb.org/t/p/original";

export async function searchMovies(
	query: string,
	language: Language,
	includeAdult: boolean,
	page = 1,
): Promise<MovieSearchResponse> {
	const { data } = await tmdb.get<MovieSearchResponse>("/search/movie", {
		params: {
			query,
			language,
			include_adult: includeAdult,
			page,
		},
	});
	return data;
}
