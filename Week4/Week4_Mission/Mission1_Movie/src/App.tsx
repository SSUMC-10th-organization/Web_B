import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./layout/root-layout";
import HomePage from "./pages/Homepage";
import MovieDetailPage from "./pages/MovieDetailPage";
import MoviesPage from "./pages/Moviepage";

const NotFound = () => (
	<main style={{ padding: 24 }}>
		<h1>페이지를 찾을 수 없어요 (404)</h1>
		<p>주소를 다시 확인하거나 홈으로 이동해 주세요.</p>
		<a href="/">홈으로</a>
	</main>
);
// 2. 경로(path)와 보여줄 화면(element)를 정의
const router = createBrowserRouter([
	{
		path: "/",
		element: <RootLayout />,
		children: [
			{
				index: true,
				element: <HomePage />,
			},
			{ path: "movies", element: <MoviesPage pagecg="popular" /> },
			{ path: "movies/:movieId", element: <MovieDetailPage /> },
			{ path: "now", element: <MoviesPage pagecg="now_playing" /> },
			{ path: "now/:movieId", element: <MovieDetailPage /> },
		],
	},
	{ path: "*", element: <NotFound /> }, // 가장 마지막에 배치
]);

// 3. RouterProvider로 router 전달
function App() {
	return <RouterProvider router={router} />;
}

export default App;
