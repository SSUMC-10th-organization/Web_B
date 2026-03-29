import './App.css'
import MoviesPage from './pages/Moviepage'

// 1. React Router에서 필요한 함수/컴포넌트를 import
import { createBrowserRouter, RouterProvider } from "react-router-dom";
const NotFound = () => (
  <main style={{ padding: 24 }}>
    <h1>페이지를 찾을 수 없어요 (404)</h1>
    <p>주소를 다시 확인하거나 홈으로 이동해 주세요.</p>
    <a href="/">홈으로</a>
  </main>
);
// 2. 경로(path)와 보여줄 화면(element)를 정의
const router = createBrowserRouter([
  { path: '/', element: <h1>홈 페이지입니다.</h1> },
  { path: '/movies', element: <MoviesPage /> },
  { path: '*', element: <NotFound /> }, // 가장 마지막에 배치
]);

// 3. RouterProvider로 router 전달
function App() {
  return <RouterProvider router={router} />
}

export default App;



