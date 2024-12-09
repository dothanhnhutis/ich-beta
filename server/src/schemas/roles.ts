import * as z from "zod";

const operatorSchema = z.enum([
  "equals",
  "not_equal",
  "greater_than",
  "greater_than_or_equal",
  "less_than",
  "less_than_or_equal",
  "in",
  "not_in",
  "contains",
]);

const baseConditionSchema = z.object({
  attribute: z.string(),
  operator: operatorSchema,
  value: z.union([z.string(), z.number(), z.boolean(), z.string().datetime()]),
});

const conditionSchema: z.ZodTypeAny = z.lazy(() =>
  z.union(
    [
      z.object({ and: z.array(conditionSchema) }),
      z.object({ or: z.array(conditionSchema) }),
      z.object({ not: conditionSchema }),
      baseConditionSchema,
    ],
    {
      errorMap(e, ctx) {
        if (e.code == "invalid_union") {
          if (!ctx.data) return { message: "invalid condition" };
          if ("and" in ctx.data) {
            return {
              message:
                e.unionErrors[e.unionErrors.length - 1].issues[0].message +
                `. Path: [${e.path.join(", ")}]`,
            };
          } else if ("or" in ctx.data) {
            return {
              message:
                e.unionErrors[e.unionErrors.length - 1].issues[0].message +
                `. Path: [${e.path.join(", ")}]`,
            };
          } else if ("not" in ctx.data) {
            return {
              message:
                e.unionErrors[e.unionErrors.length - 1].issues[0].message +
                `. Path: [${e.path.join(", ")}]`,
            };
          }

          return {
            message:
              e.unionErrors[e.unionErrors.length - 1].issues[0].message +
              `. Path: [${e.path.join(", ")}]`,
          };
        }
        return { message: "invalid condition" };
      },
    }
  )
);

export const createRoleSchema = z.object({
  body: z
    .object({
      name: z.string({
        required_error: "name is required",
        invalid_type_error: "name must be string",
      }),
      policies: z.array(
        z
          .object({
            action: z.string({
              required_error: "action is required",
              invalid_type_error: "action must be string",
            }),
            resource: z.string({
              required_error: "resource is required",
              invalid_type_error: "resource must be string",
            }),
            description: z.string({
              required_error: "description is required",
              invalid_type_error: "description must be string",
            }),
            condition: conditionSchema.optional(),
          })
          .strip(),
        {
          required_error: "policies is required",
          invalid_type_error: "policies must be array",
        }
      ),
    })
    .strict(),
});

export type CreateRole = z.infer<typeof createRoleSchema>;