import type { CommonResponse, CursorBasedResponse } from "./common";

export type Tag = {
	id: number;
	name: string;
};

export type Likes = {
	id: number;
	userId: number;
	lpId: number;
};

export type Lp = {
	id: number;
	title: string;
	content: string;
	thumbnail: string;
	published: boolean;
	authorId: number;
	createdAt: Date;
	updatedAt: Date;
	tags: Tag[];
	likes: Likes[];
};

export type LpAuthor = {
	id: number;
	name: string;
	email: string;
	bio: string | null;
	avatar: string | null;
	createdAt: Date;
	updatedAt: Date;
};

export type LpDetail = Lp & {
	author: LpAuthor;
};

export type ResponseLpListDto = CursorBasedResponse<{
	data: Lp[];
	nextCursor: number;
	hasNext: boolean;
}>;

export type ResponseLpDetailDto = CommonResponse<LpDetail>;

export type RequestCreateLpDto = {
	title: string;
	content: string;
	thumbnail: string;
	tags: string[];
	published: boolean;
};

export type RequestUpdateLpDto = Partial<RequestCreateLpDto>;

export type ResponseCreateLpDto = CommonResponse<Lp>;
export type ResponseUpdateLpDto = CommonResponse<Lp>;
