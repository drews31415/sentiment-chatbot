import { randomBytes } from "node:crypto";
import type { FastifyInstance, FastifyReply } from "fastify";
import { z } from "zod";

import { env } from "../env.js";
import {
  buildKakaoAuthorizeUrl,
  exchangeKakaoToken,
  fetchKakaoUserInfo,
  KakaoOAuthError,
} from "../lib/kakao.js";
import { upsertKakaoUser } from "../lib/users.js";

const CallbackQuery = z.object({
  code: z.string().optional(),
  state: z.string().optional(),
  error: z.string().optional(),
  error_description: z.string().optional(),
});

function redirectToLoginError(reply: FastifyReply, code: string, reason?: string) {
  const target = new URL(`${env.FRONTEND_URL}/login`);
  target.searchParams.set("error", code);
  if (reason) target.searchParams.set("reason", reason);
  return reply.redirect(target.toString());
}

export async function authRoutes(app: FastifyInstance) {
  app.get("/auth/kakao/login", async (req, reply) => {
    const state = randomBytes(16).toString("hex");
    req.session.set("oauthState", state);
    return reply.redirect(buildKakaoAuthorizeUrl(state));
  });

  app.get("/auth/kakao/callback", async (req, reply) => {
    const parsed = CallbackQuery.safeParse(req.query);
    if (!parsed.success) {
      return redirectToLoginError(reply, "invalid_query");
    }

    const { code, state, error } = parsed.data;

    if (error) return redirectToLoginError(reply, error);
    if (!code) return redirectToLoginError(reply, "missing_code");

    const savedState = req.session.get("oauthState");
    if (!savedState || savedState !== state) {
      return redirectToLoginError(reply, "state_mismatch");
    }
    req.session.set("oauthState", undefined);

    try {
      const tok = await exchangeKakaoToken(code);
      const kakaoUser = await fetchKakaoUserInfo(tok.access_token);
      const user = await upsertKakaoUser(kakaoUser);

      req.session.set("userId", user.id);
      req.session.set("kakaoId", kakaoUser.id);

      req.log.info({ kakaoId: kakaoUser.id, userId: user.id }, "oauth login success");

      return reply.redirect(`${env.FRONTEND_URL}/login/callback`);
    } catch (err) {
      if (err instanceof KakaoOAuthError) {
        req.log.warn({ kakaoCode: err.kakaoCode }, "kakao oauth error");
        return redirectToLoginError(reply, "token_exchange", err.kakaoCode);
      }
      throw err;
    }
  });
}
