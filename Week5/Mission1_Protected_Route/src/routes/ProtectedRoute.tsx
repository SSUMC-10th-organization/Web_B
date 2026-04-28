import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const ProtectedRoute = () => {
	const { tokenA } = useAuth();
	const location = useLocation();

	if (!tokenA) {
		return (
			<Navigate
				to="/login"
				replace
				state={{ from: location.pathname }}
			/>
		);
	}

	return <Outlet />;
};