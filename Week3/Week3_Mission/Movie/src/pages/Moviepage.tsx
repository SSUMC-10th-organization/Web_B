import { useEffect, useState } from 'react';
import type { Movie, MovieResponse } from '../types/movies';
import axios from 'axios';

const MoviesPage = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
    console.log(movies); // 영화 데이터 체크
  useEffect(() => {
    const fetchMovies = async () => {
      const { data } = await axios.get<MovieResponse>(
        'https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=1',
        {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmYTU2MDc3MThmZWQwZjFlYTI3NmZiNTc3NDVmZmRiNSIsIm5iZiI6MTc3NDc3NTI3OS4wNzgsInN1YiI6IjY5YzhlYmVmNTUwMjViZWFkYTAxZTVhNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.xUD0btJOl74kkYj-VJsIXeLFI8rnV-6yQTqluhxk4Uo`, // 본인 TMDB 토큰으로 교체
          },
        }
      );
      setMovies(data.results);
    };

    fetchMovies();
  }, []);

  return (
  /* 1. 전체 배경: <ul> 대신 <div>를 쓰세요. (ul은 기본 여백 때문에 레이아웃 잡기 피곤합니다) */
  <div className="bg-white min-h-screen p-8">
    
    {/* 2. [가장 중요] 울타리: 그리드가 무한정 커지는 걸 막습니다. */}
    {/* mx-auto는 중앙 정렬, max-w-[1000px]는 창이 아무리 커도 너비를 1000px로 딱 고정합니다. */}
    <div className="max-w-[1000px] mx-auto">
      
      {/* 3. 그리드 판: 6열로 쪼개고 간격(gap)을 줍니다. */}
      <div className="grid grid-cols-6 gap-4">
        
        {/* 4. 데이터 반복 시작 */}
        {movies.map((movie) => (
          <div 
            key={movie.id} 
            className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-gray-900 group cursor-pointer"
          >
            {/* 5. 포스터 이미지: w-full h-full로 꽉 채우고 object-cover로 비율 유지 */}
            <img 
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
              alt={movie.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            
            {/* 6. 호버 효과 레이어 (선택 사항) */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            </div>
          </div>
        ))}

      </div>
    </div>
  </div>
);
};

export default MoviesPage;

