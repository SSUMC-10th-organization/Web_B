import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Movie, MovieResponse } from "../types/movie";

const MoviesPage = () => {
	const { category } = useParams<{ category: string }>(); // category 파라미터
	const navigate = useNavigate();
	const [movies, setMovies] = useState<Movie[]>([]);
	const [isPending, setIsPending] = useState(false);
	const [isError, setIsError] = useState(false);
	const [page, setPage] = useState(1);

	useEffect(() => {
		const fetchMovies = async () => {
			try {
				setIsPending(true);
				const { data } = await axios.get<MovieResponse>(
					`https://api.themoviedb.org/3/movie/${category}?language=ko-KR&page=${page}`, // category 동적으로
					{
						headers: {
							Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1Yzg4YWE4ZWViZjZlZWZiMTYxZTlkNTEwOTZlNzZkOCIsIm5iZiI6MTc3NDY4Mjk2Mi4xOTYsInN1YiI6IjY5Yzc4MzUyY2JiOTI2NjIwNWM4MGFhYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.yaUwYiA13Gas1ntvKmg8Nq_w_vwicWx-Lrqwpu1sW3k`,
						},
					},
				);
				setMovies(data.results);
			} catch {
				setIsError(true);
			} finally {
				setIsPending(false);
			}
		};
		fetchMovies();
	}, [category, page]); // category, page 둘 다 디펜던시 추가

	if (isPending)
		return (
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					height: "100vh",
					gap: "16px",
				}}
			>
				<div
					style={{
						width: "48px",
						height: "48px",
						border: "5px solid #e2e8f0",
						borderTop: "5px solid #6366f1",
						borderRadius: "50%",
						animation: "spin 1s linear infinite",
					}}
				/>
				<p style={{ color: "#6366f1", fontSize: "18px", fontWeight: "bold" }}>
					로딩 중...
				</p>
				<style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
			</div>
		);

	if (isError)
		return (
			<p style={{ textAlign: "center", color: "red", marginTop: "40px" }}>
				에러가 발생했습니다.
			</p>
		);

	const btnBase = {
		padding: "8px 20px",
		border: "none",
		borderRadius: "8px",
		fontWeight: "bold",
	} as const;

	return (
		<div>
			{/* 페이지 이동 버튼 */}
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					gap: "16px",
					padding: "24px",
				}}
			>
				<button
					type="button"
					onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
					disabled={page === 1}
					style={{
						...btnBase,
						backgroundColor: page === 1 ? "#e2e8f0" : "#6366f1",
						color: page === 1 ? "#94a3b8" : "white",
						cursor: page === 1 ? "not-allowed" : "pointer",
					}}
				>
					이전
				</button>
				<span style={{ fontWeight: "bold", fontSize: "16px" }}>
					{page} 페이지
				</span>
				<button
					type="button"
					onClick={() => setPage((prev) => prev + 1)}
					style={{
						...btnBase,
						backgroundColor: "#6366f1",
						color: "white",
						cursor: "pointer",
					}}
				>
					다음
				</button>
			</div>

			{/* 영화 목록 */}
			<ul className="grid grid-cols-5 gap-4 p-4">
				{movies?.map((movie) => (
					<div
						key={movie.id}
						onClick={() => navigate(`/movie/${movie.id}`)}
						style={{ cursor: "pointer" }}
					>
						<img
							src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
							alt={movie.title}
							className="w-full rounded-lg transition-all duration-300 group-hover:blur-sm"
						/>
					</div>
				))}
			</ul>
		</div>
	);
};

export default MoviesPage;
