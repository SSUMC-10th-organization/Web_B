import { Link } from './Link';
import { Routes } from './Router';
import { Route } from './Route';

// 임시 페이지 컴포넌트들
const MatthewPage = () => <h1>매튜 페이지 🐶</h1>;
const AeongPage = () => <h1>애옹 페이지 🐱</h1>;
const JoyPage = () => <h1>조이 페이지 🐹</h1>;
const MainPage = () => <h1>메인 페이지 🏠</h1>;

function App() {
  return (
    <div style={{ padding: '20px' }}>
      <nav style={{ display: 'flex', gap: '20px', marginBottom: '30px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
        <Link to="/">메인</Link>
        <Link to="/matthew">매튜</Link>
        <Link to="/aeong">애옹</Link>
        <Link to="/joy">조이</Link>
      </nav>

      <Routes>
        <Route path="/" component={MainPage} />
        <Route path="/matthew" component={MatthewPage} />
        <Route path="/aeong" component={AeongPage} />
        <Route path="/joy" component={JoyPage} />
      </Routes>
    </div>
  );
}

export default App;