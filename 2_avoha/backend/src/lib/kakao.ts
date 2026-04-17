import { env } from "../env.js";

const KAUTH_BASE = "https://kauth.kakao.com";
const KAPI_BASE = "https://kapi.kakao.com";

type KakaoTokenResponse = {
  access_token: string;
  token_type: "bearer";
  refresh_token: string;
  expires_in: number;
  scope: string;
  refresh_token_expires_in: number;
};

export type KakaoUserInfo = {
  id: number;
  kakao_account?: {
    profile?: {
      nickname?: string;
      profile_image_url?: string;
      is_default_image?: boolean;
    };
  };
};

export class KakaoOAuthError extends Error {
  constructor(
    public kakaoCode: string,
    public kakaoMessage: string,
  ) {
    super(`${kakaoCode}: ${kakaoMessage}`);
  }
}

export function buildKakaoAuthorizeUrl(state: string): string {
  const url = new URL(`${KAUTH_BASE}/oauth/authorize`);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", env.KAKAO_REST_API_KEY);
  url.searchParams.set("redirect_uri", env.KAKAO_REDIRECT_URI);
  url.searchParams.set("state", state);
  url.searchParams.set("scope", "profile_nickname,profile_image");
  return url.toString();
}

export async function exchangeKakaoToken(code: string): Promise<KakaoTokenResponse> {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: env.KAKAO_REST_API_KEY,
    client_secret: env.KAKAO_CLIENT_SECRET,
    redirect_uri: env.KAKAO_REDIRECT_URI,
    code,
  });
  const res = await fetch(`${KAUTH_BASE}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
    body,
  });
  const data = (await res.json()) as Record<string, unknown>;
  if (!res.ok) {
    throw new KakaoOAuthError(
      (data.error as string) ?? String(res.status),
      (data.error_description as string) ?? "unknown",
    );
  }
  return data as unknown as KakaoTokenResponse;
}

export async function fetchKakaoUserInfo(accessToken: string): Promise<KakaoUserInfo> {
  const res = await fetch(`${KAPI_BASE}/v2/user/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
    throw new KakaoOAuthError(
      (data.code as string) ?? String(res.status),
      (data.msg as string) ?? "user_info_failed",
    );
  }
  return (await res.json()) as KakaoUserInfo;
}
