import { z } from "zod";

const signupBaseSchema = z.object({
	email: z
		.string()
		.min(1, { message: "이메일을 입력해주세요." })
		.email({ message: "올바른 이메일 형식을 입력해주세요." }),
	password: z
		.string()
		.min(6, { message: "비밀번호는 6~20자 사이로 입력해주세요." })
		.max(20, { message: "비밀번호는 6~20자 사이로 입력해주세요." }),
	passwordConfirm: z.string().min(1, { message: "비밀번호를 확인해주세요." }),
	name: z.string().min(1, { message: "닉네임을 입력해주세요." }),
});

/**
 * 2. 전체 회원가입 스키마 (최종 제출용)
 * baseSchema에 refine을 붙여서 만듭니다.
 */
export const signupSchema = signupBaseSchema.refine(
	(data) => data.password === data.passwordConfirm,
	{
		path: ["passwordConfirm"],
		message: "비밀번호가 일치하지 않습니다.",
	},
);
export type UserSignupInformation = z.infer<typeof signupSchema>;

/**
 * 3. [1단계] 이메일 전용 스키마
 * signupBaseSchema에서 이메일만 쏙!
 */
export const emailStepSchema = signupBaseSchema.pick({ email: true });
export type EmailStepInformation = z.infer<typeof emailStepSchema>;

/**
 * 4. [2단계] 비밀번호 전용 스키마
 * password와 passwordConfirm을 가져오고 여기서 다시 refine을 해줍니다.
 */
export const passwordStepSchema = signupBaseSchema
	.pick({
		password: true,
		passwordConfirm: true,
	})
	.refine((data) => data.password === data.passwordConfirm, {
		path: ["passwordConfirm"],
		message: "비밀번호가 일치하지 않습니다.",
	});
export type PasswordStepInformation = z.infer<typeof passwordStepSchema>;

/**
 * 5. [3단계] 프로필 전용 스키마
 */
export const nameStepSchema = signupBaseSchema.pick({ name: true });
export type NameStepInformation = z.infer<typeof nameStepSchema>;

/**
 * [기타] 로그인용 스키마
 */
export const signinSchema = z.object({
	email: z
		.string()
		.min(1, { message: "이메일을 입력해주세요." })
		.email({ message: "올바른 이메일 형식을 입력해주세요." }),
	password: z
		.string()
		.min(8, { message: "비밀번호는 8자 이상으로 입력해주세요." })
		.max(20, { message: "비밀번호는 20자 이하로 입력해주세요." }),
});
export type UserSigninInformation = z.infer<typeof signinSchema>;
