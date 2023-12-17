import { NextResponse } from "next/server";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { sql } from "drizzle-orm";

/*
  POST /api/supabase/verify
  Verifies if the given url is a valid postgres connection string
  {
    url: string,
  }
*/
export async function POST(req: Request) {
  const { url } = await req.json();

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

  return NextResponse.json({ message: "Connection successful" });
}
