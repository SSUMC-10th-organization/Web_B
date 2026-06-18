import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import { searchMovies } from "../apis/movie";
import MovieCard from "../components/MovieCard";
import MovieModal from "../components/MovieModal";
import SearchForm from "../components/SearchForm";
import useDebounce from "../hooks/useDebounce";
import type { Movie, SearchParams } from "../types/movie";

export default function MovieSearchPage() {
	const [params, setParams] = useState<SearchParams>({
		query: "",
		includeAdult: false,
		language: "ko-KR",
	});

	// 검색 제출 시 실제로 API에 쓸 확정된 params
	const [submittedParams, setSubmittedParams] = useState<SearchParams>(params);

	const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

	// debounce: 입력 중 불필요한 API 호출 방지
	const debouncedQuery = useDebounce(submittedParams.query, 300);

	const { data, isLoading, isError } = useQuery({
		queryKey: ["movies", debouncedQuery, submittedParams.language, submittedParams.includeAdult],
		queryFn: () =>
			searchMovies(
				debouncedQuery,
				submittedParams.language,
				submittedParams.includeAdult,
			),
		enabled: debouncedQuery.trim().length > 0,
		staleTime: 1000 * 60 * 5,
	});

	// useMemo: data가 바뀔 때만 배열을 새로 만듦
	// → MovieCard에 넘기는 배열 참조가 안정화됨
	const movies = useMemo(() => data?.results ?? [], [data]);

	// useMemo: 영화 개수와 총 결과 수를 계산 (data 바뀔 때만 재계산)
	const resultSummary = useMemo(
		() => ({
			count: movies.length,
			total: data?.total_results ?? 0,
		}),
		[movies, data],
	);

	// useCallback: SearchForm에 넘기는 onChange가 매번 새 참조가 되지 않도록
	const handleParamsChange = useCallback((next: SearchParams) => {
		setParams(next);
	}, []);

	// useCallback: 검색 제출 핸들러
	const handleSubmit = useCallback(() => {
		setSubmittedParams(params);
	}, [params]);

	// useCallback: 카드 클릭 핸들러
	// MovieCard의 memo가 효과를 내려면 이 함수 참조가 안정적이어야 함
	const handleCardClick = useCallback((movie: Movie) => {
		setSelectedMovie(movie);
	}, []);

	// useCallback: 모달 닫기 핸들러
	const handleModalClose = useCallback(() => {
		setSelectedMovie(null);
	}, []);

	return (
		<div className="min-h-screen bg-gray-950 text-white">
			<div className="max-w-5xl mx-auto px-4 py-10">
				<h1 className="text-3xl font-bold text-center mb-8 text-white">
					🎬 영화 검색
				</h1>

				{/* SearchForm: memo + useCallback으로 불필요한 리렌더 방지 */}
				<SearchForm
					params={params}
					onChange={handleParamsChange}
					onSubmit={handleSubmit}
				/>

				{/* 결과 헤더 */}
				{debouncedQuery && !isLoading && !isError && (
					<p className="text-gray-400 text-sm mb-4">
						"{debouncedQuery}" 검색 결과{" "}
						<span className="text-white font-semibold">
							{resultSummary.total.toLocaleString()}건
						</span>{" "}
						중 {resultSummary.count}개 표시
					</p>
				)}

				{/* 로딩 */}
				{isLoading && (
					<div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-4">
						{Array.from({ length: 10 }).map((_, i) => (
							<div
								// biome-ignore lint/suspicious/noArrayIndexKey: 스켈레톤
								key={i}
								className="aspect-[2/3] rounded-xl bg-gray-800 animate-pulse"
							/>
						))}
					</div>
				)}

				{/* 에러 */}
				{isError && (
					<p className="text-center text-red-400 py-12">
						검색 중 오류가 발생했습니다. API 키를 확인해주세요.
					</p>
				)}

				{/* 결과 없음 */}
				{!isLoading && debouncedQuery && movies.length === 0 && (
					<p className="text-center text-gray-500 py-12">
						"{debouncedQuery}"에 대한 검색 결과가 없습니다.
					</p>
				)}

				{/* 초기 상태 */}
				{!debouncedQuery && (
					<p className="text-center text-gray-600 py-12">
						영화 제목을 입력하고 검색해보세요.
					</p>
				)}

				{/* 영화 카드 그리드: memo 덕에 selectedMovie 변경 시 카드들은 리렌더 안 함 */}
				{!isLoading && movies.length > 0 && (
					<div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-4">
						{movies.map((movie) => (
							<MovieCard
								key={movie.id}
								movie={movie}
								onClick={handleCardClick}
							/>
						))}
					</div>
				)}
			</div>

			{/* 모달: 카드 클릭 시에만 렌더됨 */}
			{selectedMovie && (
				<MovieModal movie={selectedMovie} onClose={handleModalClose} />
			)}
		</div>
	);
}
