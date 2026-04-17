import { and, eq } from "drizzle-orm";
import { db } from "../db/client.js";
import { collectionTickets } from "../db/schema.js";

const KST_FORMATTER = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Seoul",
});

function todayKst(): string {
  return KST_FORMATTER.format(new Date());
}

export async function getTodayTickets(
  userId: string,
): Promise<{ date: string; remaining: number }> {
  const today = todayKst();

  const [inserted] = await db
    .insert(collectionTickets)
    .values({ userId, date: today, remaining: 5 })
    .onConflictDoNothing()
    .returning();

  if (inserted) {
    return { date: today, remaining: inserted.remaining };
  }

  const [existing] = await db
    .select()
    .from(collectionTickets)
    .where(
      and(eq(collectionTickets.userId, userId), eq(collectionTickets.date, today)),
    )
    .limit(1);

  if (!existing) {
    throw new Error("collection_tickets row missing after upsert");
  }
  return { date: today, remaining: existing.remaining };
}
