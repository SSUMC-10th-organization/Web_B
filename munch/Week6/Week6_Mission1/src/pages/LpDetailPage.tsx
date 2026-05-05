import { useParams } from "react-router-dom";
import useGetLpDetail from "../hooks/queries/useGetLpDetail";
import { LoadingSpinner, ErrorFallback } from "../components/CommonStates";
import { formatTimeAgo } from "../utils/date";
import { useQuery } from "@tanstack/react-query";
import { getMyInfo } from "../apis/auth";

const LpDetailPage = () => {
  const { lpid } = useParams<{ lpid: string }>();
  const { data, isPending, isError, refetch } = useGetLpDetail(Number(lpid));

  const { data: myInfo } = useQuery({
    queryKey: ["myInfo"],
    queryFn: getMyInfo,
    select: (data) => data.data,
  });

  const isAuthor = myInfo?.id === data?.author?.id;

  if (isPending) return <LoadingSpinner />;
  if (isError) return <ErrorFallback onRetry={refetch} />;
  if (!data)
    return (
      <div className="text-center py-20 text-gray-400">
        데이터를 찾을 수 없습니다.
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto flex flex-col items-center bg-[#1a1a1a] p-10 rounded-2xl shadow-xl mt-6">
      <div className="w-full flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
            {data.author?.name?.[0] ?? "?"}
          </div>
          <span className="text-gray-200 font-medium text-sm">
            {data.author?.name ?? "알 수 없음"}
          </span>
        </div>
        <span className="text-gray-400 text-xs">
          {formatTimeAgo(data.createdAt)}
        </span>
      </div>

      <div className="w-full flex justify-between items-center mb-8">
        <h1 className="text-xl font-bold text-white">{data.title}</h1>
        {isAuthor && (
          <div className="flex gap-3 text-gray-400">
            <button
              type="button"
              className="hover:text-white transition-colors"
              aria-label="수정"
            >
              ✏️
            </button>
            <button
              type="button"
              className="hover:text-red-400 transition-colors"
              aria-label="삭제"
            >
              🗑️
            </button>
          </div>
        )}
      </div>

      <div className="relative w-72 h-72 rounded-full overflow-hidden shadow-2xl mb-10 animate-[spin_12s_linear_infinite]">
        <img
          src={data.thumbnail}
          alt={data.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 m-auto w-10 h-10 bg-[#1a1a1a] rounded-full border border-gray-600 pointer-events-none" />
      </div>

      <p className="text-gray-300 text-sm text-center leading-relaxed max-w-lg mb-8">
        {data.content}
      </p>

      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {data.tags?.map((tag) => (
          <span
            key={tag.id}
            className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-xs border border-gray-700"
          >
            #{tag.name}
          </span>
        ))}
      </div>

      <button
        type="button"
        className="flex items-center gap-2 text-[#e91e8c] hover:scale-110 transition-transform"
      >
        <span className="text-2xl">♥</span>
        <span className="font-semibold text-lg">{data.likes?.length || 0}</span>
      </button>
    </div>
  );
};

export default LpDetailPage;
