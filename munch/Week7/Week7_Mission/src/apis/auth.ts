import type {
  RequestSigninDto,
  RequestSignupDto,
  RequestUpdateUserDto,
  ResponseImageUploadDto,
  ResponseMyInfoDto,
  ResponseSigninDto,
  ResponseSignupDto,
  ResponseUpdateUserDto,
} from "../types/auth";
import { axiosInstance } from "./axios";

export const postSignup = async (
  body: RequestSignupDto,
): Promise<ResponseSignupDto> => {
  const { data } = await axiosInstance.post("/v1/auth/signup", body);

  return data;
};

export const postSignin = async (
  body: RequestSigninDto,
): Promise<ResponseSigninDto> => {
  const { data } = await axiosInstance.post("/v1/auth/signin", body);

  return data;
};

export const getMyInfo = async (): Promise<ResponseMyInfoDto> => {
  const { data } = await axiosInstance.get("/v1/users/me");

  return data;
};

export const postLogout = async () => {
  const { data } = await axiosInstance.post("/v1/auth/signout");
  return data;
};

export const updateUser = async (
  body: RequestUpdateUserDto,
): Promise<ResponseUpdateUserDto> => {
  const { data } = await axiosInstance.patch("/v1/users", body);
  return data;
};

// 회원 탈퇴
export const deleteUser = async (): Promise<void> => {
  await axiosInstance.delete("/v1/users");
};

// 이미지 업로드
export const uploadImage = async (
  file: File,
): Promise<ResponseImageUploadDto> => {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await axiosInstance.post("/v1/uploads", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};
