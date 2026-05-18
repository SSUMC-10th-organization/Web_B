import type {
	RequestCreateCommentDto,
	RequestUpdateCommentDto,
	ResponseCommentListDto,
	ResponseCreateCommentDto,
	ResponseDeleteCommentDto,
	ResponseUpdateCommentDto,
} from "../types/comment";
import type { PaginationDto } from "../types/common";
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

export const updateComment = async (
	lpId: number,
	commentId: number,
	body: RequestUpdateCommentDto,
): Promise<ResponseUpdateCommentDto> => {
	const { data } = await axiosInstance.patch(
		`/v1/lps/${lpId}/comments/${commentId}`,
		body,
	);
	return data;
};

export const deleteComment = async (
	lpId: number,
	commentId: number,
): Promise<ResponseDeleteCommentDto> => {
	const { data } = await axiosInstance.delete(
		`/v1/lps/${lpId}/comments/${commentId}`,
	);
	return data;
};
