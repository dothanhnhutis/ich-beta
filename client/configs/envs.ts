import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_SESSION_KEY: z.string(),
  NEXT_GOOGLE_MAP_KEY: z.string().default(""),
  NEXT_PUBLIC_SERVER_URL: z.string(),
  NEXT_PUBLIC_WS_SERVER_URL: z.string(),
  NEXT_PUBLIC_CLIENT_URL: z.string(),
  NEXT_PUBLIC_LOGO_IMAGE_URL: z.string(),
  NEXT_PUBLIC_COMPANY_IMAGE_URL: z.string(),
  NEXT_PUBLIC_COVER_PHOTO_URL: z.string(),
  NEXT_PUBLIC_PHOTO_URL: z.string(),
  NEXT_PUBLIC_JWT_SECRET: z.string(),
});

const configParser = envSchema.safeParse({
  NEXT_PUBLIC_SESSION_KEY: process.env.NEXT_PUBLIC_SESSION_KEY,
  NEXT_GOOGLE_MAP_KEY: process.env.NEXT_GOOGLE_MAP_KEY,
  NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL,
  NEXT_PUBLIC_WS_SERVER_URL: process.env.NEXT_PUBLIC_WS_SERVER_URL,
  NEXT_PUBLIC_CLIENT_URL: process.env.NEXT_PUBLIC_CLIENT_URL,
  NEXT_PUBLIC_LOGO_IMAGE_URL: process.env.NEXT_PUBLIC_LOGO_IMAGE_URL,
  NEXT_PUBLIC_COMPANY_IMAGE_URL: process.env.NEXT_PUBLIC_COMPANY_IMAGE_URL,
  NEXT_PUBLIC_COVER_PHOTO_URL: process.env.NEXT_PUBLIC_COVER_PHOTO_URL,
  NEXT_PUBLIC_PHOTO_URL: process.env.NEXT_PUBLIC_PHOTO_URL,
  NEXT_PUBLIC_JWT_SECRET: process.env.NEXT_PUBLIC_JWT_SECRET,
});

if (!configParser.success) {
  console.error(configParser.error.issues);
  throw new Error("The values ​in the env file are invalid");
}

const configs = configParser.data;
export default configs;
