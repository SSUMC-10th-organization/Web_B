import { useMutation } from "@tanstack/react-query";
import { updateMyInfo } from "../apis/auth";
import { queryClient } from "../App";
import { QUERY_KEY } from "../constants/key";
import type { ResponseMyInfoDto } from "../types/auth";
import type { RequestUpdateMyInfoDto } from "../types/auth";

function useUpdateMyInfo() {
  return useMutation({
    mutationFn: updateMyInfo,
    onMutate: async (newData: RequestUpdateMyInfoDto) => {
      // 진행 중인 myInfo 요청 취소
      await queryClient.cancelQueries({ queryKey: [QUERY_KEY.myInfo] });

      // 현재 캐시 값 저장 (롤백용)
      const previousMyInfo = queryClient.getQueryData<ResponseMyInfoDto>([
        QUERY_KEY.myInfo,
      ]);

      // 캐시를 낙관적으로 즉시 업데이트
      queryClient.setQueryData<ResponseMyInfoDto>([QUERY_KEY.myInfo], (old) => {
        if (!old) return old;
        return {
          ...old,
          data: {
            ...old.data,
            name: newData.name,
            bio: newData.bio ?? old.data.bio,
            avatar: newData.avatar ?? old.data.avatar,
          },
        };
      });

      return { previousMyInfo };
    },
    onSuccess: () => {
      alert("프로필이 수정되었습니다.");
    },
    onError: (_error, _variables, context) => {
      // 실패 시 이전 값으로 롤백
      if (context?.previousMyInfo) {
        queryClient.setQueryData([QUERY_KEY.myInfo], context.previousMyInfo);
      }
      alert("프로필 수정에 실패했습니다.");
    },
    onSettled: () => {
      // 성공/실패 관계없이 최종적으로 서버 데이터로 동기화
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.myInfo] });
    },
  });
}

export default useUpdateMyInfo;
