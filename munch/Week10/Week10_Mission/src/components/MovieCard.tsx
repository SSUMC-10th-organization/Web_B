import { memo } from "react";
import type { Movie } from "../types/movie";

interface MovieCardProps {
  movie: Movie;
  onClick: (movie: Movie) => void;
}

const MovieCard = ({ movie, onClick }: MovieCardProps) => {
  const imageBaseUrl = "https://image.tmdb.org/t/p/w500";
  const fallbackImage = "https://via.placeholder.com/500x750?text=No+Image";

  return (
    <div
      className="cursor-pointer overflow-hidden rounded-lg bg-white shadow-md transition-all hover:shadow-xl hover:-translate-y-1"
      onClick={() => onClick(movie)}
    >
      <div className="relative h-80 overflow-hidden">
        <img
          src={
            movie.poster_path
              ? `${imageBaseUrl}${movie.poster_path}`
              : fallbackImage
          }
          alt={`${movie.title} 포스터`}
          className="h-full w-full object-cover transition-transform duration-300 ease-in-out hover:scale-105"
        />
        <div className="absolute right-2 top-2 rounded-md bg-black/70 px-2 py-1 text-sm font-bold text-yellow-400">
          ⭐ {movie.vote_average.toFixed(1)}
        </div>
      </div>

      <div className="p-4">
        <h3 className="mb-2 text-lg font-bold text-gray-800 line-clamp-1">
          {movie.title}
        </h3>
        <p className="text-sm text-gray-500">
          {movie.release_date} | {movie.original_language.toUpperCase()}
        </p>
        <p className="mt-2 text-sm text-gray-600 line-clamp-3">
          {movie.overview || "줄거리 정보가 없습니다."}
        </p>
      </div>
    </div>
  );
};

export default memo(MovieCard);
