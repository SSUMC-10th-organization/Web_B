import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
//import Movies from './pages/movies';
import RootLayout from "./layout/root-layout";
import HomePage from "./pages/home";
import MovieDetailPage from "./pages/MovieDetailPage";
import MoviesPage from "./pages/MoviesPage";
import NotFound from "./pages/not-found";
import PlayingPage from "./pages/PlayingPage";
import RatePage from "./pages/RatePage";
import UpcomingPage from "./pages/UpcomingPage";

const router = createBrowserRouter([
	{
		path: "/",
		element: <RootLayout />,
		errorElement: <NotFound />,
		children: [
			{
				index: true,
				element: <HomePage />,
			},
			{
				path: "popular/",
				element: <MoviesPage />,
			},
			{
				path: "playing/",
				element: <PlayingPage />,
			},
			{
				path: "rate/",
				element: <RatePage />,
			},
			{
				path: "upcoming/",
				element: <UpcomingPage />,
			},
			{
				path: "movies/:movieId",
				element: <MovieDetailPage />,
			},
		],
	},
]);

function App() {
	return <RouterProvider router={router} />;
}

export default App;
