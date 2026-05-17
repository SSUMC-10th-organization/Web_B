import { type PaginationDto } from "./common";
import { publicApi,api } from "./axiosInstance";
import { type ResponseLPListDto } from "../types/lp";

// LP 목록 가져오기
export const getLPList = async (
    paginationDto : PaginationDto,
): Promise<ResponseLPListDto> => {
    const {data} = await publicApi.get("/v1/lps",{params:paginationDto,});
    return data;
};

// LP 상세 정보 가져오기
export const getLpDetail = async (
    lpid: string
): Promise<any> => { // ResponseLPDetailDto가 있다면 any 대신 교체하세요.
    const { data } = await publicApi.get(`/v1/lps/${lpid}`);
    return data;
};

// 댓글 가져오기
export const getLpComments = async (
    lpid: string,
    params: { cursor?: number; limit?: number; order?: string }
) => {
    const { data } = await api.get(`/v1/lps/${lpid}/comments`, { params });
    return data;
};
// LP 제작
export const createLp = async (payload: { title: string; content: string; thumbnail: string; tags: string[]; published: boolean }) => {
    const { data } = await api.post("/v1/lps", payload);
    return data;
};

// LP 삭제 (DELETE /v1/lps/{lpid})
export const deleteLp = async (lpid: string) => {
    const { data } = await api.delete(`/v1/lps/${lpid}`);
    return data;
};

// 댓글 작성
export const createComment = async (lpid: string, content: string) => {
    const { data } = await api.post(`/v1/lps/${lpid}/comments`, { content });
    return data;
};
// 댓글 수정 
export const updateComment = async (lpid: string, commentId: number, content: string) => {
    const { data } = await api.patch(`/v1/lps/${lpid}/comments/${commentId}`, { content });
    return data;
};

// 댓글 삭제 
export const deleteComment = async (lpid: string, commentId: number) => {
    const { data } = await api.delete(`/v1/lps/${lpid}/comments/${commentId}`);
    return data;
};