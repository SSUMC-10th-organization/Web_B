import type { Movie } from "../types/movie";
import MovieCard from "../components/MovieCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { useSearchParams } from "react-router-dom";
import { useCustomFetch } from "../hooks/useCustomFetch";

interface MoviePageProps {
  endpoint: string;
}

interface MovieResponse {
  results: Movie[];
  total_pages: number;
}

export default function MoviePage({ endpoint }: MoviePageProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page") ?? 1);

  const setPage = (newPage: number) => {
    setSearchParams({ page: String(newPage) });
  };

  const { data, isLoading, error } = useCustomFetch<MovieResponse>(
    `/movie/${endpoint}`,
    { page },
  );

  const movies = data?.results ?? [];
  const totalPages = data?.total_pages ?? 1;

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
          onClick={() => setPage(page - 1)}
          disabled={isFirst}
          className={`${btnBase} ${isFirst ? btnDisabled : btnActive}`}
        >
          {"<"}
        </button>
        <span className="text-gray-700 font-medium">{page} 페이지</span>
        <button
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
