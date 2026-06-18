import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

// lazy: MovieSearchPage를 별도 chunk로 분리
// → 초기 로딩 시 이 페이지의 JS를 다운받지 않음 (코드 스플리팅)
const MovieSearchPage = lazy(() => import("./pages/MovieSearchPage"));

const queryClient = new QueryClient();

export default function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>
				{/* Suspense: lazy 컴포넌트가 로드되는 동안 fallback 표시 */}
				<Suspense
					fallback={
						<div className="min-h-screen bg-gray-950 flex items-center justify-center text-gray-400">
							로딩 중...
						</div>
					}
				>
					<Routes>
						<Route path="/" element={<MovieSearchPage />} />
						<Route path="/movies/:movieId" element={<MovieSearchPage />} />
					</Routes>
				</Suspense>
			</BrowserRouter>
		</QueryClientProvider>
	);
}
