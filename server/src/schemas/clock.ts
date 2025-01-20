import { alarmTimeRegex, timersTimeRegex } from "@/configs/constants";
import * as z from "zod";
import { Department } from "./department";
import { User } from "./user";

export const createAlarmSchema = z.object({
  body: z
    .object({
      time: z
        .string({
          required_error: "Thời gian báo thức là bất buộc",
          invalid_type_error: "Thời gian báo thức phải là chuỗi",
        })
        .refine((v) => alarmTimeRegex.test(v), {
          message: "Thời gian báo thức không hợp lệ",
        }),
      label: z
        .string({
          required_error: "Nhãn báo thức là bất buộc",
          invalid_type_error: "Nhãn báo thức phải là chuỗi",
        })
        .default(""),
      enable: z
        .boolean({
          required_error: "Bật tắt báo thức là bất buộc",
          invalid_type_error: "Bật tắt báo thức là true/false",
        })
        .default(true),
      repeat: z
        .array(
          z
            .string({
              invalid_type_error: "Lập lại báo thức là chuỗi",
            })
            .refine(
              (value) =>
                ["t2", "t3", "t4", "t5", "t6", "t7", "cn"].includes(value),
              {
                message:
                  "Lập lại báo thức phải là mảng các giá trị 't2, t3, t4, t5, t6, t7, cn'",
              }
            ),
          {
            required_error: "Lập lại báo thức là bất buộc",
            invalid_type_error: "Lập lại báo thức phải là mãng",
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

export const updateAlarmSchema = z.object({
  params: z.object({
    alarmId: z.string(),
  }),
  body: z
    .object({
      time: z
        .string({
          required_error: "Thời gian báo thức là bất buộc",
          invalid_type_error: "Thời gian báo thức phải là chuỗi",
        })
        .refine((v) => alarmTimeRegex.test(v), {
          message: "Thời gian báo thức không hợp lệ",
        }),
      label: z
        .string({
          required_error: "Nhãn báo thức là bất buộc",
          invalid_type_error: "Nhãn báo thức phải là chuỗi",
        })
        .default(""),
      enable: z
        .boolean({
          required_error: "Bật tắt báo thức là bất buộc",
          invalid_type_error: "Bật tắt báo thức là true/false",
        })
        .default(true),
      repeat: z
        .array(
          z
            .string({
              invalid_type_error: "Lập lại báo thức là chuỗi",
            })
            .refine(
              (value) =>
                ["t2", "t3", "t4", "t5", "t6", "t7", "cn"].includes(value),
              {
                message:
                  "Lập lại báo thức phải là mảng các giá trị 't2, t3, t4, t5, t6, t7, cn'",
              }
            ),
          {
            required_error: "Lập lại báo thức là bất buộc",
            invalid_type_error: "Lập lại báo thức phải là mãng",
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
    .strip()
    .partial(),
});

export type CreateAlarmReq = z.infer<typeof createAlarmSchema>;
export type UpdateAlarmReq = z.infer<typeof updateAlarmSchema>;

export type CreateAlarmData = CreateAlarmReq["body"] & {
  userId: string;
};
export type UpdateAlarmData = UpdateAlarmReq["body"];

export type AlarmAttributeFilter = {
  id: string;
  time: string;
  label: string;
  enable: boolean;
  repeat: string[];
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  departmentsAlarms: {
    department: Department;
  }[];
  createdBy: Pick<User, "id" | "email" | "username" | "picture">;
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
  createdBy: Pick<User, "id" | "email" | "username" | "picture">;
  departments: Department[];
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
      required_error: "Nhãn hẹn giờ là bất buộc",
      invalid_type_error: "Nhãn hẹn giờ phải là chuỗi",
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

export type CreateTimerReq = z.infer<typeof createTimerSchema>;
export type CreateTimerData = CreateTimerReq["body"] & {
  userId: string;
};

export type Timer = {
  time: string;
  status: string;
  label: string;
  id: string;
  userId: string;
  createdAt: Date;
};
