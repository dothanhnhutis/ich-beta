import * as z from "zod";
import { Department } from "./department";
import { validDataSchema } from "./user";

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
        const regex = /^(true|false|0|1)$/;
        const data = Array.isArray(v) ? v[v.length - 1] : v;
        if (!regex.test(data)) return;
        return data === "true" || data == "1" ? true : false;
      }),
    priority: z
      .union([z.string(), z.array(z.string())])
      .optional()
      .transform((v) => {
        if (v === undefined) return;
        const data = Array.isArray(v) ? v[v.length - 1] : v;
        if (!/^\d+$/.test(data)) return;
        return parseInt(data);
      }),
    minPriority: z
      .union([z.string(), z.array(z.string())])
      .optional()
      .transform((v) => {
        if (v === undefined) return;
        const data = Array.isArray(v) ? v[v.length - 1] : v;
        if (!/^\d+$/.test(data)) return;
        return parseInt(data);
      }),
    maxPriority: z
      .union([z.string(), z.array(z.string())])
      .optional()
      .transform((v) => {
        if (v === undefined) return;
        const data = Array.isArray(v) ? v[v.length - 1] : v;
        if (!/^\d+$/.test(data)) return;
        return parseInt(data);
      }),

    createdAt: z
      .union([z.string(), z.array(z.string())])
      .optional()
      .transform((v) => {
        if (v === undefined) return;
        const data = Array.isArray(v) ? v[v.length - 1] : v;
        if (!validDataSchema.safeParse(data).success) return;
        const [day, month, year] = data.split("/");
        const isoString = new Date(`${year}-${month}-${day}`).toISOString();
        return [isoString, `${year}-${month}-${day}T23:59:59.999Z`] as [
          string,
          string
        ];
      }),

    createdAtFrom: z
      .union([z.string(), z.array(z.string())])
      .optional()
      .transform((v) => {
        if (v === undefined) return;
        const data = Array.isArray(v) ? v[v.length - 1] : v;
        if (!validDataSchema.safeParse(data).success) return;
        const [day, month, year] = data.split("/");
        return `${year}-${month}-${day}T00:00:00.000Z`;
      }),

    createdAtTo: z
      .union([z.string(), z.array(z.string())])
      .optional()
      .transform((v) => {
        if (v === undefined) return;
        const data = Array.isArray(v) ? v[v.length - 1] : v;
        if (!validDataSchema.safeParse(data).success) return;
        const [day, month, year] = data.split("/");
        return `${year}-${month}-${day}T23:59:59.999Z`;
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
              column: data[0],
              order: data[1],
            },
          ];
        }

        if (Array.isArray(v)) {
          return v
            .filter((v) => regex.test(v))
            .map((data) => {
              const dataSplit = data.split(".");
              return {
                column: dataSplit[0],
                order: dataSplit[1],
              };
            });
        }
      }),

    limit: z
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
