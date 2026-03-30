export type Movie = {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  // 필요하다면 추가 필드도 정의 가능
};

export type MovieResponse = {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
};

export type MovieDetails = {
  id: number;
  title: string;            // 제목
  tagline: string;          // "A long time ago in a galaxy far, far away..."
  overview: string;         // 줄거리
  genres: {                 // 장르
    id: number;
    name: string;
  }[];
  release_date: string;     // 개봉일
  runtime: number;          // 런타임
  vote_average: number;     // 평점
  poster_path: string|null;      // 세로 포스터
  backdrop_path: string|null;    // 가로 배경 이미지
};

// 1. 배우 한 명에 대한 정보
export type CastMember = {
  id: number;
  name: string;          // 본명 
  character: string;     // 배역 
  profile_path: string | null; // 사진 경로 (상대 경로)
};


export type CrewMember = { // 제작진 찾기
  id: number;
  name: string;
  job: string;           // 직업 (예: Director)
};

// 3. API 응답 전체 구조
export type MovieCreditsResponse = {
  id: number;
  cast: CastMember[];    // 출연 배우 리스트
  crew: CrewMember[];    // 제작진 리스트
};