import { api } from "../lib/axios";

export type User = {
	id: number;
	name: string;
	email: string;
	bio: string | null;
	avatar: string | null;
	createdAt: string;
	updatedAt: string;
};

type UserResponse = {
	data: User;
};

export type UpdateUserBody = {
	name?: string;
	bio?: string;
	avatar?: string;
};

export const getMyProfile = async (): Promise<User> => {
	const { data } = await api.get<UserResponse>("/v1/users/me");
	return data.data;
};

export const getUserById = async (userId: number): Promise<User> => {
	const { data } = await api.get<UserResponse>(`/v1/users/${userId}`);
	return data.data;
};

export const updateMyProfile = async (body: UpdateUserBody): Promise<User> => {
	const { data } = await api.patch<UserResponse>("/v1/users", body);
	return data.data;
};

export const deleteMyAccount = async (): Promise<void> => {
	await api.delete("/v1/users");
};
