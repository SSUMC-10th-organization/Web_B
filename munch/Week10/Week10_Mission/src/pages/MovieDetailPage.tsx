import { useParams } from "react-router-dom";

export default function MovieDetailPage() {
  const { movieId } = useParams<{ movieId: string }>();

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800">
          영화 상세페이지입니다.
        </h1>
        <h1 className="mt-4 text-xl text-gray-600">
          {movieId}번 영화 상세 페이지를 패칭해옵니다.
        </h1>
      </div>
    </div>
  );
}
