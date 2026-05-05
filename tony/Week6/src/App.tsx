import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./layout/MainLayout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import LpDetailPage from "./pages/LpDetailPage";
import SignupPage from "./pages/SignupPage";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60 * 5,
			gcTime: 1000 * 60 * 6,
		},
		mutations: {
			retry: false,
		},
	},
});

const App = () => {
	return (
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>
				<Routes>
					{/* 레이아웃 + 보호 라우트 */}
					<Route element={<MainLayout />}>
						<Route element={<ProtectedRoute />}>
							<Route path="/" element={<HomePage />} />
						</Route>
						<Route path="/lp/:lpId" element={<LpDetailPage />} />
					</Route>

					{/* 인증 페이지 */}
					<Route path="/login" element={<LoginPage />} />
					<Route path="/signup" element={<SignupPage />} />
				</Routes>
			</BrowserRouter>
			{import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
		</QueryClientProvider>
	);
};

export default App;
