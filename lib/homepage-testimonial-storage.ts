import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

export type HomepageTestimonial = {
  id: string;
  name: string;
  quote: string;
  imageUrl: string;
  sortOrder: number;
  isActive: boolean;
  updatedAt: string;
};

type StorageShape = {
  items: HomepageTestimonial[];
};

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "homepage-testimonials.json");

async function ensureDataDir() {
  await mkdir(DATA_DIR, { recursive: true });
}

function normalizeItem(
  item: Partial<HomepageTestimonial>,
  index: number,
): HomepageTestimonial {
  return {
    id: String(item.id || `${Date.now()}-${index}`),
    name: String(item.name || "").trim(),
    quote: String(item.quote || "").trim(),
    imageUrl: String(item.imageUrl || "").trim(),
    sortOrder: Number.isFinite(item.sortOrder) ? Number(item.sortOrder) : index,
    isActive: item.isActive ?? true,
    updatedAt:
      typeof item.updatedAt === "string"
        ? item.updatedAt
        : new Date().toISOString(),
  };
}

export async function readHomepageTestimonials(): Promise<
  HomepageTestimonial[]
> {
  try {
    const raw = await readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw) as Partial<StorageShape>;
    const items = Array.isArray(parsed.items) ? parsed.items : [];

    return items
      .map((item, index) => normalizeItem(item, index))
      .sort((a, b) => a.sortOrder - b.sortOrder);
  } catch {
    return [];
  }
}

export async function readActiveHomepageTestimonials(): Promise<
  HomepageTestimonial[]
> {
  const items = await readHomepageTestimonials();
  return items.filter((item) => item.isActive);
}

export async function saveHomepageTestimonials(
  input: Array<
    Pick<HomepageTestimonial, "name" | "quote" | "imageUrl" | "isActive">
  >,
): Promise<void> {
  await ensureDataDir();

  const normalized = input.map((item, index) => {
    const name = String(item.name || "").trim();
    const quote = String(item.quote || "").trim();
    const imageUrl = String(item.imageUrl || "").trim();

    if (!name) {
      throw new Error(`Nhận xét #${index + 1} chưa có tên khách hàng.`);
    }
    if (!quote) {
      throw new Error(`Nhận xét #${index + 1} chưa có nội dung.`);
    }
    if (!imageUrl) {
      throw new Error(`Nhận xét #${index + 1} chưa có hình khách hàng.`);
    }

    return {
      id: `${Date.now()}-${index}`,
      name,
      quote,
      imageUrl,
      sortOrder: index,
      isActive: item.isActive ?? true,
      updatedAt: new Date().toISOString(),
    } satisfies HomepageTestimonial;
  });

  const payload: StorageShape = { items: normalized };
  await writeFile(DATA_FILE, JSON.stringify(payload, null, 2), "utf8");
}
