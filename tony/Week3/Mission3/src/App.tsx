import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./layout/root-layout";

//createBrowerRouter v6
import HomePage from "./pages/home";
import MovieDetailPage from "./pages/movie-detail";
import Movies from "./pages/movies";
import NotFound from "./pages/not-found";

const router = createBrowserRouter([
	{
		path: "/",
		element: <RootLayout />,
		errorElement: <NotFound />,
		children: [
			{ index: true, element: <HomePage /> },
			{ path: "movies/:category", element: <Movies /> },
		],
	},
	{
		path: "/movie/:movieId", // ← 밖으로
		element: <MovieDetailPage />,
	},
]);
function App() {
	return <RouterProvider router={router} />;
}

export default App;
