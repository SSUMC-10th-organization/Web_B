import EndPage from "./pages/EndPage";
import HomePage from "./pages/HomePage";
import SecondPage from "./pages/SecondPage";
import { Link } from "./router/Link";
import { Route } from "./router/Route";
import { Routes } from "./router/Routes";

function App() {
  return (
    <>
      <nav style={{ display: "flex", gap: "10px" }}>
        <Link to="/">Home</Link>
        <Link to="/second">Second Page</Link>
        <Link to="/end">End Page</Link>
      </nav>
      <Routes>
        <Route path="/" component={HomePage} />
        <Route path="/second" component={SecondPage} />
        <Route path="/end" component={EndPage} />
      </Routes>
    </>
  );
}

export default App;
