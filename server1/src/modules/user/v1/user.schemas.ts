import * as z from "zod";
import { CookieOptions } from "express";

export const signInSchema = z.object({
  body: z
    .object({
      email: z
        .string({
          required_error: "Email là trường bắt buộc",
          invalid_type_error: "Email phải là chuỗi",
        })
        .email("Email và mật khẩu không hợp lệ"),
      password: z
        .string({
          required_error: "Mật khẩu là trường bắt buộc",
          invalid_type_error: "Mật khẩu phải là chuỗi",
        })
        .min(8, "Email và mật khẩu không hợp lệ")
        .max(40, "Email và mật khẩu không hợp lệ"),
    })
    .strict(),
});

export const signUpSchema = z.object({
  body: z
    .object({
      username: z.string({
        required_error: "username là trường bắt buộc",
        invalid_type_error: "username phải là chuỗi",
      }),
      email: z
        .string({
          required_error: "Email là trường bắt buộc",
          invalid_type_error: "Email phải là chuỗi",
        })
        .email("Email không hợp lệ"),
      password: z
        .string({
          required_error: "Mật khẩu là bắt buộc",
          invalid_type_error: "Mật khẩu phải là chuỗi",
        })
        .min(8, "Mật khẩu quá ngắn")
        .max(40, "Mật khẩu quá dài")
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]*$/,
          "Mật khẩu phải có ký tự hoa, thường, sô và ký tự đặc biệt"
        ),
      confirmPassword: z.string({
        required_error: "Xác nhận mật khẩu là bắt buộc",
        invalid_type_error: "Xác nhận mật khẩu phải là chuỗi",
      }),
    })
    .strict()
    .refine((data) => data.confirmPassword == data.password, {
      message: "Xác nhận mật khẩu không khớp",
      path: ["confirmPassword"],
    }),
});

export const setupMFASchema = z.object({
  body: z
    .object({
      deviceName: z
        .string({
          invalid_type_error: "Tên thiết ghi nhớ phải là chuỗi",
          required_error: "Tên thiết ghi nhớ phải bắt buộc",
        })
        .max(128, "Tên thiết ghi nhớ tối đa 128 ký tự")
        .regex(
          /^[\d\w+=,.@\-_][\d\w\s+=,.@\-_]*$/,
          "Tên thiết ghi nhớ không được chứa các ký tự đăc biệt ngoài ký tự này '=,.@-_'"
        ),
    })
    .strict(),
});

export type SignInReq = z.infer<typeof signInSchema>;
export type SignUpReq = z.infer<typeof signUpSchema>;

export type SetupMFAReq = z.infer<typeof setupMFASchema>;

type UserStatus = "ACTIVE" | "SUSPENDED" | "DISABLED";
type UserGender = "MALE" | "FEMALE" | "OTHER" | null;

export type User = {
  id: string;
  email: string;
  emailVerified: boolean;
  status: UserStatus;
  password: string | null;
  username: string;
  birthDate: string | null;
  gender: UserGender;
  picture: string | null;
  phoneNumber: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type UserAttributeFilterProps = User & {
  emailVerificationExpires: Date | null;
  emailVerificationToken: string | null;
  passwordResetToken: string | null;
  passwordResetExpires: Date | null;
  reActiveToken: string | null;
  reActiveExpires: Date | null;
};

export type UpdateUser = Partial<
  Omit<UserAttributeFilterProps, "id" | "createdAt" | "updatedAt"> & {
    roleIds: string[];
  }
>;

export type MFA = {
  userId: string;
  secretKey: string;
  lastAccess: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type SessionData = {
  id: string;
  userId: string;
  cookie: CookieOptions;
  reqInfo: {
    ip: string;
    userAgent: UAParser.IResult;
    userAgentRaw: string;
    lastAccess: Date;
    createAt: Date;
  };
};

export type CreateSession = {
  userId: string;
  reqInfo: {
    ip: string;
    userAgentRaw: string;
  };
  cookie?: CookieOptions;
};

export type UserToken = {
  type: "email-verification" | "account-recovery" | "reactivate-account";
  session: string;
};

export type CreateUserWithPassword = {
  username: string;
  email: string;
  password: string;
  emailVerificationExpires: Date;
  emailVerificationToken: string;
  status?: User["status"];
  gender?: User["gender"];
  picture?: string;
  phoneNumber?: string;
  birthDate?: string;
};
