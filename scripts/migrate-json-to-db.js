#!/usr/bin/env node
/**
 * Simple migration script to import homepage testimonials and hot topic
 * settings from JSON files into the PostgreSQL database.
 *
 * Usage:
 *   DATABASE_URL="postgres://..." node scripts/migrate-json-to-db.js
 */

import fs from "fs/promises";
import path from "path";
import { Pool } from "pg";

const DATA_DIR = path.join(process.cwd(), "data");
const TESTIMONIALS_FILE = path.join(DATA_DIR, "homepage-testimonials.json");
const HOT_TOPIC_FILE = path.join(DATA_DIR, "hot-blog-topic.json");

async function main() {
  const databaseUrl = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;
  if (!databaseUrl) {
    console.error(
      "Please set DATABASE_URL or NEON_DATABASE_URL environment variable to your Postgres/Neon connection string.",
    );
    process.exit(1);
  }

  const pool = new Pool({ connectionString: databaseUrl });

  try {
    // Create tables if missing (minimal DDL for migration)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS homepage_testimonials (
        id SERIAL PRIMARY KEY,
        external_id TEXT,
        name TEXT NOT NULL,
        quote TEXT NOT NULL,
        image_url TEXT NOT NULL,
        sort_order INTEGER NOT NULL DEFAULT 0,
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS homepage_hot_topics (
        id SERIAL PRIMARY KEY,
        topic_slug TEXT NOT NULL,
        topic_label TEXT NOT NULL,
        banner_image_urls TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    // Migrate testimonials
    try {
      const raw = await fs.readFile(TESTIMONIALS_FILE, "utf8");
      const parsed = JSON.parse(raw);
      const items = Array.isArray(parsed.items) ? parsed.items : [];

      await pool.query("BEGIN");
      await pool.query("TRUNCATE TABLE homepage_testimonials RESTART IDENTITY");

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const externalId = String(item.id || `${Date.now()}-${i}`);
        const name = String(item.name || "").trim();
        const quote = String(item.quote || "").trim();
        const imageUrl = String(item.imageUrl || "").trim();
        const sortOrder = Number.isFinite(item.sortOrder)
          ? Number(item.sortOrder)
          : i;
        const isActive = item.isActive === undefined ? true : !!item.isActive;

        await pool.query(
          `INSERT INTO homepage_testimonials (external_id, name, quote, image_url, sort_order, is_active, updated_at) VALUES ($1,$2,$3,$4,$5,$6,$7)`,
          [
            externalId,
            name,
            quote,
            imageUrl,
            sortOrder,
            isActive,
            item.updatedAt || new Date().toISOString(),
          ],
        );
      }

      await pool.query("COMMIT");
      console.log(`Migrated ${items.length} testimonials`);
    } catch (err) {
      console.warn(
        "No testimonials JSON found or failed to migrate:",
        err.message || err,
      );
    }

    // Migrate hot blog topic
    try {
      const raw = await fs.readFile(HOT_TOPIC_FILE, "utf8");
      const parsed = JSON.parse(raw);
      if (parsed && parsed.topicSlug && parsed.topicLabel) {
        const urls = Array.isArray(parsed.bannerImageUrls)
          ? parsed.bannerImageUrls.filter((u) => typeof u === "string")
          : typeof parsed.bannerImageUrl === "string"
            ? [parsed.bannerImageUrl]
            : [];

        await pool.query("BEGIN");
        await pool.query("TRUNCATE TABLE homepage_hot_topics RESTART IDENTITY");
        await pool.query(
          `INSERT INTO homepage_hot_topics (topic_slug, topic_label, banner_image_urls, updated_at) VALUES ($1,$2,$3,$4)`,
          [
            parsed.topicSlug,
            parsed.topicLabel,
            urls,
            parsed.updatedAt || new Date().toISOString(),
          ],
        );
        await pool.query("COMMIT");
        console.log("Migrated hot blog topic settings");
      } else {
        console.log("No valid hot blog topic settings found in JSON");
      }
    } catch (err) {
      console.warn(
        "No hot-blog-topic JSON found or failed to migrate:",
        err.message || err,
      );
    }

    console.log("Migration finished.");
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
