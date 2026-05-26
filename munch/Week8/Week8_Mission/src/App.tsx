import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
	createBrowserRouter,
	Outlet,
	type RouteObject,
	RouterProvider,
} from "react-router-dom";
import "./App.css";
import { ToastProvider } from "./components/Toast";
import { AuthProvider } from "./context/AuthContext";
import HomeLayout from "./layout/HomeLayout";
import ProtectedLayout from "./layout/ProtectedLayout";
import { queryClient } from "./lib/queryClient";
import GoogleLoginRedirectPage from "./pages/GoogleLoginRedirectPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import LpDetailPage from "./pages/LpDetailPage";
import MyPage from "./pages/MyPage";
import NotFoundPage from "./pages/NotFoundPage";
import SearchPage from "./pages/SearchPage";
import SignupPage from "./pages/SignupPage";

const publicRoutes: RouteObject[] = [
	{
		path: "/",
		element: <HomeLayout />,
		errorElement: <NotFoundPage />,
		children: [
			{ index: true, element: <HomePage /> },
			{ path: "login", element: <LoginPage /> },
			{ path: "signup", element: <SignupPage /> },
			{ path: "search", element: <SearchPage /> },
			{ path: "v1/auth/google/callback", element: <GoogleLoginRedirectPage /> },
		],
	},
];

const protectedRoutes: RouteObject[] = [
	{
		path: "/",
		element: <ProtectedLayout />,
		errorElement: <NotFoundPage />,
		children: [
			{ path: "mypage", element: <MyPage /> },
			{ path: "lp/:lpid", element: <LpDetailPage /> },
		],
	},
];

const router = createBrowserRouter([
	{
		element: (
			<AuthProvider>
				<ToastProvider />
				<Outlet />
			</AuthProvider>
		),
		children: [...publicRoutes, ...protectedRoutes],
	},
]);

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={router} />
			{import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
		</QueryClientProvider>
	);
}

export default App;
