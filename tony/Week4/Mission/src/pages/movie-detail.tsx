import { useParams } from "react-router-dom";
import type { MovieDetail } from "../types/movie";
import useFetch from "../hooks/useFetch";

const styles = {
	page: {
		maxWidth: "900px",
		margin: "40px auto",
		padding: "0 24px",
	},
	topSection: {
		display: "flex",
		gap: "32px",
		alignItems: "flex-start",
	},
	poster: {
		borderRadius: "12px",
		flexShrink: 0,
	},
	title: {
		fontSize: "28px",
		fontWeight: "bold",
		marginBottom: "8px",
	},
	tagline: {
		color: "#6b7280",
		fontStyle: "italic",
		marginBottom: "16px",
	},
	genreList: {
		display: "flex",
		gap: "8px",
		flexWrap: "wrap" as const,
		marginBottom: "16px",
	},
	genreTag: {
		backgroundColor: "#6366f1",
		color: "white",
		padding: "4px 10px",
		borderRadius: "999px",
		fontSize: "13px",
	},
	infoText: {
		marginBottom: "8px",
	},
	overviewTitle: {
		fontWeight: "bold",
		marginBottom: "8px",
	},
	overviewText: {
		lineHeight: "1.7",
		color: "#374151",
	},
	productionSection: {
		marginTop: "32px",
	},
	productionTitle: {
		fontWeight: "bold",
		marginBottom: "12px",
	},
	productionList: {
		display: "flex",
		gap: "16px",
		flexWrap: "wrap" as const,
	},
	companyTag: {
		backgroundColor: "#f3f4f6",
		padding: "6px 12px",
		borderRadius: "8px",
		fontSize: "13px",
	},
	loadingWrapper: {
		display: "flex",
		flexDirection: "column" as const,
		alignItems: "center",
		justifyContent: "center",
		height: "100vh",
		gap: "16px",
	},
	spinner: {
		width: "48px",
		height: "48px",
		border: "5px solid #e2e8f0",
		borderTop: "5px solid #6366f1",
		borderRadius: "50%",
		animation: "spin 1s linear infinite",
	},
	loadingText: {
		color: "#6366f1",
		fontSize: "18px",
		fontWeight: "bold",
	},
	errorText: {
		textAlign: "center" as const,
		color: "red",
		marginTop: "40px",
	},
} as const;

const MovieDetailPage = () => {
    const { movieId } = useParams<{ movieId: string }>();
    const { data: movie, isPending, isError } = useFetch<MovieDetail>(
        `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`
    );

    if (isPending) return (
        <div style={styles.loadingWrapper}>
            <div style={styles.spinner} />
            <p style={styles.loadingText}>로딩 중...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );

    if (isError || !movie)
        return <p style={styles.errorText}>에러가 발생했습니다.</p>;

	return (
		<div style={styles.page}>
			<div style={styles.topSection}>
				<img
					src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
					alt={movie.title}
					style={styles.poster}
				/>
				<div>
					<h1 style={styles.title}>{movie.title}</h1>
					<p style={styles.tagline}>{movie.tagline}</p>

					<div style={styles.genreList}>
						{movie.genres.map((genre) => (
							<span key={genre.id} style={styles.genreTag}>
								{genre.name}
							</span>
						))}
					</div>

					<p style={styles.infoText}>
						⭐ {movie.vote_average.toFixed(1)} ({movie.vote_count.toLocaleString()}명)
					</p>
					<p style={styles.infoText}>🎬 {movie.runtime}분</p>
					<p style={styles.infoText}>📅 {movie.release_date}</p>
					<p style={styles.infoText}>💰 제작비: ${movie.budget.toLocaleString()}</p>
					<p style={styles.infoText}>💵 수익: ${movie.revenue.toLocaleString()}</p>

					<h2 style={styles.overviewTitle}>줄거리</h2>
					<p style={styles.overviewText}>{movie.overview}</p>
				</div>
			</div>

			<div style={styles.productionSection}>
				<h2 style={styles.productionTitle}>제작사</h2>
				<div style={styles.productionList}>
					{movie.production_companies.map((company) => (
						<span key={company.id} style={styles.companyTag}>
							{company.name}
						</span>
					))}
				</div>
			</div>
		</div>
	);
};

export default MovieDetailPage;