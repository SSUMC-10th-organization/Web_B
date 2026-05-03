import { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { RootLayout } from "./Layout/root";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/Login";
import { NotFound } from "./pages/NotFound";
import { Signup } from "./pages/Signup";
import { MyPage } from "./pages/Mypage"
import { GoogleCallback } from "./pages/googleCallback";

const router = createBrowserRouter([
	{
		path: "/",
		element: <RootLayout />,
		children: [
			{
				index: true,
				element: <HomePage />,
			},
			{ path: "login", element: <LoginPage /> },
			{ path: "signup", element: <Signup /> },
			{
				path: "v1/auth/google/callback",
				element: <GoogleCallback />,
			},
			{
				element : <ProtectedRoute/>,
				children : [
					{path:"mypage", element: <MyPage/>}
				]
			}

		],
	},
	{ path: "*", element: <NotFound /> }, // 가장 마지막에 배치
]);
function App() {
	return <RouterProvider router={router} />;
}

export default App;
