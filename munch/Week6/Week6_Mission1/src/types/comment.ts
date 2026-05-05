import type { CommonResponse, CursorBasedResponse } from "./common";

export type CommentAuthor = {
  id: number;
  name: string;
  email: string;
  bio: string | null;
  avatar: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type Comment = {
  id: number;
  content: string;
  lpId: number;
  authorId: number;
  createdAt: Date;
  updatedAt: Date;
  author: CommentAuthor;
};

export type ResponseCommentListDto = CursorBasedResponse<{
  data: Comment[];
  nextCursor: number;
  hasNext: boolean;
}>;

export type RequestCreateCommentDto = {
  content: string;
};

export type ResponseCreateCommentDto = CommonResponse<Comment>;
