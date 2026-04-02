import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "../components/Loading";
import type { MovieCreditsResponse, MovieDetails } from "../types/movies";

const MovieDetailPage = () => {
	const { movieId } = useParams<{ movieId: string }>(); // URL에서 ID 추출
	const [movie, setMovie] = useState<MovieDetails | null>(null);
	const [credits, setCredits] = useState<MovieCreditsResponse | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchDetailData = async () => {
			setIsLoading(true);
			try {
				// 성능 최적화: Promise.all을 사용하여 병렬 요청
				const [detailRes, creditsRes] = await Promise.all([
					axios.get<MovieDetails>(
						`https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`,
						{
							headers: {
								Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
							},
						},
					),
					axios.get<MovieCreditsResponse>(
						`https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR`,
						{
							headers: {
								Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
							},
						},
					),
				]);

				setMovie(detailRes.data);
				setCredits(creditsRes.data);
			} catch (error) {
				console.error("데이터 로딩 실패:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchDetailData();
	}, [movieId]);

	if (isLoading) return <Loading />;
	if (!movie || !credits) return <div>데이터가 없습니다.</div>;

	return (
		<div className="min-h-screen bg-black text-white pb-20">
			{/* 상단 히로 섹션: Backdrop 이미지 활용 */}
			<div
				className="relative h-[500px] w-full bg-cover bg-center"
				style={{
					backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
				}}
			>
				<div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent flex flex-col justify-center px-[10%]">
					<h1 className="text-5xl font-black mb-4">{movie.title}</h1>
					<p className="text-lg text-gray-300 mb-6 font-bold">
						평균 {movie.vote_average.toFixed(1)} ·{" "}
						{movie.release_date.split("-")[0]} · {movie.runtime}분
					</p>
					<p className="max-w-2xl text-gray-200 leading-relaxed">
						{movie.overview}
					</p>
				</div>
			</div>

			{/* 하단 출연진 섹션: 가로 그리드 */}
			<div className="max-w-[1200px] mx-auto mt-12 px-[5%]">
				<h2 className="text-3xl font-bold mb-10">감독/출연</h2>
				<div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-10 gap-6">
					{credits.cast.slice(0, 10).map((member) => (
						<div key={member.id} className="flex flex-col items-center">
							<img
								src={
									member.profile_path
										? `https://image.tmdb.org/t/p/w200${member.profile_path}`
										: "기본이미지"
								}
								className="w-20 h-20 rounded-full object-cover mb-2 border-2 border-gray-800"
								alt={member.name}
							/>
							<span className="text-xs font-bold text-center truncate w-full">
								{member.name}
							</span>
							<span className="text-[10px] text-gray-500 text-center truncate w-full">
								{member.character}
							</span>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default MovieDetailPage;
