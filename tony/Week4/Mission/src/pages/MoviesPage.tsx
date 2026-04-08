import { useNavigate, useParams } from "react-router-dom";
import type { MovieResponse } from "../types/movie";
import useFetch from "../hooks/useFetch";
import { useState } from "react";
// 스타일 변수
const styles = {
	spinner: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		height: "100vh",
		gap: "16px",
	},
	spinnerCircle: {
		width: "48px",
		height: "48px",
		border: "5px solid #e2e8f0",
		borderTop: "5px solid #6366f1",
		borderRadius: "50%",
		animation: "spin 1s linear infinite",
	},
	spinnerText: {
		color: "#6366f1",
		fontSize: "18px",
		fontWeight: "bold",
	},
	pagination: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		gap: "16px",
		padding: "24px",
	},
	pageText: {
		fontWeight: "bold",
		fontSize: "16px",
	},
	btnBase: {
		padding: "8px 20px",
		border: "none",
		borderRadius: "8px",
		fontWeight: "bold",
		cursor: "pointer",
	},
} as const;

// 버튼 스타일 (page 상태에 따라 달라지는 것만 함수로)
const prevBtnStyle = (isFirst: boolean) => ({
	...styles.btnBase,
	backgroundColor: isFirst ? "#e2e8f0" : "#6366f1",
	color: isFirst ? "#94a3b8" : "white",
	cursor: isFirst ? "not-allowed" : "pointer",
});

const nextBtnStyle = {
	...styles.btnBase,
	backgroundColor: "#6366f1",
	color: "white",
};



const MoviesPage = () => {
	
	const navigate = useNavigate();
	const [page, setPage] = useState(1); //현재 페이지
	const { category } = useParams<{ category: string }>(); //category 파라메터를 꺼내온다.
	const { data, isPending, isError } = useFetch<MovieResponse>(
    	`https://api.themoviedb.org/3/movie/${category}?language=ko-KR&page=${page}`
	);

	if (isPending)
		return (
			<div style={styles.spinner}>
				<div style={styles.spinnerCircle} />
				<p style={styles.spinnerText}>로딩 중...</p>
				<style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
			</div>
		);

	if (isError)
		return (
			<p style={{ textAlign: "center", color: "red", marginTop: "40px" }}>
				에러가 발생했습니다.
			</p>
		);

	return (
		<div>
			{/* 페이지 이동 버튼 */}
			<div style={styles.pagination}>
				<button
					type="button"
					onClick={() => setPage((prev) => prev - 1)}
					disabled={page === 1}
					style={prevBtnStyle(page === 1)}
				>
					이전
				</button>
				<span style={styles.pageText}>{page} 페이지</span>
				<button
					type="button"
					onClick={() => setPage((prev) => prev + 1)}
					disabled={page === data?.total_pages}
					style={nextBtnStyle}
				>
					다음
				</button>
			</div>

			{/* 영화 목록 */}
			<ul className="grid grid-cols-5 gap-4 p-4">
				{data?.results.map((movie) => ( //useState로 movies를 가져옴 map은 이걸 하나하나 객체를 반환함.(movie로 반환함)(커스텀훅완료)
					<div
						key={movie.id} //고유 아이디 부여 (내부 성능 최적화에 쓰임)
						onClick={() => navigate(`/movie/${movie.id}`)}
						style={{ cursor: "pointer" }}
					>
						<img
							src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
							alt={movie.title}
							className="w-full rounded-lg"
						/>
					</div>
				))}
			</ul>
		</div>
	);
};

export default MoviesPage;