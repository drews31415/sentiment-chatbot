import { sql } from "drizzle-orm";
import { pgClient } from "./client.js";

// 개발용 초기화. public 스키마 전체 drop 후 재생성.
// 이후 `npm run db:push && npm run db:seed` 로 복구.
async function main() {
  await pgClient.unsafe("DROP SCHEMA IF EXISTS public CASCADE");
  await pgClient.unsafe("CREATE SCHEMA public");
  await pgClient.unsafe("GRANT ALL ON SCHEMA public TO public");
  console.log("✓ public schema dropped & recreated");
  await pgClient.end();
}

main().catch(async (err) => {
  console.error(err);
  await pgClient.end();
  process.exit(1);
});
