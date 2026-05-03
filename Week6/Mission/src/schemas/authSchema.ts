import { z } from "zod";

export const loginSchema = z.object({
	email: z
		.string()
		.trim()
		.min(1, "이메일을 입력해주세요.")
		.pipe(z.email("올바른 이메일 형식을 입력해주세요.")),
	password: z
		.string()
		.min(1, "비밀번호를 입력해주세요.")
		.min(8, "비밀번호는 8자리 이상 입력해야합니다."),
});

export type LoginFormInput = z.input<typeof loginSchema>;
export type LoginFormValues = z.output<typeof loginSchema>;

export const signupSchema = z
	.object({
		email: z
			.string()
			.trim()
			.min(1, "이메일을 입력해주세요.")
			.pipe(z.email("올바른 이메일 형식을 입력해주세요.")),

		password: z
			.string()
			.min(1, "비밀번호를 입력해주세요.")
			.min(8, "비밀번호는 8-20글자로 설정 해야 합니다.")
			.max(20, "비밀번호는 8-20글자로 설정 해야 합니다."),

		confirmPassword: z
			.string()
			.min(1, "비밀번호를 한 번 더 입력해주세요."),

		nickname: z.string().trim().min(1, "닉네임을 입력해주세요."),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "비밀번호가 일치하지 않습니다.",
		path: ["confirmPassword"],
	});

export type SignupFormInput = z.input<typeof signupSchema>;
export type SignupFormValues = z.output<typeof signupSchema>;