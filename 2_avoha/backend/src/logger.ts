import type { FastifyServerOptions } from "fastify";
import { isProd } from "./env.js";

export const loggerOptions: FastifyServerOptions["logger"] = {
  level: isProd ? "info" : "debug",
  redact: {
    paths: [
      "req.headers.cookie",
      "req.headers.authorization",
      "res.headers['set-cookie']",
    ],
    remove: false,
  },
  ...(isProd
    ? {}
    : {
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "HH:MM:ss.l",
            ignore: "pid,hostname",
          },
        },
      }),
};
