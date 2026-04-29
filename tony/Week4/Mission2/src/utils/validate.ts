// utils/validate.ts
export const validateLogin = (values: { email: string; password: string }) => {
	const errors: Partial<{ email: string; password: string }> = {};

	if (!values.email.includes("@")) {
		errors.email = "이메일 형식(@를 포함)이 올바르지 않습니다.";
	}

	if (values.password.length > 20) {
		errors.password = "비밀번호는 20자리 이하여야 합니다.";
	}

	return errors;
};
