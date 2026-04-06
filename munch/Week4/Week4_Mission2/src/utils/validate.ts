import { z } from "zod";

export const signinSchema = z.object({
  email: z
    .string()
    .min(1, { message: "이메일을 입력해주세요." })
    .email({ message: "올바른 이메일 형식을 입력해주세요." }),
  password: z
    .string()
    .min(6, { message: "비밀번호는 6~20자 사이로 입력해주세요." })
    .max(20, { message: "비밀번호는 6~20자 사이로 입력해주세요." }),
});

export type UserSigninInformation = z.infer<typeof signinSchema>;

export const signupSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: "이메일을 입력해주세요." })
      .email({ message: "올바른 이메일 형식을 입력해주세요." }),
    password: z
      .string()
      .min(6, { message: "비밀번호는 6~20자 사이로 입력해주세요." })
      .max(20, { message: "비밀번호는 6~20자 사이로 입력해주세요." }),
    passwordConfirm: z.string().min(1, { message: "비밀번호를 확인해주세요." }),
    nickname: z.string().min(1, { message: "닉네임을 입력해주세요." }),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    // 비밀번호 일치 여부 검증
    path: ["passwordConfirm"],
    message: "비밀번호가 일치하지 않습니다.",
  });

export type UserSignupInformation = z.infer<typeof signupSchema>;
