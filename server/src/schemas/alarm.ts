import * as z from "zod";

export const createAlarmSchema = z.object({
  body: z.object({
    time: z.string(),
    label: z.string(),
    enable: z.boolean(),
    repeat: z.array(z.string()),
    departments: z.array(z.string()),
  }),
});

export type CreateAlarm = z.infer<typeof createAlarmSchema>;
