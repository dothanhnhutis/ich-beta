import * as z from "zod";

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

export const signInWithMFASchema = z.object({
  body: z
    .object({
      sessionId: z.string({
        required_error: "sessionId là trường bắt buộc",
        invalid_type_error: "sessionId phải là chuỗi",
      }),
      code: z
        .string({
          required_error: "code là trường bắt buộc",
          invalid_type_error: "code phải là chuỗi",
        })
        .length(6, "code không hợp lệ"),
    })
    .strict(),
});

export const recoverSchema = z.object({
  body: z
    .object({
      email: z
        .string({
          required_error: "Email là trường bắt buộc",
          invalid_type_error: "Email phải là chuỗi",
        })
        .email("Email không hợp lệ"),
    })
    .strict(),
});

export const resetPasswordSchema = z.object({
  query: z.object({
    token: z.union([z.string(), z.array(z.string())]).optional(),
  }),
  body: z
    .object({
      newPassword: z
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
      confirmPassword: z.string(),
    })
    .strict()
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: "Xác nhận mật khẩu không khớp",
      path: ["confirmPassword"],
    }),
});

export const sendReActivateAccountSchema = z.object({
  body: z
    .object({
      email: z
        .string({
          required_error: "Email là trường bắt buộc",
          invalid_type_error: "Email phải là chuỗi",
        })
        .email("Email không hợp lệ"),
    })
    .strict(),
});

export type SignUpReq = z.infer<typeof signUpSchema>;
export type SignInReq = z.infer<typeof signInSchema>;
export type SignInWithMFAReq = z.infer<typeof signInWithMFASchema>;
export type RecoverReq = z.infer<typeof recoverSchema>;
export type ResetPasswordReq = z.infer<typeof resetPasswordSchema>;
export type SendReActivateAccountReq = z.infer<
  typeof sendReActivateAccountSchema
>;
