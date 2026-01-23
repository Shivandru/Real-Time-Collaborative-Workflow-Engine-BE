import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  MONGO_DB_URI: z.string().min(1),
  MONGO_DB_NAME: z.string().min(1),
  PORT: z.coerce.number().int().min(1).max(65535).default(4000),
  SALT_ROUND: z.coerce.number(),
  JWT_SECRET: z.string()
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
    console.error("Environment validation error: ", parsedEnv.error.message);
    process.exit(1);
}

export const env = parsedEnv.data;
