import type { PaginationDto } from "../types/common";
import type {
  RequestCreateCommentDto,
  ResponseCommentListDto,
  ResponseCreateCommentDto,
} from "../types/comment";
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

export const createComment = async (
  lpId: number,
  body: RequestCreateCommentDto,
): Promise<ResponseCreateCommentDto> => {
  const { data } = await axiosInstance.post(`/v1/lps/${lpId}/comments`, body);
  return data;
};
