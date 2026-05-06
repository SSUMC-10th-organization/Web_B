import { useNavigate, useParams } from "react-router-dom";
import useGetLpDetail from "../hooks/queries/useGetLpDetail";

export const LpDetailPage = () => {
  const { lpId } = useParams();
  const navigate = useNavigate();
  const { data: lp, isPending, isError } = useGetLpDetail(Number(lpId));

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-64 text-black/50 text-sm">
        Loading...
      </div>
    );
  }

  if (isError || !lp) {
    return (
      <div className="flex justify-center items-center h-64 text-black/50 text-sm">
        불러오는 중 오류가 발생했어요.
      </div>
    );
  }

  const createdAt = new Date(lp.createdAt).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      {/* 뒤로가기 */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-black/40 hover:text-black/80 transition-colors mb-8"
      >
        ← 뒤로가기
      </button>

      <div className="grid grid-cols-2 gap-10 items-start">
        {/* 썸네일 */}
        <div className="relative">
          <div className="aspect-square rounded-xl overflow-hidden bg-black/5">
            <img
              src={lp.thumbnail}
              alt={lp.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-2.5 -right-2.5 w-14 h-14 rounded-full border-2 border-black/5 pointer-events-none" />
          <div className="absolute -bottom-1 -right-1 w-10 h-10 rounded-full border border-black/[0.03] pointer-events-none" />
        </div>

        {/* 정보 */}
        <div className="flex flex-col gap-5 pt-1">
          {/* 제목 */}
          <div>
            <p className="text-[11px] text-black/30 tracking-widest uppercase mb-2">
              Album
            </p>
            <h1 className="text-4xl font-bold leading-tight tracking-wide text-black">
              {lp.title}
            </h1>
          </div>

          <div className="h-px bg-black/[0.08]" />

          {/* 좋아요 */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-pink-400/60 bg-pink-50 text-pink-500 text-sm">
              <span>♥</span>
              <span>{lp.likes.length}</span>
            </div>
            <span className="text-xs text-black/30">좋아요</span>
          </div>

          {/* 태그 */}
          {lp.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {lp.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="px-3 py-1 rounded-full text-xs bg-black/[0.06] text-black/55 border border-black/10"
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          )}

          <div className="h-px bg-black/[0.08]" />

          {/* 내용 */}
          <div>
            <p className="text-[11px] text-black/30 tracking-widest uppercase mb-2.5">
              About
            </p>
            <p className="text-sm text-black/60 leading-relaxed whitespace-pre-wrap">
              {lp.content}
            </p>
          </div>

          {/* 날짜 */}
          <p className="text-xs text-black/25">{createdAt}</p>
        </div>
      </div>
    </div>
  );
};
