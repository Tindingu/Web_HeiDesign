import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

export type HotBlogTopicSettings = {
  topicSlug: string;
  topicLabel: string;
  /** Multiple banner images displayed side-by-side on homepage */
  bannerImageUrls: string[];
  updatedAt: string;
};

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "hot-blog-topic.json");

async function ensureDataDir() {
  await mkdir(DATA_DIR, { recursive: true });
}

export async function readHotBlogTopicSettings(): Promise<HotBlogTopicSettings | null> {
  try {
    const raw = await readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    if (!parsed.topicSlug || !parsed.topicLabel) return null;
    // backward compat: old format used bannerImageUrl (single string)
    let urls: string[] = [];
    if (Array.isArray(parsed.bannerImageUrls)) {
      urls = (parsed.bannerImageUrls as unknown[]).filter(
        (u): u is string => typeof u === "string" && u.length > 0,
      );
    } else if (
      typeof parsed.bannerImageUrl === "string" &&
      parsed.bannerImageUrl
    ) {
      urls = [parsed.bannerImageUrl];
    }
    return {
      topicSlug: String(parsed.topicSlug),
      topicLabel: String(parsed.topicLabel),
      bannerImageUrls: urls,
      updatedAt:
        typeof parsed.updatedAt === "string"
          ? parsed.updatedAt
          : new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export async function saveHotBlogTopicSettings(
  input: Omit<HotBlogTopicSettings, "updatedAt">,
): Promise<HotBlogTopicSettings> {
  await ensureDataDir();
  const payload: HotBlogTopicSettings = {
    topicSlug: input.topicSlug,
    topicLabel: input.topicLabel,
    bannerImageUrls: input.bannerImageUrls ?? [],
    updatedAt: new Date().toISOString(),
  };
  await writeFile(DATA_FILE, JSON.stringify(payload, null, 2), "utf8");
  return payload;
}

export async function clearHotBlogTopicSettings(): Promise<void> {
  await ensureDataDir();
  await writeFile(DATA_FILE, "{}", "utf8");
}
