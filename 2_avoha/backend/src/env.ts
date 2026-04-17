import { z } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url(),
  KAKAO_REST_API_KEY: z.string().min(1),
  KAKAO_CLIENT_SECRET: z.string().min(1),
  KAKAO_REDIRECT_URI: z.string().url(),
  SESSION_SECRET: z.string().regex(/^[0-9a-f]{64}$/, "must be 64 hex chars (32 bytes)"),
  FRONTEND_URL: z.string().url().default("http://localhost:5173"),
});

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
  const lines = parsed.error.issues.map(
    (i) => `  - ${i.path.join(".") || "(root)"}: ${i.message}`,
  );
  console.error("환경변수 검증 실패:\n" + lines.join("\n"));
  process.exit(1);
}

export const env = parsed.data;
export const isProd = env.NODE_ENV === "production";
