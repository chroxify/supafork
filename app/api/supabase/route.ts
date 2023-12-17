import { NextResponse } from "next/server";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { sql } from "drizzle-orm";
import fs from "fs";

/**
 * POST /api/supabase
 * Migrate given migrations
 * {
 *  url: string,
 *  migrations: {
 *   encoding: string,
 *   content: string,
 *  }[]
 * }
 */
export async function POST(req: Request) {
  const { url, migrations } = (await req.json()) as {
    url: string;
    migrations: { encoding: string; content: string }[];
  };

  // Disable prefetch as it is not supported for "Transaction" pool mode
  const client = postgres(url, { prepare: false });

  // Initialize drizzle
  const db = drizzle(client);

  // Check if connection is successful
  try {
    await db.execute(sql`SELECT NOW()`);
  } catch (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  // Run migrations
  migrations.forEach(async (migration) => {
    // Decode the migration content
    const decodedContent = Buffer.from(
      migration.content,
      migration.encoding as BufferEncoding,
    ).toString();

    // Execute the migration
    await db.execute(sql.raw(decodedContent));
  });

  return NextResponse.json({ message: "Migration successful" });
}
