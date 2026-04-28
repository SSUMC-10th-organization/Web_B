import { Link, useSearchParams } from "react-router-dom";
import Loading from "../components/Loading";
import { useCustomFetch } from "../hooks/useCustomFetch";
import type { Movie, MovieResponse } from "../types/movies";

const MoviesPage = ({ pagecg }: { pagecg: string }) => {
	// 주소창의 쿼리(?page=N)를 관리하는 훅
	const [searchParams, setSearchParams] = useSearchParams();
	// 현재 페이지 번호 추출 (숫자로 변환, 기본값 1)
	const currentPage = Number(searchParams.get("page")) || 1;

	const { movies, isloading, iserror } = useCustomFetch(
		`https://api.themoviedb.org/3/movie/${pagecg}?language=ko-KR&page=${currentPage}`,
	);

	// 6. 페이지 변경 핸들러 (MoviesNowPage와 동일 로직)
	const handlePageChange = (step: number) => {
		const nextPage = currentPage + step;
		if (nextPage < 1) return;
		setSearchParams({ page: String(nextPage) });
	};

	if (isloading) return <Loading />;
	if (iserror) return <h1>에러가 발생했습니다. 다시 시도해주세요.</h1>;

	return (
		<div className="bg-white min-h-screen p-8">
			<div className="max-w-[1000px] mx-auto">
				<div className="grid grid-cols-6 gap-4">
					{movies.map((movie: Movie) => (
						<Link
							key={movie.id}
							to={`/movies/${movie.id}`}
							className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-gray-900 group cursor-pointer"
						>
							<img
								src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
								alt={movie.title}
								className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
							/>
							<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
						</Link>
					))}
				</div>

				<div className="flex justify-center items-center gap-12 mt-16 mb-10">
					<button
						type="button"
						onClick={() => handlePageChange(-1)}
						disabled={currentPage === 1}
						className="px-8 py-3 bg-purple-200 text-purple-900 font-bold rounded-2xl 
                       hover:bg-purple-300 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-md"
					>
						이전 페이지
					</button>

					<span className="text-gray-900 font-black text-xl">
						{currentPage} Page
					</span>

					<button
						type="button"
						onClick={() => handlePageChange(1)}
						className="px-8 py-3 bg-purple-200 text-purple-900 font-bold rounded-2xl 
                       hover:bg-purple-300 transition-all shadow-md"
					>
						다음 페이지
					</button>
				</div>
			</div>
		</div>
	);
};

export default MoviesPage;
