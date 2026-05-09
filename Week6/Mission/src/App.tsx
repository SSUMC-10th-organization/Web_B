import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { RootLayout } from "./Layout/root";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/Login";
import { NotFound } from "./pages/NotFound";
import { Signup } from "./pages/Signup";
import { MyPage } from "./pages/Mypage"
import { LpDetailPage } from "./pages/LpDetail";
import { GoogleCallback } from "./pages/googleCallback";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

export const queryClient = new QueryClient(); 
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
					{path:"mypage", element: <MyPage/>},
					{ 
                		path: "lp/:lpid",
                		element: <LpDetailPage /> 
            		},
					
				]
			}

		],
	},
	{ path: "*", element: <NotFound /> }, // 가장 마지막에 배치
]);
function App() {
	return(
	<QueryClientProvider client={queryClient}>
		<RouterProvider router={router} />
		<ReactQueryDevtools initialIsOpen={false} /> 
	</QueryClientProvider>
	);
}

export default App;
