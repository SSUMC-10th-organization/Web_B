import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createContext,
  type PropsWithChildren,
  useContext,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { postLogout, postSignin } from "../apis/auth";
import { toast } from "../components/Toast";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { RequestSigninDto } from "../types/auth";

interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  login: (signinData: RequestSigninDto) => void;
  logout: () => void;
  isPendingLogin: boolean;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  refreshToken: null,
  login: () => {},
  logout: () => {},
  isPendingLogin: false,
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    getItem: getAccessTokenFromStorage,
    setItem: setAccessTokenInStorage,
    removeItem: removeAccessTokenFromStorage,
  } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
  const {
    getItem: getRefreshTokenFromStorage,
    setItem: setRefreshTokenInStorage,
    removeItem: removeRefreshTokenFromStorage,
  } = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);

  const [accessToken, setAccessToken] = useState<string | null>(
    getAccessTokenFromStorage(),
  );
  const [refreshToken, setRefreshToken] = useState<string | null>(
    getRefreshTokenFromStorage(),
  );

  // 로그인 useMutation
  const { mutate: login, isPending: isPendingLogin } = useMutation({
    mutationFn: (signinData: RequestSigninDto) => postSignin(signinData),
    onSuccess: ({ data }) => {
      setAccessTokenInStorage(data.accessToken);
      setRefreshTokenInStorage(data.refreshToken);
      setAccessToken(data.accessToken);
      setRefreshToken(data.refreshToken);
      toast.success("로그인 성공!");
      navigate("/");
    },
    onError: () => {
      toast.error("로그인에 실패했습니다.");
    },
  });

  // 로그아웃 useMutation
  const { mutate: logout } = useMutation({
    mutationFn: postLogout,
    onSuccess: () => {
      removeAccessTokenFromStorage();
      removeRefreshTokenFromStorage();
      setAccessToken(null);
      setRefreshToken(null);
      queryClient.clear();
      toast.info("로그아웃 되었습니다.");
      navigate("/");
    },
    onError: () => {
      toast.error("로그아웃에 실패했습니다.");
    },
  });

  return (
    <AuthContext.Provider
      value={{ accessToken, refreshToken, login, logout, isPendingLogin }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("AuthContext를 찾을 수 없습니다.");
  }
  return context;
};
