import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./layout/root-layout";

import HomePage from "./pages/home";
import Movies from "./pages/MoviesPage";
import MovieDetailPage from "./pages/movie-detail";
import NotFound from "./pages/not-found";

function App() {
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
			path: "/movie/:movieId",
			element: <MovieDetailPage />,
		},
	]);

	return <RouterProvider router={router} />;
}

export default App;
