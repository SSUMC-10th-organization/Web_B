import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import GoogleCallbackPage from "./pages/GoogleCallbackPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import PremiumPage from "./pages/PremiumPage";
import SignupPage from "./pages/SignupPage";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/login" element={<LoginPage />} />
				<Route path="/signup" element={<SignupPage />} />
				<Route
					path="/v1/auth/google/callback"
					element={<GoogleCallbackPage />}
				/>

				<Route element={<ProtectedRoute />}>
					<Route path="/" element={<HomePage />} />
					<Route path="/premium" element={<PremiumPage />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
