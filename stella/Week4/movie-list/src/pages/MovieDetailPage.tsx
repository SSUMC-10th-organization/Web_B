import { useParams } from "react-router-dom";
import { LoadingSpinner } from "../components/LoadingSpinner";
import type { Credits, MovieDetail } from "../types/movieDetail";
import useCustomFetch from "../hooks/useCustomFetch";

const MovieDetailPage = () => {
  const { movieId } = useParams<{ movieId: string }>();

  const {
    data: movie,
    isPending: isMoviePending,
    isError: isMovieError,
  } = useCustomFetch<MovieDetail>(
    `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`,
  );

  const {
    data: credits,
    isPending: isCreditsPending,
    isError: isCreditsError,
  } = useCustomFetch<Credits>(
    `https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR`,
  );

  const isPending = isMoviePending || isCreditsPending;
  const isError = isMovieError || isCreditsError;

  if (isError) {
    return (
      <div>
        <span className="text-red-500 text-2xl">에러가 발생했습니다.</span>
      </div>
    );
  }

  if (isPending) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-[#141414] text-white">
      {/* 히어로 섹션 */}
      <div className="relative w-full h-[420px] overflow-hidden">
        {/* 배경 backdrop */}
        <img
          src={`https://image.tmdb.org/t/p/w1280${movie?.backdrop_path}`}
          alt="backdrop"
          className="w-full h-full object-cover brightness-[0.4]"
        />
        {/* 그라디언트 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-r from-[rgba(20,20,20,0.95)] via-[rgba(20,20,20,0.6)] to-[rgba(20,20,20,0.2)]" />

        {/* 콘텐츠 */}
        <div className="absolute inset-0 flex items-end gap-8 px-12 pb-10">
          {/* 포스터 */}
          <img
            src={`https://image.tmdb.org/t/p/w300${movie?.poster_path}`}
            alt="movie poster"
            className="w-[130px] h-[195px] rounded-lg object-cover flex-shrink-0 shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
          />

          {/* 영화 정보 */}
          <div className="flex-1 pb-1">
            {/* 제목 */}
            <h1 className="text-3xl font-extrabold mb-2 tracking-tight">
              {movie?.title}
            </h1>

            {/* 평점 / 연도 / 상영시간 */}
            <div className="flex items-center gap-4 mb-3">
              <span className="bg-[#e50914] text-white text-xs font-bold px-2 py-1 rounded">
                ⭐ {movie?.vote_average.toFixed(1)}
              </span>
              <span className="text-[#aaa] text-sm">
                {movie?.release_date?.slice(0, 4)}
              </span>
              <span className="text-[#aaa] text-sm">·</span>
              <span className="text-[#aaa] text-sm">{movie?.runtime}분</span>
            </div>

            {/* 태그라인 */}
            {movie?.tagline && (
              <p className="text-[#e50914] text-sm italic font-semibold mb-3">
                {movie.tagline}
              </p>
            )}

            {/* 장르 태그 */}
            <div className="flex flex-wrap gap-2 mb-4">
              {movie?.genres.map((genre) => (
                <span
                  key={genre.id}
                  className="bg-white/10 border border-white/20 text-[#ddd] text-xs px-3 py-1 rounded-full"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            {/* 줄거리 */}
            <p className="text-[#ccc] text-sm leading-relaxed max-w-2xl line-clamp-3">
              {movie?.overview}
            </p>
          </div>
        </div>
      </div>

      {/* 출연진 섹션 */}
      <div className="px-12 py-9">
        <h2 className="text-xl font-bold mb-6 border-l-4 border-[#e50914] pl-3">
          감독/출연
        </h2>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-5">
          {credits?.cast.slice(0, 20).map((member) => (
            <div
              key={member.id}
              className="flex flex-col items-center text-center gap-2"
            >
              {/* 프로필 이미지 */}
              {member.profile_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w185${member.profile_path}`}
                  alt={member.name}
                  className="w-20 h-20 rounded-full object-cover border-2 border-white/10 hover:border-[#e50914] transition-colors duration-200"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-[#333] border-2 border-white/10 flex items-center justify-center text-[#888] text-2xl">
                  👤
                </div>
              )}
              <span className="text-[0.8rem] font-semibold text-[#eee] leading-tight">
                {member.name}
              </span>
              <span className="text-[0.72rem] text-[#888] leading-tight">
                {member.character}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage;
