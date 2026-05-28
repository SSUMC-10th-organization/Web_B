import type { PaginationDto } from "../types/common";
import type { ResponseCommentListDto } from "../types/comment";
import { axiosInstance } from "./axios";

export const getCommentList = async (
  lpId: number,
  paginationDto: PaginationDto,
): Promise<ResponseCommentListDto> => {
  const { data } = await axiosInstance.get(`/v1/lps/${lpId}/comments`, {
    params: paginationDto,
  });
  return data;
};

export const createComment = async (lpId: number, content: string) => {
  const { data } = await axiosInstance.post(`/v1/lps/${lpId}/comments`, {
    content,
  });
  return data;
};

export const updateComment = async (
  lpId: number,
  commentId: number,
  content: string,
) => {
  const { data } = await axiosInstance.patch(
    `/v1/lps/${lpId}/comments/${commentId}`,
    { content },
  );
  return data;
};

export const deleteComment = async (lpId: number, commentId: number) => {
  const { data } = await axiosInstance.delete(
    `/v1/lps/${lpId}/comments/${commentId}`,
  );
  return data;
};
