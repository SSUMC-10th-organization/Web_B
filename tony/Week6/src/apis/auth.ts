import { api, publicApi } from "../lib/axios";

type AuthResponse = {
	data: {
		id: number;
		name: string;
		accessToken: string;
		refreshToken: string;
	};
};

export const postSignin = async (email: string, password: string) => {
	const { data } = await publicApi.post<AuthResponse>("/v1/auth/signin", {
		email,
		password,
	});
	return data.data;
};

export const postSignup = async (
	name: string,
	email: string,
	password: string,
) => {
	const { data } = await publicApi.post<AuthResponse>("/v1/auth/signup", {
		name,
		email,
		password,
	});
	return data.data;
};

export const postSignout = async (): Promise<void> => {
	await api.post("/v1/auth/signout");
};
