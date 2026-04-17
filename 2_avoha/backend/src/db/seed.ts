import { sql } from "drizzle-orm";
import { db, pgClient } from "./client.js";
import { emotions } from "./schema.js";
import { EMOTIONS_SEED } from "./seeds/emotions.js";

async function seedEmotions() {
  await db
    .insert(emotions)
    .values(EMOTIONS_SEED)
    .onConflictDoUpdate({
      target: emotions.code,
      set: {
        nameKo: sql`excluded.name_ko`,
        category: sql`excluded.category`,
        gemName: sql`excluded.gem_name`,
        hexColor: sql`excluded.hex_color`,
        triggerKeywords: sql`excluded.trigger_keywords`,
      },
    });
  console.log(`✓ emotions: ${EMOTIONS_SEED.length} rows upserted`);
}

async function main() {
  await seedEmotions();
  // recipes: PRD v1.1 에 따라 재설계 대기 상태 → 시드 skip
  await pgClient.end();
}

main().catch(async (err) => {
  console.error(err);
  await pgClient.end();
  process.exit(1);
});
