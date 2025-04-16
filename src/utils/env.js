import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    PORT: z.number().int().positive().default(3000),
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
    JWT_SECRET: z.string(),
    CLOUDFLARE_R2_REGION: z.string().default("auto"),
    CLOUDFLARE_R2_ENDPOINT: z.string().url(),
    CLOUDFLARE_R2_ACCESS_KEY_ID: z.string(),
    CLOUDFLARE_R2_SECRET_ACCESS_KEY: z.string(),
    CLOUDFLARE_R2_BUCKET: z.string(),
    CLOUDFLARE_R2_PUBLIC_URL: z.string().url(),
  },

  /**
   * The prefix that client-side variables must have. This is enforced both at
   * a type-level and at runtime.
   */
  // clientPrefix: "PUBLIC_",

  client: {
    // PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
  },

  /**
   * What object holds the environment variables at runtime. This is usually
   * `process.env` or `import.meta.env`.
   */
  runtimeEnv: {
    DATABASE_URL: process.process.env.DATABASE_URL,
    PORT: Number(process.process.env.PORT),
    NODE_ENV: process.process.env.NODE_ENV,
    JWT_SECRET: process.process.env.JWT_SECRET,
    CLOUDFLARE_R2_REGION: process.process.env.CLOUDFLARE_R2_REGION,
    CLOUDFLARE_R2_ENDPOINT: process.process.env.CLOUDFLARE_R2_ENDPOINT,
    CLOUDFLARE_R2_ACCESS_KEY_ID: process.process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    CLOUDFLARE_R2_SECRET_ACCESS_KEY:
      process.process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
    CLOUDFLARE_R2_BUCKET: process.process.env.CLOUDFLARE_R2_BUCKET,
    CLOUDFLARE_R2_PUBLIC_URL: process.process.env.CLOUDFLARE_R2_PUBLIC_URL,
  },

  /**
   * By default, this library will feed the environment variables directly to
   * the Zod validator.
   *
   * This means that if you have an empty string for a value that is supposed
   * to be a number (e.g. `PORT=` in a ".env" file), Zod will incorrectly flag
   * it as a type mismatch violation. Additionally, if you have an empty string
   * for a value that is supposed to be a string with a default value (e.g.
   * `DOMAIN=` in an ".env" file), the default value will never be applied.
   *
   * In order to solve these issues, we recommend that all new projects
   * explicitly specify this option as true.
   */
  emptyStringAsUndefined: true,
});
