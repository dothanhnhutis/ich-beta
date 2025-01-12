import { alarmTimeRegex, timersTimeRegex } from "@/configs/constants";
import * as z from "zod";

export const createAlarmSchema = z.object({
  body: z
    .object({
      time: z
        .string({
          required_error: "Thời gian báo động là bất buộc",
          invalid_type_error: "Thời gian báo động phải là chuỗi",
        })
        .refine((v) => alarmTimeRegex.test(v), {
          message: "Thời gian báo động không hợp lệ",
        }),
      label: z
        .string({
          required_error: "Nhãn báo động là bất buộc",
          invalid_type_error: "Nhãn báo động phải là chuỗi",
        })
        .default(""),
      enable: z
        .boolean({
          required_error: "Bật tắt báo động là bất buộc",
          invalid_type_error: "Bật tắt báo động là true/false",
        })
        .default(true),
      repeat: z
        .array(
          z
            .string({
              invalid_type_error: "Lập lại báo động là chuỗi",
            })
            .refine(
              (value) =>
                ["t2", "t3", "t4", "t5", "t6", "t7", "cn"].includes(value),
              {
                message:
                  "Lập lại báo động phải là mảng các giá trị 't2, t3, t4, t5, t6, t7, cn'",
              }
            ),
          {
            required_error: "Lập lại báo động là bất buộc",
            invalid_type_error: "Lập lại báo động phải là mãng",
          }
        )
        .default([]),
      departmentIds: z
        .array(
          z.string({
            invalid_type_error: "Mã phòng là chuỗi",
          }),
          {
            required_error: "Phòng ban là bất buộc",
            invalid_type_error: "Phòng ban là mảng chuỗi",
          }
        )
        .nonempty("Phòng ban không được bỏ trống"),
    })
    .strict(),
});

export type CreateAlarmReq = z.infer<typeof createAlarmSchema>;
export type CreateAlarmData = CreateAlarmReq["body"] & {
  userId: string;
};

export type Alarm = {
  time: string;
  label: string;
  enable: boolean;
  repeat: string[];
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
};

export const createTimerSchema = z.object({
  body: z.object({
    time: z
      .string({
        required_error: "Thời gian hẹn giờ là bất buộc",
        invalid_type_error: "Thời gian hẹn giờ phải là chuỗi",
      })
      .refine((v) => timersTimeRegex.test(v), {
        message: "Thời gian hẹn giờ không hợp lệ",
      }),
    label: z.string({
      required_error: "Nhãn báo động là bất buộc",
      invalid_type_error: "Nhãn báo động phải là chuỗi",
    }),
    status: z.enum(["pause", "proceed"], {
      invalid_type_error: "Trạng thái hẹn giờ phải là 'pause' hoặc 'proceed'",
      required_error: "Trạng thái hẹn giờ là bất buộc",
    }),
    departmentIds: z
      .array(
        z.string({
          invalid_type_error: "Mã phòng là chuỗi",
        }),
        {
          required_error: "Phòng ban không được trống",
          invalid_type_error: "Phòng ban là mảng chuỗi",
        }
      )
      .nonempty("Phòng ban không được bỏ trống"),
  }),
});

export type CreateTimer = z.infer<typeof createTimerSchema>;
export type CreateTimerData = CreateTimer["body"] & {
  userId: string;
};
