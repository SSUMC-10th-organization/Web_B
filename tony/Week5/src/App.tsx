import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import GoogleCallbackPage from "./pages/GoogleCallbackPage";
import HomePage from "./pages/HomePage";
import PremiumPage from "./pages/PremiumPage";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/login" element={<LoginPage />} />
				<Route path="/signup" element={<SignupPage />} />
				<Route path="/v1/auth/google/callback" element={<GoogleCallbackPage />} />

				<Route element={<ProtectedRoute />}>
					<Route path="/" element={<HomePage />} />
					<Route path="/premium" element={<PremiumPage />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
