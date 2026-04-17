import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().optional(),
  POSTGRES_URL: z.string().optional(),
  POSTGRES_PRISMA_URL: z.string().optional(),
  POSTGRES_URL_NON_POOLING: z.string().optional(),
  NEON_DATABASE_URL: z.string().optional(),
  STRAPI_URL: z.string().url().default("http://localhost:1337"),
  STRAPI_TOKEN: z.string().optional().default(""),
  NEXT_PUBLIC_SITE_URL: z.string().url().default("https://icepdesign.vn"),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().optional().default(60000),
  RATE_LIMIT_MAX: z.coerce.number().optional().default(120),
});

export const env = envSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  POSTGRES_URL: process.env.POSTGRES_URL,
  POSTGRES_PRISMA_URL: process.env.POSTGRES_PRISMA_URL,
  POSTGRES_URL_NON_POOLING: process.env.POSTGRES_URL_NON_POOLING,
  NEON_DATABASE_URL: process.env.NEON_DATABASE_URL,
  STRAPI_URL: process.env.STRAPI_URL,
  STRAPI_TOKEN: process.env.STRAPI_TOKEN,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  RATE_LIMIT_WINDOW_MS: process.env.RATE_LIMIT_WINDOW_MS,
  RATE_LIMIT_MAX: process.env.RATE_LIMIT_MAX,
});
