import { Pool } from "pg";
import { env } from "@/lib/env";

declare global {
  // eslint-disable-next-line no-var
  var __HEIPgPool: any | undefined;
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

  // Allow disabling DB during static build/export to avoid timeouts.
  if (
    env.DISABLE_DB_DURING_BUILD === "true" ||
    process.env.DISABLE_DB_DURING_BUILD === "true"
  ) {
    // Return a minimal no-op pool that won't attempt network connections.
    // This helps `next build`/static export on machines without DB access.
    // NOTE: Calls to this pool should be guarded in production if the DB is required.
    // The returned object provides `query`, `connect`, and `end` stubs.
    return {
      query: async () => ({ rows: [] }),
      connect: async () => {
        const err = new Error(
          "Database access disabled during build (DISABLE_DB_DURING_BUILD=true)",
        );
        // mimic pg PoolClient behavior when connect fails
        throw err;
      },
      end: async () => undefined,
    } as any;
  }

  // Allow opt-in to libpq compatibility via environment variable.
  // If the user sets NEON_USE_LIBPQ_COMPAT=true, we'll append
  // `uselibpqcompat=true&sslmode=require` unless sslmode already present.
  const useLibpq =
    process.env.NEON_USE_LIBPQ_COMPAT === "true" ||
    process.env.USE_LIBPQ_COMPAT === "true" ||
    env.NEON_USE_LIBPQ_COMPAT === "true";

  const forceVerifyFull =
    process.env.FORCE_SSLMODE_VERIFY_FULL === "true" ||
    env.FORCE_SSLMODE_VERIFY_FULL === "true";

  let conn = databaseUrl;
  const hasSslmode = /([?&])sslmode=/.test(conn);
  const hasUseLibpq = /([?&])uselibpqcompat=/.test(conn);

  if (useLibpq && !hasUseLibpq) {
    conn += (conn.includes("?") ? "&" : "?") + "uselibpqcompat=true";
    if (!hasSslmode) {
      conn += "&sslmode=require";
    }
  } else if (forceVerifyFull && !hasSslmode) {
    conn += (conn.includes("?") ? "&" : "?") + "sslmode=verify-full";
  }

  // determine ssl.rejectUnauthorized based on sslmode
  const sslmodeMatch = conn.match(/(?:[?&])sslmode=([^&]+)/);
  const sslmode = sslmodeMatch ? sslmodeMatch[1] : undefined;
  const sslOption =
    sslmode === "require" || sslmode === "prefer" || sslmode === "verify-ca"
      ? { rejectUnauthorized: false }
      : sslmode === "verify-full"
        ? { rejectUnauthorized: true }
        : undefined;

  return new Pool({
    connectionString: conn,
    ssl: sslOption,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
    query_timeout: 15000,
    statement_timeout: 15000,
  });
}

export function getDbPool(): any {
  if (!global.__HEIPgPool) {
    const databaseUrl = resolveDatabaseUrl();
    global.__HEIPgPool = createPool(databaseUrl);
  }

  return global.__HEIPgPool;
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
