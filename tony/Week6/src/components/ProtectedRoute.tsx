import { Navigate, Outlet, useLocation } from "react-router-dom";
import { tokenStorage } from "../lib/tokenStorage";

export default function ProtectedRoute() {
	const location = useLocation();
	const isLoggedIn = !!tokenStorage.getAccessToken();

	if (!isLoggedIn) {
		return <Navigate to="/login" state={{ from: location }} replace />;
	}

	return <Outlet />;
}
