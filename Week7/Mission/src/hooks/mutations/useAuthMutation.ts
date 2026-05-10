import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { publicApi,api } from "../../apis/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import { type LoginFormValues } from "../../schemas/authSchema";

type LoginResponse = {
    status: boolean;
    statusCode: number;
    message: string;
    data: {
        id: number;
        name: string;
        accessToken: string;
        refreshToken: string;
    };
};

type ErrorResponse = {
    message?: string;
};

type UpdateUserPayload = {
  name: string;
  bio?: string;
};

export const useLoginMutation = (from: string) => {
    const navigate = useNavigate();
    const { setTokenA, setTokenR, setNick } = useAuth();

    return useMutation({
        // API 호출 함수
        mutationFn: async (data: LoginFormValues) => {
            const response = await publicApi.post<LoginResponse>("/v1/auth/signin", {
                email: data.email,
                password: data.password,
            });
            return response.data.data; // 필요한 데이터만 반환
        },
        // 성공 시 처리 (AuthContext 저장 + 페이지 이동)
        onSuccess: (data) => {
            const { accessToken, refreshToken, name } = data;

            setTokenA(accessToken);
            setTokenR(refreshToken);
            setNick(name);
            navigate(from, { replace: true });
        },
    });
};

export const useLogoutMutation = () => {
    const navigate = useNavigate();
    const { setTokenA, setTokenR, setNick } = useAuth();

    return useMutation({
        // API 호출 함수
        mutationFn: () => 
        api.post("/v1/auth/signout"),
 
        onSettled: () => {
            setTokenA(null);
            setTokenR(null);
            setNick(null);
            navigate("/login", { replace: true });
        },
    });
};

export const useWithdrawMutation = () => {
    const navigate = useNavigate();
    const { setTokenA, setTokenR, setNick } = useAuth();

    return useMutation({
        // Swagger 명세: DELETE /v1/users
        mutationFn: () => api.delete("/v1/users"), 
        onSettled: () => {
            setTokenA(null);
            setTokenR(null);
            setNick(null);
            navigate("/login", { replace: true });
        }
    });
};

export const useUpdateUserMutation = () => {
    const { setNick } = useAuth();

  return useMutation({
    mutationFn: async (data: UpdateUserPayload) => {
      const response = await api.patch("/v1/users", data);
      return response.data.data;
    },

    onSuccess: (data) => {
      // 서버에서 내려온 최신 이름으로 Context 상태 업데이트
      if (data.name) {
        setNick(data.name);
      }
    },

    onError: (error: any) => {
      console.error("수정 에러:", error);
      const message = error.response?.data?.message || "정보 수정에 실패했습니다.";
      alert(message);
    },
  });

};