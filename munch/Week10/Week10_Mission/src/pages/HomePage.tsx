import { useCallback, useMemo, useState } from "react";
import MovieFilter from "../components/MovieFilter";
import MovieList from "../components/MovieList";
import MovieModal from "../components/MovieModal";
import useFetch from "../hooks/useFetch";
import type { Movie, MovieFilters, MovieResponse } from "../types/movie";

export default function HomePage() {
  const [filters, setFilters] = useState<MovieFilters>({
    query: "어벤져스",
    include_adult: false,
    language: "ko-KR",
  });

  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const axiosRequestConfig = useMemo(() => ({ params: filters }), [filters]);

  const { data, error, isLoading } = useFetch<MovieResponse>(
    "/search/movie",
    axiosRequestConfig,
  );

  const handleMovieFilters = useCallback((newFilters: MovieFilters) => {
    setFilters(newFilters);
  }, []);

  const handleMovieClick = useCallback((movie: Movie) => {
    setSelectedMovie(movie);
  }, []);

  const handleModalClose = useCallback(() => {
    setSelectedMovie(null);
  }, []);

  if (error) {
    return (
      <div className="flex h-60 items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl space-y-8 px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900">🎬 영화 검색</h1>

      <MovieFilter onChange={handleMovieFilters} />

      {isLoading ? (
        <div className="flex h-60 items-center justify-center">
          <p className="text-lg text-gray-500">🔄 검색 중입니다...</p>
        </div>
      ) : (
        <MovieList
          movies={data?.results ?? []}
          onMovieClick={handleMovieClick}
        />
      )}

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleModalClose} />
      )}
    </div>
  );
}
