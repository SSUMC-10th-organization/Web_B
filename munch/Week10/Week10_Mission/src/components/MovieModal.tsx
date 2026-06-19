import { useEffect } from "react";
import type { Movie } from "../types/movie";

interface MovieModalProps {
  movie: Movie | null;
  onClose: () => void;
}

const MovieModal = ({ movie, onClose }: MovieModalProps) => {
  const imageBaseUrl = "https://image.tmdb.org/t/p/w500";
  const fallbackImage = "https://via.placeholder.com/500x750?text=No+Image";

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [onClose]);

  if (!movie) return null;

  const imdbSearchUrl = `https://www.imdb.com/find?q=${encodeURIComponent(movie.title)}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/80"
          aria-label="닫기"
        >
          ✕
        </button>

        <div className="relative h-72 w-full overflow-hidden">
          <img
            src={
              movie.poster_path
                ? `${imageBaseUrl}${movie.poster_path}`
                : fallbackImage
            }
            alt={`${movie.title} 포스터`}
            className="h-full w-full object-cover object-top"
          />
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
        </div>

        <div className="p-6">
          <h2 className="mb-1 text-2xl font-bold text-gray-900">
            {movie.title}
          </h2>
          {movie.original_title !== movie.title && (
            <p className="mb-3 text-sm text-gray-500">{movie.original_title}</p>
          )}

          <div className="mb-4 flex flex-wrap gap-3">
            <span className="flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-700">
              ⭐ {movie.vote_average.toFixed(1)}
              <span className="font-normal text-yellow-600">
                ({movie.vote_count.toLocaleString()}명)
              </span>
            </span>
            <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
              📅 {movie.release_date || "개봉일 미정"}
            </span>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
              🌐 {movie.original_language.toUpperCase()}
            </span>
            {movie.adult && (
              <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700">
                🔞 성인
              </span>
            )}
          </div>

          <div className="mb-6">
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">
              줄거리
            </h3>
            <p className="text-sm leading-relaxed text-gray-700">
              {movie.overview || "줄거리 정보가 제공되지 않습니다."}
            </p>
          </div>

          <div className="flex gap-3">
            <a
              href={imdbSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-yellow-400 px-4 py-2.5 font-semibold text-black transition-colors hover:bg-yellow-500"
            >
              🎬 IMDb에서 검색하기
            </a>

            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 font-semibold text-gray-700 transition-colors hover:bg-gray-100"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieModal;
