import { Pool } from "pg";
import { env } from "@/lib/env";

declare global {
  // eslint-disable-next-line no-var
  var __icepPgPool: any | undefined;
}

function resolveDatabaseUrl() {
  return (
    env.DATABASE_URL ||
    env.NEON_DATABASE_URL ||
    env.POSTGRES_URL ||
    env.POSTGRES_PRISMA_URL ||
    env.POSTGRES_URL_NON_POOLING ||
    process.env.DATABASE_URL ||
    process.env.NEON_DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL_NON_POOLING ||
    ""
  );
}

function createPool(databaseUrl: string) {
  if (!databaseUrl) {
    throw new Error(
      "No PostgreSQL connection string found. Please set one of: DATABASE_URL, NEON_DATABASE_URL, POSTGRES_URL, POSTGRES_PRISMA_URL, POSTGRES_URL_NON_POOLING.",
    );
  }

  return new Pool({
    connectionString: databaseUrl,
    ssl: databaseUrl.includes("sslmode=require")
      ? { rejectUnauthorized: false }
      : undefined,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });
}

export function getDbPool(): any {
  if (!global.__icepPgPool) {
    const databaseUrl = resolveDatabaseUrl();
    global.__icepPgPool = createPool(databaseUrl);
  }

  return global.__icepPgPool;
}

export async function testDbConnection() {
  const client = await getDbPool().connect();
  try {
    const result = await client.query(
      "select now() as now, current_database() as db",
    );
    return result.rows[0];
  } finally {
    client.release();
  }
}
