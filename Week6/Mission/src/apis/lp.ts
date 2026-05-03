import { type PaginationDto } from "./common";
import { publicApi,api } from "./axiosInstance";
import { type ResponseLPListDto } from "../types/lp";

export const getLPList = async (
    paginationDto : PaginationDto,
): Promise<ResponseLPListDto> => {
    const {data} = await publicApi.get("/v1/lps",{params:paginationDto,});
    return data;
};

export const getLpDetail = async (
    lpid: string
): Promise<any> => { // ResponseLPDetailDto가 있다면 any 대신 교체하세요.
    const { data } = await publicApi.get(`/v1/lps/${lpid}`);
    return data;
};

export const getLpComments = async (
    lpid: string,
    params: { cursor?: number; limit?: number; order?: string }
) => {
    const { data } = await api.get(`/v1/lps/${lpid}/comments`, { params });
    return data;
};