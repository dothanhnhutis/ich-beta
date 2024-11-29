import * as z from "zod";

export const signInSchema = z
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
  .strict();

export const signInWithMFASchema = z.object({
  sessionId: z.string({
    required_error: "sessionId là trường bắt buộc",
    invalid_type_error: "sessionId phải là chuỗi",
  }),
  isBackupCode: z
    .boolean({
      required_error: "isBackupCode là trường bắt buộc",
      invalid_type_error: "isBackupCode phải là chuỗi",
    })
    .default(false),
  code: z
    .string({
      required_error: "code là trường bắt buộc",
      invalid_type_error: "code phải là chuỗi",
    })
    .length(6, "code không hợp lệ"),
});

export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string({
        required_error: "Mật khẩu mới là bắt buộc",
        invalid_type_error: "Mật khẩu mới phải là chuỗi",
      })
      .min(8, "Mật khẩu mới quá ngắn")
      .max(40, "Mật khẩu mới quá dài")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]*$/,
        "Mật khẩu mới phải có ký tự hoa, thường, sô và ký tự đặc biệt"
      ),
    confirmPassword: z.string({
      required_error: "Xác nhận mật khẩu là bắt buộc",
      invalid_type_error: "Xác nhận mật khẩu phải là chuỗi",
    }),
  })
  .strict()
  .refine((data) => data.confirmPassword == data.newPassword, {
    message: "Xác nhận mật khẩu không khớp",
    path: ["confirmPassword"],
  });

export const recoverSchema = z.object({
  email: z
    .string({
      required_error: "Email là trường bắt buộc",
      invalid_type_error: "Email phải là chuỗi",
    })
    .email("Email không hợp lệ"),
});

export const signUpSchema = z
  .object({
    username: z
      .string({
        required_error: "Tên là trường bắt buộc",
        invalid_type_error: "Tên phải là chuỗi",
      })
      .min(1, "Tên không được bỏ trống"),
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
  });

export type SignIn = z.infer<typeof signInSchema>;
export type SignInMFA = z.infer<typeof signInWithMFASchema>;
export type ResetPassword = z.infer<typeof resetPasswordSchema>;
export type Recover = z.infer<typeof recoverSchema>;
export type SignUp = z.infer<typeof signUpSchema>;
