import axios from "axios";

const axiosInstance = axios.create({
	baseURL: "http://localhost:8000/v1",
});

// 요청마다 accessToken을 헤더에 자동으로 붙여줌
axiosInstance.interceptors.request.use((config) => {
	const token = localStorage.getItem("accessToken");
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

// 응답 중 401이 오면 refreshToken으로 재발급 시도
axiosInstance.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true; // 무한 루프 방지

			const refreshToken = localStorage.getItem("refreshToken");
			if (!refreshToken) {
				localStorage.clear();
				window.location.href = "/login";
				return Promise.reject(error);
			}

			try {
				const { data } = await axios.post(
					"http://localhost:8000/v1/auth/refresh",
					{ refresh: refreshToken },
				);

				const newAccessToken = data.data.accessToken;
				localStorage.setItem("accessToken", newAccessToken);

				// 원래 요청을 새 토큰으로 재시도
				originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
				return axiosInstance(originalRequest);
			} catch {
				// refreshToken도 만료됐으면 로그아웃
				localStorage.clear();
				window.location.href = "/login";
				return Promise.reject(error);
			}
		}

		return Promise.reject(error);
	},
);

export default axiosInstance;
