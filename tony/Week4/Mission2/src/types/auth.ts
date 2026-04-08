// 회원가입 전체 데이터 타입
export interface SignupData {
  email: string;
  password: string;
  nickname: string;
}

// 로그인 데이터 타입
export interface LoginData {
  email: string;
  password: string;
}

// 로컬 스토리지에 저장할 유저 정보 타입
export interface UserInfo {
  token: string;
  email: string;
  nickname: string;
}
