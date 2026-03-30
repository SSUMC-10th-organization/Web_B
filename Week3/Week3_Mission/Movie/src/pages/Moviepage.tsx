import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Loading from "../components/Loading";
import type { Movie, MovieResponse } from "../types/movies";

const MoviesPage = () => {
	// 주소창의 쿼리(?page=N)를 관리하는 훅
	const [searchParams, setSearchParams] = useSearchParams();
	const [isloading, setIsLoading] = useState(true);

	// 현재 페이지 번호 추출 (숫자로 변환, 기본값 1)
	const currentPage = Number(searchParams.get("page")) || 1;

	const [movies, setMovies] = useState<Movie[]>([]);

	useEffect(() => {
		const fetchMovies = async () => {
			setIsLoading(true);
			// API 주소: popular 엔드포인트 유지 + 동적 페이지 번호 적용
			try {
				const { data } = await axios.get<MovieResponse>(
					`https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=${currentPage}`,
					{
						headers: {
							Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmYTU2MDc3MThmZWQwZjFlYTI3NmZiNTc3NDVmZmRiNSIsIm5iZiI6MTc3NDc3NTI3OS4wNzgsInN1YiI6IjY5YzhlYmVmNTUwMjViZWFkYTAxZTVhNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.xUD0btJOl74kkYj-VJsIXeLFI8rnV-6yQTqluhxk4Uo`,
						},
					},
				);
				setMovies(data.results);
			} catch (error) {
				return <h1>에러가 발생했습니다.</h1>;
			} finally {
				setIsLoading(false);
			}
			window.scrollTo(0, 0); // 페이지 바뀔 때 상단으로 스크롤
		};

		fetchMovies();
	}, [currentPage]); // currentPage가 바뀔 때마다 데이터 다시 호출

	// 6. 페이지 변경 핸들러 (MoviesNowPage와 동일 로직)
	const handlePageChange = (step: number) => {
		const nextPage = currentPage + step;
		if (nextPage < 1) return;
		setSearchParams({ page: String(nextPage) });
	};

	if (isloading) return <Loading />;

	return (
		<div className="bg-white min-h-screen p-8">
			<div className="max-w-[1000px] mx-auto">
				<div className="grid grid-cols-6 gap-4">
					{movies.map((movie:Movie) => (
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
