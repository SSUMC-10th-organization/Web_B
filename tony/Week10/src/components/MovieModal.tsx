import { memo, useCallback, useEffect } from "react";
import { IMAGE_BASE, IMAGE_ORIGINAL } from "../apis/movie";
import type { Movie } from "../types/movie";

interface MovieModalProps {
	movie: Movie;
	onClose: () => void;
}

// memo: movie와 onClose 참조가 같으면 리렌더 안 함
const MovieModal = memo(function MovieModal({ movie, onClose }: MovieModalProps) {
	const posterUrl = movie.poster_path
		? `${IMAGE_BASE}${movie.poster_path}`
		: null;
	const backdropUrl = movie.backdrop_path
		? `${IMAGE_ORIGINAL}${movie.backdrop_path}`
		: null;

	// ESC 키로 모달 닫기
	const handleKeyDown = useCallback(
		(e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		},
		[onClose],
	);

	useEffect(() => {
		document.addEventListener("keydown", handleKeyDown);
		document.body.style.overflow = "hidden";
		return () => {
			document.removeEventListener("keydown", handleKeyDown);
			document.body.style.overflow = "";
		};
	}, [handleKeyDown]);

	const imdbUrl = `https://www.imdb.com/find?q=${encodeURIComponent(movie.title)}`;

	return (
		<div
			className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
			onClick={onClose}
		>
			{/* 모달 박스 */}
			<div
				className="bg-gray-900 rounded-2xl overflow-hidden w-full max-w-2xl max-h-[90vh] overflow-y-auto relative"
				onClick={(e) => e.stopPropagation()}
			>
				{/* 배경 이미지 */}
				{backdropUrl && (
					<div className="relative h-48 overflow-hidden">
						<img
							src={backdropUrl}
							alt=""
							className="w-full h-full object-cover"
						/>
						<div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900" />
					</div>
				)}

				<div className="p-6 flex gap-5">
					{/* 포스터 */}
					{posterUrl && (
						<img
							src={posterUrl}
							alt={movie.title}
							className="w-32 h-48 object-cover rounded-xl shrink-0 shadow-lg -mt-16 border-2 border-gray-700"
						/>
					)}

					<div className="flex flex-col gap-3 flex-1 min-w-0">
						{/* 제목 */}
						<h2 className="text-white text-xl font-bold leading-tight">
							{movie.title}
						</h2>

						{/* 메타 정보 */}
						<div className="flex flex-wrap gap-3 text-sm">
							<span className="text-yellow-400">
								⭐ {movie.vote_average.toFixed(1)}
								<span className="text-gray-400 ml-1">
									({movie.vote_count.toLocaleString()}명)
								</span>
							</span>
							{movie.release_date && (
								<span className="text-gray-300">
									📅 {movie.release_date}
								</span>
							)}
							{movie.adult && (
								<span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">
									성인
								</span>
							)}
						</div>

						{/* 언어 */}
						<p className="text-gray-400 text-xs">
							언어: {movie.original_language.toUpperCase()}
						</p>
					</div>
				</div>

				{/* 줄거리 */}
				{movie.overview && (
					<div className="px-6 pb-4">
						<h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">
							줄거리
						</h3>
						<p className="text-gray-300 text-sm leading-relaxed">
							{movie.overview}
						</p>
					</div>
				)}

				{/* 버튼 영역 */}
				<div className="px-6 pb-6 flex gap-3">
					<a
						href={imdbUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="flex-1 text-center py-2 bg-yellow-500 hover:bg-yellow-400 text-black text-sm font-bold rounded-xl transition-colors"
					>
						IMDb에서 검색하기
					</a>
					<button
						type="button"
						onClick={onClose}
						className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer"
					>
						닫기
					</button>
				</div>

				{/* 닫기 버튼 (우상단) */}
				<button
					type="button"
					onClick={onClose}
					className="absolute top-4 right-4 w-8 h-8 bg-black/50 hover:bg-black/80 text-white rounded-full flex items-center justify-center text-sm transition-colors cursor-pointer border-0"
				>
					✕
				</button>
			</div>
		</div>
	);
});

export default MovieModal;
