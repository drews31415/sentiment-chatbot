import { sql } from "drizzle-orm";
import { db } from "../db/client.js";
import { users } from "../db/schema.js";
import type { KakaoUserInfo } from "./kakao.js";

export async function upsertKakaoUser(
  kakaoUser: KakaoUserInfo,
): Promise<{ id: string; kakaoId: number }> {
  const profile = kakaoUser.kakao_account?.profile;
  const [row] = await db
    .insert(users)
    .values({
      kakaoId: kakaoUser.id,
      nickname: profile?.nickname ?? "아보하 친구",
      profileUrl: profile?.is_default_image ? null : (profile?.profile_image_url ?? null),
      consentVersion: "v2026.04",
    })
    .onConflictDoUpdate({
      target: users.kakaoId,
      set: {
        nickname: sql`excluded.nickname`,
        profileUrl: sql`excluded.profile_url`,
      },
    })
    .returning({ id: users.id, kakaoId: users.kakaoId });

  if (!row) {
    throw new Error("users upsert returned no rows");
  }
  return { id: row.id, kakaoId: row.kakaoId };
}
