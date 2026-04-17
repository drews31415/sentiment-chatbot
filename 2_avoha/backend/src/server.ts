import Fastify, { type FastifyError, type FastifyInstance } from "fastify";
import fastifyCookie from "@fastify/cookie";
import fastifySecureSession from "@fastify/secure-session";

import { env, isProd } from "./env.js";
import { loggerOptions } from "./logger.js";
import { healthRoutes } from "./routes/health.js";
import { authRoutes } from "./routes/auth.js";
import { meRoutes } from "./routes/me.js";

import "./types/session.js";

export async function buildServer(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: loggerOptions,
    trustProxy: isProd,
  });

  await app.register(fastifyCookie);
  await app.register(fastifySecureSession, {
    key: Buffer.from(env.SESSION_SECRET, "hex"),
    cookieName: "avoha_sid",
    expiry: 60 * 60 * 24 * 7,
    cookie: {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: isProd,
    },
  });

  app.setErrorHandler((err: FastifyError, req, reply) => {
    const status = err.statusCode && err.statusCode >= 400 ? err.statusCode : 500;
    req.log.error({ err }, "unhandled route error");
    reply.status(status).send({
      error: {
        message: status >= 500 ? "Internal Server Error" : err.message,
        code: err.code,
      },
    });
  });

  await app.register(healthRoutes);
  await app.register(authRoutes);
  await app.register(meRoutes);

  return app;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const app = await buildServer();
  await app.listen({ port: env.PORT, host: "0.0.0.0" });
}
