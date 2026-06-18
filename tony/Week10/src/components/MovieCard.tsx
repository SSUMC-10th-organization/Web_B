import { memo } from "react";
import { IMAGE_BASE } from "../apis/movie";
import type { Movie } from "../types/movie";

interface MovieCardProps {
	movie: Movie;
	onClick: (movie: Movie) => void;
}

// memo: movie props와 onClick 참조가 바뀌지 않으면 리렌더 안 함
// onClick은 부모에서 useCallback으로 감싸야 이 memo가 효과를 발휘함
const MovieCard = memo(function MovieCard({ movie, onClick }: MovieCardProps) {
	const posterUrl = movie.poster_path
		? `${IMAGE_BASE}${movie.poster_path}`
		: null;

	return (
		<button
			type="button"
			onClick={() => onClick(movie)}
			className="relative rounded-xl overflow-hidden cursor-pointer bg-gray-800 aspect-[2/3] group transition-transform duration-200 hover:scale-[1.03] hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)] text-left w-full border-0 p-0"
		>
			{posterUrl ? (
				<img
					src={posterUrl}
					alt={movie.title}
					className="w-full h-full object-cover block"
				/>
			) : (
				<div className="w-full h-full flex items-center justify-center text-gray-500 text-xs p-2 text-center">
					포스터 없음
				</div>
			)}

			{/* hover 오버레이 */}
			<div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-3 gap-1">
				<p className="text-white text-sm font-bold line-clamp-2 leading-tight">
					{movie.title}
				</p>
				<p className="text-gray-300 text-xs">{movie.release_date?.slice(0, 4)}</p>
				<p className="text-yellow-400 text-xs">
					⭐ {movie.vote_average.toFixed(1)}
				</p>
			</div>

			{/* 기본 하단 정보 */}
			<div className="absolute bottom-0 left-0 right-0 px-2 py-2 bg-gradient-to-t from-black/80 to-transparent group-hover:hidden">
				<p className="text-white text-xs font-semibold truncate">{movie.title}</p>
			</div>
		</button>
	);
});

export default MovieCard;
