import * as z from "zod";

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

export type CreateDisplayReq = z.infer<typeof createDisplaySchema>;
export type UpdateDisplayByIdReq = z.infer<typeof updateDisplayByIdSchema>;
