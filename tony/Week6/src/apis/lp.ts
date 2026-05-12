import { api } from "../lib/axios";

export const uploadImage = async (file: File): Promise<string> => {
	const formData = new FormData();
	formData.append("file", file);
	const { data } = await api.post<{ data: { imageUrl: string } }>(
		"/v1/uploads",
		formData,
		{ headers: { "Content-Type": "multipart/form-data" } },
	);
	return data.data.imageUrl;
};

export type Lp = {
	id: number;
	title: string;
	content: string;
	thumbnail: string;
	published: boolean;
	createdAt: string;
	author: { id: number; name: string; avatar?: string | null };
	tags?: { id: number; name: string }[];
	likes?: { id: number; userId: number; lpId: number }[];
};

export type Comment = {
	id: number;
	content: string;
	createdAt: string;
	author: { id: number; name: string };
};

export type CreateLpBody = {
	title: string;
	content: string;
	thumbnail?: string;
	published: boolean;
	tags: string[];
};

export type UpdateLpBody = Partial<CreateLpBody>;

type LpListResponse = {
	data: { data: Lp[]; hasNext: boolean; nextCursor: number | null };
};

type LpDetailResponse = { data: Lp };

type CommentListResponse = {
	data: { data: Comment[]; hasNext: boolean; nextCursor: number | null };
};

// LP 목록 조회
export const getLps = async (
	cursor?: number,
	limit = 10,
	order: "asc" | "desc" = "desc",
) => {
	const { data } = await api.get<LpListResponse>("/v1/lps", {
		params: { cursor, limit, order },
	});
	return data.data;
};

// LP 생성
export const createLp = async (body: CreateLpBody): Promise<Lp> => {
	const { data } = await api.post<LpDetailResponse>("/v1/lps", body);
	return data.data;
};

// 특정 유저가 생성한 LP 목록
export const getLpsByUser = async (
	userId: number,
	cursor?: number,
	limit = 10,
	order: "asc" | "desc" = "desc",
) => {
	const { data } = await api.get<LpListResponse>(`/v1/lps/user/${userId}`, {
		params: { cursor, limit, order },
	});
	return data.data;
};

// 내가 생성한 LP 목록
export const getMyLps = async (
	cursor?: number,
	limit = 10,
	order: "asc" | "desc" = "desc",
) => {
	const { data } = await api.get<LpListResponse>("/v1/lps/user", {
		params: { cursor, limit, order },
	});
	return data.data;
};

// LP 상세 조회
export const getLpDetail = async (lpId: number) => {
	const { data } = await api.get<LpDetailResponse>(`/v1/lps/${lpId}`);
	return data.data;
};

// LP 정보 업데이트
export const updateLp = async (
	lpId: number,
	body: UpdateLpBody,
): Promise<Lp> => {
	const { data } = await api.patch<LpDetailResponse>(`/v1/lps/${lpId}`, body);
	return data.data;
};

// LP 삭제
export const deleteLp = async (lpId: number): Promise<void> => {
	await api.delete(`/v1/lps/${lpId}`);
};

// 특정 태그 관련 LP 목록
export const getLpsByTag = async (
	tagName: string,
	cursor?: number,
	limit = 10,
	order: "asc" | "desc" = "desc",
) => {
	const { data } = await api.get<LpListResponse>(`/v1/lps/tag/${tagName}`, {
		params: { cursor, limit, order },
	});
	return data.data;
};

// LP 상세 댓글 조회
export const getLpComments = async (
	lpId: number,
	cursor?: number,
	limit = 10,
	order: "asc" | "desc" = "desc",
) => {
	const { data } = await api.get<CommentListResponse>(
		`/v1/lps/${lpId}/comments`,
		{
			params: { cursor, limit, order },
		},
	);
	return data.data;
};

// LP 좋아요
export const postLike = async (lpId: number): Promise<void> => {
	await api.post(`/v1/lps/${lpId}/likes`);
};

// LP 좋아요 취소
export const deleteLike = async (lpId: number): Promise<void> => {
	await api.delete(`/v1/lps/${lpId}/likes`);
};

// 내가 좋아요한 LP 목록
export const getMyLikedLps = async (
	cursor?: number,
	limit = 10,
	order: "asc" | "desc" = "desc",
) => {
	const { data } = await api.get<LpListResponse>("/v1/lps/likes/me", {
		params: { cursor, limit, order },
	});
	return data.data;
};

// 특정 유저가 좋아요한 LP 목록
export const getLikedLpsByUser = async (
	userId: number,
	cursor?: number,
	limit = 10,
	order: "asc" | "desc" = "desc",
) => {
	const { data } = await api.get<LpListResponse>(`/v1/lps/likes/${userId}`, {
		params: { cursor, limit, order },
	});
	return data.data;
};

// 댓글 생성
export const postComment = async (
	lpId: number,
	content: string,
): Promise<Comment> => {
	const { data } = await api.post<{ data: Comment }>(
		`/v1/lps/${lpId}/comments`,
		{ content },
	);
	return data.data;
};

// 댓글 수정
export const updateComment = async (
	lpId: number,
	commentId: number,
	content: string,
): Promise<Comment> => {
	const { data } = await api.patch<{ data: Comment }>(
		`/v1/lps/${lpId}/comments/${commentId}`,
		{ content },
	);
	return data.data;
};

// 댓글 삭제
export const deleteComment = async (
	lpId: number,
	commentId: number,
): Promise<void> => {
	await api.delete(`/v1/lps/${lpId}/comments/${commentId}`);
};
