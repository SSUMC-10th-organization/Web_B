const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const NICKNAME_KEY = "nickname";

const getStorageValue = <T,>(key: string): T | null => {
	const saved = localStorage.getItem(key);

	if (saved === null || saved === "null") {
		return null;
	}

	try {
		return JSON.parse(saved) as T;
	} catch {
		return null;
	}
};

const setStorageValue = <T,>(key: string, value: T | null) => {
	if (value === null || value === undefined) {
		localStorage.removeItem(key);
		return;
	}

	localStorage.setItem(key, JSON.stringify(value));
};

export const tokenStorage = {
	getAccessToken: () => getStorageValue<string>(ACCESS_TOKEN_KEY),
	getRefreshToken: () => getStorageValue<string>(REFRESH_TOKEN_KEY),

	setAccessToken: (token: string | null) => {
		setStorageValue(ACCESS_TOKEN_KEY, token);
	},

	setRefreshToken: (token: string | null) => {
		setStorageValue(REFRESH_TOKEN_KEY, token);
	},

	clearTokens: () => {
		localStorage.removeItem(ACCESS_TOKEN_KEY);
		localStorage.removeItem(REFRESH_TOKEN_KEY);
		localStorage.removeItem(NICKNAME_KEY);
	},
};