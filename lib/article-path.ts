export function normalizeVietnamese(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

export type ArticleTargetSection =
  | "thiet-ke-noi-that"
  | "thi-cong-noi-that"
  | "du-an";

export const INTERIOR_TARGET_OPTIONS = [
  { value: "biet-thu", label: "Thiết kế nội thất biệt thự" },
  { value: "chung-cu", label: "Thiết kế nội thất chung cư" },
  { value: "nha-pho", label: "Thiết kế nội thất nhà phố" },
  { value: "penthouse", label: "Thiết kế nội thất penthouse, duplex" },
  { value: "van-phong", label: "Thiết kế nội thất văn phòng" },
  { value: "khach-san", label: "Thiết kế nội thất khách sạn" },
  { value: "nha-hang", label: "Thiết kế nội thất nhà hàng" },
  { value: "cafe", label: "Thiết kế nội thất quán cafe" },
  { value: "showroom", label: "Thiết kế nội thất showroom" },
] as const;

export const CONSTRUCTION_TARGET_OPTIONS = [
  { value: "biet-thu", label: "Thi công nội thất biệt thự" },
  { value: "chung-cu", label: "Thi công nội thất chung cư" },
  { value: "nha-pho", label: "Thi công nội thất nhà phố" },
  { value: "van-phong", label: "Thi công nội thất văn phòng" },
] as const;

export const DU_AN_TARGET_OPTIONS = [
  { value: "nha-dep", label: "Mẫu nhà đẹp" },
  { value: "phong-khach", label: "Phòng khách" },
  { value: "phong-bep", label: "Phòng bếp" },
  { value: "phong-ngu", label: "Phòng ngủ" },
  { value: "phong-tam", label: "Phòng tắm" },
] as const;

export type InteriorTargetType =
  (typeof INTERIOR_TARGET_OPTIONS)[number]["value"];

export type ConstructionTargetType =
  (typeof CONSTRUCTION_TARGET_OPTIONS)[number]["value"];

export type DuAnTargetType = (typeof DU_AN_TARGET_OPTIONS)[number]["value"];

export type ArticleTargetType =
  | InteriorTargetType
  | ConstructionTargetType
  | DuAnTargetType;

export function isArticleTargetSection(
  value: string,
): value is ArticleTargetSection {
  return (
    value === "thiet-ke-noi-that" ||
    value === "thi-cong-noi-that" ||
    value === "du-an"
  );
}

export function isInteriorTargetType(
  value: string,
): value is InteriorTargetType {
  return INTERIOR_TARGET_OPTIONS.some((item) => item.value === value);
}

export function isConstructionTargetType(
  value: string,
): value is ConstructionTargetType {
  return CONSTRUCTION_TARGET_OPTIONS.some((item) => item.value === value);
}

export function isDuAnTargetType(value: string): value is DuAnTargetType {
  return DU_AN_TARGET_OPTIONS.some((item) => item.value === value);
}

export function isArticleTargetType(value: string): value is ArticleTargetType {
  return (
    isInteriorTargetType(value) ||
    isConstructionTargetType(value) ||
    isDuAnTargetType(value)
  );
}

export function getInteriorTargetLabel(type: string): string {
  return (
    INTERIOR_TARGET_OPTIONS.find((item) => item.value === type)?.label ||
    "Thiết kế nội thất"
  );
}

export function getConstructionTargetLabel(type: string): string {
  return (
    CONSTRUCTION_TARGET_OPTIONS.find((item) => item.value === type)?.label ||
    "Thi công nội thất"
  );
}

export function getDuAnTargetLabel(type: string): string {
  return (
    DU_AN_TARGET_OPTIONS.find((item) => item.value === type)?.label ||
    "Mẫu nhà đẹp"
  );
}

export function toKhongGianTypeSlug(type: string): string {
  if (type === "nha-dep") return "mau-nha-dep";
  return type;
}

export function fromKhongGianTypeSlug(type: string): string {
  if (type === "mau-nha-dep") return "nha-dep";
  return type;
}

export function getTargetLabel(
  section: ArticleTargetSection,
  type: string,
): string {
  if (section === "du-an") {
    return getDuAnTargetLabel(type);
  }
  if (section === "thi-cong-noi-that") {
    return getConstructionTargetLabel(type);
  }
  return getInteriorTargetLabel(type);
}

export function getTargetOptions(section: ArticleTargetSection) {
  if (section === "thi-cong-noi-that") return CONSTRUCTION_TARGET_OPTIONS;
  if (section === "du-an") return DU_AN_TARGET_OPTIONS;
  return INTERIOR_TARGET_OPTIONS;
}

export function categoryToTypeSlug(category: string): string {
  const normalized = normalizeVietnamese(category);
  const slugLike = normalized.replace(/-/g, " ");

  if (normalized === "nha-dep" || slugLike.includes("nha dep")) {
    return "nha-dep";
  }
  if (normalized === "phong-khach" || slugLike.includes("phong khach")) {
    return "phong-khach";
  }
  if (normalized === "phong-bep" || slugLike.includes("phong bep")) {
    return "phong-bep";
  }
  if (normalized === "phong-ngu" || slugLike.includes("phong ngu")) {
    return "phong-ngu";
  }
  if (normalized === "phong-tam" || slugLike.includes("phong tam")) {
    return "phong-tam";
  }

  if (normalized.includes("biet thu") || normalized.includes("villa")) {
    return "biet-thu";
  }
  if (normalized.includes("nha pho") || normalized.includes("townhouse")) {
    return "nha-pho";
  }
  if (normalized.includes("can ho") || normalized.includes("chung cu")) {
    return "can-ho";
  }
  if (slugLike.includes("mau nha dep") || slugLike.includes("nha dep")) {
    return "nha-dep";
  }
  if (slugLike.includes("phong khach")) {
    return "phong-khach";
  }
  if (slugLike.includes("phong bep")) {
    return "phong-bep";
  }
  if (slugLike.includes("phong ngu")) {
    return "phong-ngu";
  }
  if (slugLike.includes("phong tam")) {
    return "phong-tam";
  }
  if (
    normalized.includes("cong trinh dich vu") ||
    normalized.includes("service")
  ) {
    return "cong-trinh-dich-vu";
  }

  return "biet-thu";
}

export function resolveArticleSection(article: {
  targetSection?: string;
}): ArticleTargetSection {
  if (article.targetSection && isArticleTargetSection(article.targetSection)) {
    return article.targetSection;
  }
  return "thiet-ke-noi-that";
}

export function resolveArticleType(article: {
  targetType?: string;
  category?: string;
}): ArticleTargetType {
  if (article.targetType && isArticleTargetType(article.targetType)) {
    return article.targetType;
  }
  return categoryToTypeSlug(article.category || "") as ArticleTargetType;
}

export function toSlug(value: string): string {
  return normalizeVietnamese(value)
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function buildTargetTypePath(
  section: ArticleTargetSection,
  typeOrCategory: string,
): string {
  const type = isArticleTargetType(typeOrCategory)
    ? typeOrCategory
    : categoryToTypeSlug(typeOrCategory);
  if (section === "du-an") {
    return `/khong-gian/${toKhongGianTypeSlug(type)}`;
  }
  return `/${section}/${type}`;
}

export function buildInteriorTypePath(typeOrCategory: string): string {
  return buildTargetTypePath("thiet-ke-noi-that", typeOrCategory);
}

export function buildConstructionTypePath(typeOrCategory: string): string {
  return buildTargetTypePath("thi-cong-noi-that", typeOrCategory);
}

export function buildArticlePublicPath(category: string, slug: string): string {
  return `/thiet-ke-noi-that/${categoryToTypeSlug(category)}/${toSlug(slug)}`;
}
