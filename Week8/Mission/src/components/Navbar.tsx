import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Sidebar } from "./Sidebar";
import { useLogoutMutation } from "../hooks/mutations/useAuthMutation";
import { useSidebar } from "../hooks/useSidebar";

export const Navbar = () => {
	const { tokenA, nickname } = useAuth();
	const { mutate: logoutMutate, isPending } = useLogoutMutation();

	const { isOpen, toggle, close } = useSidebar();

	return (
		
		<nav className="relative z-[60] flex items-center justify-between px-8 py-4 bg-gray-900 text-white shadow-md">
			<div className="flex items-center gap-8">
				<button type="button" onClick={toggle}>
					<svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"role="img"aria-labelledby="menu-title">
    					<title id="menu-title">전체 메뉴 열기</title><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M7.95 11.95h32m-32 12h32m-32 12h32"/>
			 		</svg>
				</button>

				<Link
					to="/"
					className="text-3xl font-black text-purple-400 hover:text-purple-300 transition-colors"
				>
					돌려돌려LP판
				</Link>
			</div>

			<div className="flex items-center gap-4">
				{tokenA ? (
					<>
					<div>
						{nickname}님 환영합니다!
					</div>

					<button
						type="button"
						onClick={() => logoutMutate()}
						className="px-5 py-2 font-bold bg-gray-800 text-gray-300 rounded-xl hover:bg-gray-700 hover:text-white transition-all shadow-lg border border-gray-700"
					>
						로그아웃
					</button>
					</>
				) : (
					<>
						<Link
							to="/login"
							className="px-5 py-2 font-bold text-gray-300 hover:text-white transition-colors"
						>
							로그인
						</Link>

						<Link
							to="/signup"
							className="px-5 py-2 font-bold bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors shadow-lg"
						>
							회원가입
						</Link>
						
					</>
					
				)}
				<Sidebar 
                		isOpen={isOpen} 
                		onClose={close} 
            	/>
			</div>
		</nav>
		
	);
};