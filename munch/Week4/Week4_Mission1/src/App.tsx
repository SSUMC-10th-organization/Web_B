import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import MoviePage from "./pages/MoviePage";
import Layout from "./components/Layout";
import NonePage from "./pages/NonePage";
import MovieDetailPage from "./pages/MovieDetailPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<NonePage />} />
          <Route path="/popular" element={<MoviePage endpoint="popular" />} />
          <Route path="/nPlaying" element={<NonePage />} />
          <Route path="/topRate" element={<NonePage />} />
          <Route path="/upcoming" element={<NonePage />} />
          <Route path="/movie/:movieId" element={<MovieDetailPage />} />
          <Route path="*" element={<Navigate to="/popular" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
