import * as z from "zod";
import { Department } from "./department";

export const createDisplaySchema = z.object({
  body: z
    .object({
      content: z.string({
        required_error: "content is required",
        invalid_type_error: "content must be string",
      }),
      enable: z
        .boolean({
          required_error: "enable is required",
          invalid_type_error: "enable must be boolean",
        })
        .default(true),
      priority: z
        .number({
          required_error: "priority is required",
          invalid_type_error: "priority must be interger",
        })
        .min(0, "priority minimun 0")
        .max(100, "priority maximun 100")
        .default(0),
      departmentIds: z
        .array(
          z.string({
            invalid_type_error: "departmentIds item must be string",
          }),
          {
            required_error: "departmentIds is required",
            invalid_type_error: "departmentIds must be array string",
          }
        )
        .nonempty("departmentIds can not empty"),
    })
    .strict(),
});

export const updateDisplayByIdSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
  body: z
    .object({
      content: z.string({
        required_error: "content is required",
        invalid_type_error: "content must be string",
      }),
      enable: z
        .boolean({
          required_error: "enable is required",
          invalid_type_error: "enable must be boolean",
        })
        .default(true),
      priority: z
        .number({
          required_error: "priority is required",
          invalid_type_error: "priority must be interger",
        })
        .min(0, "priority minimun 0")
        .max(100, "priority maximun 100")
        .default(0),
      departmentIds: z.array(
        z.string({
          invalid_type_error: "departmentIds item must be string",
        }),
        {
          required_error: "departmentIds is required",
          invalid_type_error: "departmentIds must be array string",
        }
      ),
    })
    .strip()
    .partial(),
});

export const queryDisplaysSchema = z
  .object({
    enable: z
      .union([z.string(), z.array(z.string())])
      .optional()
      .transform((v) => {
        if (v === undefined) return;
        const regex = /true|false|0|1/;
        const data = Array.isArray(v) ? v[v.length - 1] : v;
        if (!regex.test(data)) return;
        return data === "true" || data == "1" ? true : false;
      }),
    priority: z
      .union([z.string(), z.array(z.string())])
      .optional()
      .transform((v) => {
        if (
          Array.isArray(v) &&
          v.length == 2 &&
          /\d+/.test(v[0]) &&
          /\d+/.test(v[1]) &&
          parseInt(v[0]) >= 0 &&
          parseInt(v[1]) >= parseInt(v[0])
        )
          return [parseInt(v[0]), parseInt(v[1])];
        if (typeof v === "string" && /\d+/.test(v) && parseInt(v) >= 0)
          return parseInt(v);
        return undefined;
      }),
    createdAt: z
      .union([z.string(), z.array(z.string())])
      .optional()
      .transform((v) => {
        if (!Array.isArray(v)) return;
        const dateSchema = z.string().datetime();
        if (
          v.length == 2 &&
          dateSchema.safeParse(v[0]).success &&
          dateSchema.safeParse(v[1]).success &&
          new Date(v[0]).getTime() <= new Date(v[1]).getTime()
        )
          return [v[0], v[1]];
      }),

    orderBy: z
      .union([z.string(), z.array(z.string())])
      .optional()
      .transform((v) => {
        const regex = /^(createdAt|updatedAt|priority|enable)\.(asc|desc)$/;
        if (typeof v === "string" && regex.test(v)) {
          const data = v.split(".");
          return [
            {
              [data[0]]: data[1],
            },
          ];
        }

        if (Array.isArray(v)) {
          return v
            .filter((v) => regex.test(v))
            .map((data) => {
              const dataSplit = data.split(".");
              return {
                [dataSplit[0]]: dataSplit[1],
              };
            });
        }
      }),

    take: z
      .union([z.string(), z.array(z.string())])
      .optional()
      .transform((v) => {
        if (typeof v !== "string") return;
        const regex = /\d+/;
        const data = Array.isArray(v) ? v[v.length - 1] : v;
        if (!regex.test(data) || parseInt(data) < 0) return;
        return parseInt(data);
      }),
    page: z
      .union([z.string(), z.array(z.string())])
      .optional()
      .transform((v) => {
        if (typeof v !== "string") return;
        const regex = /\d+/;
        const data = Array.isArray(v) ? v[v.length - 1] : v;
        if (!regex.test(data) || parseInt(data) <= 0) return;
        return parseInt(data);
      }),
  })
  .strip()
  .partial()
  .transform((v) => {
    for (const key in v) {
      if (v[key as keyof typeof v] === undefined)
        delete v[key as keyof typeof v];
    }
    return v;
  });

export type QueryDisplay = z.infer<typeof queryDisplaysSchema>;

export type CreateDisplayReq = z.infer<typeof createDisplaySchema>;
export type UpdateDisplayByIdReq = z.infer<typeof updateDisplayByIdSchema>;
export type Display = {
  id: string;
  content: string;
  enable: boolean;
  priority: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  departments: Department[];
};
