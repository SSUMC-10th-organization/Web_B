import { useMutation } from "@tanstack/react-query";
import { updateMyInfo } from "../apis/auth";
import { queryClient } from "../App";

function useUpdateMyInfo() {
  return useMutation({
    mutationFn: updateMyInfo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myInfo"] });
      alert("프로필이 수정되었습니다.");
    },
    onError: () => {
      alert("프로필 수정에 실패했습니다.");
    },
  });
}

export default useUpdateMyInfo;
