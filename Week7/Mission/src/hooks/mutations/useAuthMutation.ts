import { useMutation,useQueryClient } from "@tanstack/react-query";
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
    const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateUserPayload) => {
      const response = await api.patch("/v1/users", data);
      return response.data.data;
    },

    // 낙관적 업데이트: 서버 응답을 기다리지 않고 즉시 UI 변경
        onMutate: async (newUserData) => {
            // 1. 기존에 진행 중인 정보 갱신 요청이 있다면 취소
            await queryClient.cancelQueries({ queryKey: ["me"] });

            // 2. 에러 발생 시 롤백하기 위해 '현재' 캐시 데이터를 백업
            const previousUserData: any = queryClient.getQueryData(["me"]);

            // 3. Nav-Bar 즉시 업데이트 (AuthContext 변경)
            if (newUserData.name) {
                setNick(newUserData.name);
            }

            // MyPage 즉시 업데이트 (React Query 캐시 변경)
            queryClient.setQueryData(["me"], (old: any) => {
                if (!old) return old;
                return {
                    ...old,
                    data: {
                        ...old.data,
                        name: newUserData.name,
                        bio: newUserData.bio !== undefined ? newUserData.bio : old.data.bio,
                    },
                };
            });

            // 5. 백업 데이터를 onError로 전달
            return { previousUserData };
        },

        // 서버 요청 실패 시: 백업해둔 데이터로 롤백 (원상복구)
        onError: (error: any, newUserData, context) => {
            console.error("수정 에러:", error);

            // MyPage 원상복구
            if (context?.previousUserData) {
                queryClient.setQueryData(["me"], context.previousUserData);
                // Nav-Bar 원상복구 (이전 이름으로)
                setNick(context.previousUserData.data.name);
            }

            const message = error.response?.data?.message || "정보 수정에 실패했습니다.";
            alert(message);
        },

        // 🏁 성공하든 실패하든 마무리: 서버의 진짜 최신 데이터와 캐시 동기화
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["me"] });
        },
  });

};