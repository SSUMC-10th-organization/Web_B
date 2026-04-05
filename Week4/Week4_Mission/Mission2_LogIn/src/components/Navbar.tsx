import { Link, Outlet } from "react-router-dom";

export const Navbar = () => {
    return (
        // 전체 화면을 채우는 flex 컨테이너 (네비게이션바 + 하단 내용)
        <div className="flex flex-col min-h-screen">
            
            {/* 최상단 네비게이션 바 */}
            <nav className="flex items-center justify-between px-8 py-4 bg-gray-900 text-white shadow-md">
                
                {/* 왼쪽: 제목 (클릭 시 메인으로 이동) */}
                <Link to="/" className="text-3xl font-black text-purple-400 hover:text-purple-300 transition-colors">
                    JungBin
                </Link>

                {/* 오른쪽: 로그인 / 회원가입 버튼 */}
                <div className="flex items-center gap-4">
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
                </div>
            </nav>

            {/* 하단 영역: 자식 라우터 컴포넌트들이 렌더링될 위치 */}
            <main className="flex-1 bg-black">
                <Outlet />
            </main>
            
        </div>
    );
};