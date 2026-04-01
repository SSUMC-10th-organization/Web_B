import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { MovieDetail } from "../types/movie";

const TOKEN =
	"Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1Yzg4YWE4ZWViZjZlZWZiMTYxZTlkNTEwOTZlNzZkOCIsIm5iZiI6MTc3NDY4Mjk2Mi4xOTYsInN1YiI6IjY5Yzc4MzUyY2JiOTI2NjIwNWM4MGFhYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.yaUwYiA13Gas1ntvKmg8Nq_w_vwicWx-Lrqwpu1sW3k";

const MovieDetailPage = () => {
	const { movieId } = useParams<{ movieId: string }>();
	const [movie, setMovie] = useState<MovieDetail | null>(null);
	const [isPending, setIsPending] = useState(false);
	const [isError, setIsError] = useState(false);

	useEffect(() => {
		const fetchDetail = async () => {
			try {
				setIsPending(true);
				const { data } = await axios.get<MovieDetail>(
					`https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`,
					{ headers: { Authorization: TOKEN } },
				);
				setMovie(data);
			} catch {
				setIsError(true);
			} finally {
				setIsPending(false);
			}
		};
		fetchDetail();
	}, [movieId]);

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

	if (isError || !movie)
		return (
			<p style={{ textAlign: "center", color: "red", marginTop: "40px" }}>
				에러가 발생했습니다.
			</p>
		);

	return (
		<div style={{ maxWidth: "900px", margin: "40px auto", padding: "0 24px" }}>
			{/* 배경 + 포스터 */}
			<div style={{ display: "flex", gap: "32px", alignItems: "flex-start" }}>
				<img
					src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
					alt={movie.title}
					style={{ borderRadius: "12px", flexShrink: 0 }}
				/>

				{/* 기본 정보 */}
				<div>
					<h1
						style={{
							fontSize: "28px",
							fontWeight: "bold",
							marginBottom: "8px",
						}}
					>
						{movie.title}
					</h1>
					<p
						style={{
							color: "#6b7280",
							fontStyle: "italic",
							marginBottom: "16px",
						}}
					>
						{movie.tagline}
					</p>

					{/* 장르 */}
					<div
						style={{
							display: "flex",
							gap: "8px",
							flexWrap: "wrap",
							marginBottom: "16px",
						}}
					>
						{movie.genres.map((genre) => (
							<span
								key={genre.id}
								style={{
									backgroundColor: "#6366f1",
									color: "white",
									padding: "4px 10px",
									borderRadius: "999px",
									fontSize: "13px",
								}}
							>
								{genre.name}
							</span>
						))}
					</div>

					{/* 세부 정보 */}
					<p style={{ marginBottom: "8px" }}>
						⭐ {movie.vote_average.toFixed(1)} (
						{movie.vote_count.toLocaleString()}명)
					</p>
					<p style={{ marginBottom: "8px" }}>🎬 {movie.runtime}분</p>
					<p style={{ marginBottom: "8px" }}>📅 {movie.release_date}</p>
					<p style={{ marginBottom: "8px" }}>
						💰 제작비: ${movie.budget.toLocaleString()}
					</p>
					<p style={{ marginBottom: "16px" }}>
						💵 수익: ${movie.revenue.toLocaleString()}
					</p>

					{/* 줄거리 */}
					<h2 style={{ fontWeight: "bold", marginBottom: "8px" }}>줄거리</h2>
					<p style={{ lineHeight: "1.7", color: "#374151" }}>
						{movie.overview}
					</p>
				</div>
			</div>

			{/* 제작사 */}
			<div style={{ marginTop: "32px" }}>
				<h2 style={{ fontWeight: "bold", marginBottom: "12px" }}>제작사</h2>
				<div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
					{movie.production_companies.map((company) => (
						<span
							key={company.id}
							style={{
								backgroundColor: "#f3f4f6",
								padding: "6px 12px",
								borderRadius: "8px",
								fontSize: "13px",
							}}
						>
							{company.name}
						</span>
					))}
				</div>
			</div>
		</div>
	);
};

export default MovieDetailPage;
