import axios, {
	type AxiosError,
	type InternalAxiosRequestConfig,
} from "axios";
import { tokenStorage } from "./tokenStorage";

type RefreshResponse = {
	status: boolean;
	statusCode: number;
	message: string;
	data: {
		id: number;
		name: string;
		accessToken: string;
		refreshToken: string;
	};
};

type ErrorResponse = {
	message?: string;
};

interface RetryableAxiosRequestConfig extends InternalAxiosRequestConfig {
	_retry?: boolean;
}

export const publicApi = axios.create({
	baseURL: "http://localhost:8000",
	headers: {
		"Content-Type": "application/json",
		accept: "application/json",
	},
});

export const api = axios.create({
	baseURL: "http://localhost:8000",
	headers: {
		"Content-Type": "application/json",
		accept: "application/json",
	},
});

api.interceptors.request.use((config) => {
	const accessToken = tokenStorage.getAccessToken();

	if (accessToken) {
		config.headers.Authorization = `Bearer ${accessToken}`;
	}

	return config;
});

api.interceptors.response.use(
	(response) => response,

	async (error: AxiosError<ErrorResponse>) => {
		const originalRequest = error.config as
			| RetryableAxiosRequestConfig
			| undefined;

		if (!originalRequest) {
			return Promise.reject(error);
		}

		if (error.response?.status !== 401) {
			return Promise.reject(error);
		}

		if (originalRequest._retry) {
			tokenStorage.clearTokens();
			window.location.href = "/login";
			return Promise.reject(error);
		}

		originalRequest._retry = true;

		const refreshToken = tokenStorage.getRefreshToken();

		if (!refreshToken) {
			tokenStorage.clearTokens();
			window.location.href = "/login";
			return Promise.reject(error);
		}

		try {
			const response = await publicApi.post<RefreshResponse>(
				"/v1/auth/refresh",
				{
					refresh : refreshToken,
				},
			);

			const { accessToken, refreshToken: newRefreshToken } =
				response.data.data;

			tokenStorage.setAccessToken(accessToken);

			if (newRefreshToken) {
				tokenStorage.setRefreshToken(newRefreshToken);
			}

			originalRequest.headers.Authorization = `Bearer ${accessToken}`;

			return api(originalRequest);
		} catch (refreshError) {
			tokenStorage.clearTokens();
			window.location.href = "/login";
			return Promise.reject(refreshError);
		}
	},
);