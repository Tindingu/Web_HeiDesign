import { env } from "@/lib/env";
import { defaultBlurDataURL } from "@/lib/constants";
// @ts-ignore
import sanitizeHtml from "sanitize-html";
import { toCategorySlug } from "@/lib/post-category";

export type ImageAsset = {
  url: string;
  alt: string;
  blurDataURL?: string;
};

export type ProjectDetail = {
  area: string;
  duration: string;
  scope: string;
  client?: string;
  location?: string;
  completedDate?: string;
};

export type Project = {
  id: number;
  slug: string;
  title: string;
  summary: string;
  description: string;
  category: string;
  style: string;
  budget: string;
  coverImage: ImageAsset;
  gallery: ImageAsset[];
  details: Array<{ label: string; value: string }>;
  projectDetails?: ProjectDetail;
  highlights?: string[];
  sections?: Array<{ title: string; content: string; image?: ImageAsset }>;
  wordContent?: string;
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type Service = {
  title: string;
  description: string;
  icon: string;
};

export type ProcessStep = {
  title: string;
  description: string;
};

export type Testimonial = {
  name: string;
  role: string;
  quote: string;
};

export type Post = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  content: string;
  coverImage: ImageAsset;
  publishedAt: string;
};

export type PortfolioFilters = {
  styles: string[];
  categories: string[];
  budgets: string[];
};

const fallbackHero = {
  title: "Nội thất cao cấp cho cuộc sống đẳng cấp",
  subtitle:
    "Thiết kế, thi công và hoàn thiện trọn gói với chi phí minh bạch, rõ ràng từng bước.",
  ctaPrimary: "Đặt lịch tư vấn",
  ctaSecondary: "Xem dự án",
  videoUrl: "/upload/banner/hero-video.mp4",
  imageUrl: "/upload/banner/hero-cover.png",
  imageUrls: [
    "/upload/banner/hero-1.png",
    "/upload/banner/hero-2.png",
    "/upload/banner/hero-3.png",
  ],
};

const fallbackServices: Service[] = [
  {
    title: "Thiết kế nội thất trọn gói",
    description: "Ý tưởng, 3D và thi công với giám sát chuyên nghiệp.",
    icon: "Sparkles",
  },
  {
    title: "Thi công hoàn thiện",
    description:
      "Thực hiện tại công trường với tiến độ và kiểm soát chất lượng nghiêm ngặt.",
    icon: "Hammer",
  },
  {
    title: "Nội thất & trang trí",
    description: "Đồ gỗ thủ công, chiếu sáng và gói hoàn thiện tổng thể.",
    icon: "Armchair",
  },
];

const fallbackProcessSteps: ProcessStep[] = [
  {
    title: "Khám phá",
    description:
      "Khảo sát không gian, phong cách sống và ngân sách để xác định phạm vi.",
  },
  {
    title: "Thiết kế",
    description: "Moodboard, bố cục, hình ảnh 3D và lựa chọn vật liệu.",
  },
  {
    title: "Thi công",
    description:
      "Thực hiện tại công trường với các điểm kiểm tra chất lượng và báo cáo tiến độ.",
  },
  {
    title: "Hoàn thiện",
    description: "Bàn giao nội thất, trang trí và nghiệm thu.",
  },
];

const fallbackTestimonials: Testimonial[] = [
  {
    name: "Minh N.",
    role: "Chủ căn Penthouse",
    quote:
      "Đội ngũ bàn giao đúng tiến độ với chất lượng hoàn thiện vượt mong đợi.",
  },
  {
    name: "Lan P.",
    role: "Chủ biệt thự",
    quote: "Trao đổi rõ ràng và quản lý dự án hoàn hảo, không một lỗi nhỏ.",
  },
  {
    name: "Khai T.",
    role: "CEO, khách sạn",
    quote: "Vật liệu cao cấp được lựa chọn tỉ mỉ, phong cách riêng biệt.",
  },
];

const fallbackProjects: Project[] = [
  {
    id: 1,
    slug: "skyline-penthouse",
    title: "Penthouse Skyline",
    summary: "Căn penthouse toàn cảnh kết hợp gỗ ấm áp và đá tự nhiên.",
    description:
      "Dự án Penthouse Skyline là một tuyệt tác thiết kế nội thất hạng sang. Không gian được tối ưu hóa để tạo ra cảm giác rộng rãi, thoáng mát với các tỷ lệ hài hòa.",
    category: "Căn hộ",
    style: "Hiện đại",
    budget: "3-5 tỷ",
    coverImage: {
      url: "/upload/projects/project-1.png",
      alt: "Skyline penthouse",
      blurDataURL: defaultBlurDataURL,
    },
    gallery: [
      {
        url: "/upload/projects/project-1a.png",
        alt: "Phòng khách",
        blurDataURL: defaultBlurDataURL,
      },
      {
        url: "/upload/projects/project-1b.png",
        alt: "Bếp",
        blurDataURL: defaultBlurDataURL,
      },
      {
        url: "/upload/projects/project-1c.png",
        alt: "Phòng ngủ",
        blurDataURL: defaultBlurDataURL,
      },
    ],
    details: [
      { label: "Diện tích", value: "320 m²" },
      { label: "Thời gian", value: "6 tháng" },
      { label: "Phạm vi", value: "Thiết kế + Thi công" },
    ],
  },
  {
    id: 2,
    slug: "heritage-villa",
    title: "Villa Cổ Điển",
    summary: "Chi tiết thủ công kết hợp hài hòa giữa cổ điển và hiện đại.",
    description:
      "Villa Cổ Điển là một công trình biệt thự cao cấp kết hợp tinh tế giữa kiến trúc cổ điển và các xu hướng thiết kế hiện đại. Tổng diện tích 480 m² được chia thành các khu vực chức năng riêng biệt.",
    category: "Biệt thự",
    style: "Tân cổ điển",
    budget: "Trên 5 tỷ",
    coverImage: {
      url: "/upload/projects/project-2.png",
      alt: "Villa cổ điển",
      blurDataURL: defaultBlurDataURL,
    },
    gallery: [],
    details: [
      { label: "Diện tích", value: "480 m²" },
      { label: "Thời gian", value: "8 tháng" },
      { label: "Phạm vi", value: "Thiết kế + Thi công" },
    ],
  },
];

const fallbackPosts: Post[] = [
  {
    id: 1,
    slug: "lua-chon-vat-lieu-noi-that-cao-cap",
    title: "Lựa chọn vật liệu nội thất cao cấp",
    excerpt:
      "Hướng dẫn chi tiết cách chọn bề mặt cao cấp hiệu quả, tránh lãng phí.",
    category: "Vật liệu",
    content:
      "## Lựa chọn có chủ đích\nNội thất cao cấp bắt đầu từ bảng màu tập trung và tinh tế.",
    coverImage: {
      url: "/upload/blog/blog-1.png",
      alt: "Vật liệu nội thất",
      blurDataURL: defaultBlurDataURL,
    },
    publishedAt: new Date().toISOString(),
  },
];

type StrapiResponse<T> = {
  data: T;
};

function normalizeUrl(url: string) {
  if (url.startsWith("http")) return url;
  return `${env.STRAPI_URL}${url}`;
}

function mapImage(
  asset: { url: string; alternativeText?: string } | null,
): ImageAsset {
  if (!asset) {
    return {
      url: "",
      alt: "",
      blurDataURL: defaultBlurDataURL,
    };
  }

  return {
    url: normalizeUrl(asset.url),
    alt: asset.alternativeText ?? "",
    blurDataURL: defaultBlurDataURL,
  };
}

async function fetchStrapi<T>(path: string, query?: string): Promise<T | null> {
  const url = `${env.STRAPI_URL}/api/${path}${query ? `?${query}` : ""}`;
  try {
    const response = await fetch(url, {
      headers: env.STRAPI_TOKEN
        ? { Authorization: `Bearer ${env.STRAPI_TOKEN}` }
        : undefined,
      next: { revalidate: 120 },
    });

    if (!response.ok) return null;
    const json = (await response.json()) as StrapiResponse<T>;
    return json.data ?? null;
  } catch {
    return null;
  }
}

async function readProjectsFromStorage() {
  const { readProjects } = await import("@/lib/project-storage");
  return readProjects();
}

async function readBlogPostsFromStorage() {
  const { readBlogPosts, toPost } = await import("@/lib/blog-post-storage");
  const records = await readBlogPosts();
  return records.map(toPost);
}

async function getLocalPostBySlug(slug: string): Promise<Post | null> {
  const { readBlogPosts, toPost } = await import("@/lib/blog-post-storage");
  const records = await readBlogPosts();
  const found = records.find((post) => post.slug === slug);
  return found ? toPost(found) : null;
}

export async function getHomeContent() {
  const content = await fetchStrapi<{
    attributes: {
      heroTitle: string;
      heroSubtitle: string;
      heroVideo: { data: { attributes: { url: string } } };
      heroImage: {
        data: { attributes: { url: string; alternativeText?: string } };
      };
      services: Array<{ title: string; description: string; icon: string }>;
      processSteps: Array<{ title: string; description: string }>;
      testimonials: Array<{ name: string; role: string; quote: string }>;
    };
  }>("home", "populate=heroVideo,heroImage");

  if (!content) {
    return {
      hero: fallbackHero,
      services: fallbackServices,
      processSteps: fallbackProcessSteps,
      testimonials: fallbackTestimonials,
    };
  }

  const heroImage = mapImage(
    content.attributes.heroImage?.data?.attributes ?? null,
  );
  const heroVideo = content.attributes.heroVideo?.data?.attributes?.url
    ? normalizeUrl(content.attributes.heroVideo.data.attributes.url)
    : fallbackHero.videoUrl;

  return {
    hero: {
      title: content.attributes.heroTitle ?? fallbackHero.title,
      subtitle: content.attributes.heroSubtitle ?? fallbackHero.subtitle,
      ctaPrimary: "Book a consultation",
      ctaSecondary: "View portfolio",
      videoUrl: heroVideo,
      imageUrl: heroImage.url || fallbackHero.imageUrl,
    },
    services: content.attributes.services ?? fallbackServices,
    processSteps: content.attributes.processSteps ?? fallbackProcessSteps,
    testimonials: content.attributes.testimonials ?? fallbackTestimonials,
  };
}

export async function getFeaturedProjects(): Promise<Project[]> {
  // Try project storage first
  try {
    const storageProjects = await readProjectsFromStorage();
    const featured = storageProjects.filter((p) => p.featured);
    if (featured.length > 0) return featured;
  } catch (error) {
    console.error("Error reading from project storage:", error);
  }

  // Fallback to Strapi
  const projects = await fetchStrapi<Array<{ id: number; attributes: any }>>(
    "projects",
    "populate=coverImage,gallery&filters[featured][$eq]=true",
  );

  if (!projects) return fallbackProjects;
  return projects.map(mapProject);
}

export async function getProjects(): Promise<Project[]> {
  // Try project storage first
  try {
    const storageProjects = await readProjectsFromStorage();
    if (storageProjects.length > 0) return storageProjects;
  } catch (error) {
    console.error("Error reading from project storage:", error);
  }

  // Fallback to Strapi
  const projects = await fetchStrapi<Array<{ id: number; attributes: any }>>(
    "projects",
    "populate=coverImage,gallery",
  );

  if (!projects) return fallbackProjects;
  return projects.map(mapProject);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  // Try project storage first
  try {
    const storageProjects = await readProjectsFromStorage();
    const found = storageProjects.find((p) => p.slug === slug);
    if (found) return found;
  } catch (error) {
    console.error("Error reading from project storage:", error);
  }

  // Fallback to Strapi
  const project = await fetchStrapi<Array<{ id: number; attributes: any }>>(
    "projects",
    `filters[slug][$eq]=${slug}&populate=coverImage,gallery`,
  );

  if (!project || project.length === 0)
    return fallbackProjects.find((item) => item.slug === slug) ?? null;
  return mapProject(project[0]);
}

export async function getProjectSlugs(): Promise<string[]> {
  const projects = await getProjects();
  return projects.map((project) => project.slug);
}

export async function getPortfolioFilters(): Promise<PortfolioFilters> {
  const projects = await getProjects();
  return {
    styles: Array.from(new Set(projects.map((project) => project.style))),
    categories: Array.from(
      new Set(projects.map((project) => project.category)),
    ),
    budgets: Array.from(new Set(projects.map((project) => project.budget))),
  };
}

export async function getPosts(): Promise<Post[]> {
  let localPosts: Post[] = [];
  try {
    localPosts = await readBlogPostsFromStorage();
  } catch {
    localPosts = [];
  }

  const posts = await fetchStrapi<Array<{ id: number; attributes: any }>>(
    "posts",
    "populate=coverImage",
  );

  const remotePosts = posts ? posts.map(mapPost) : fallbackPosts;

  const merged = new Map<string, Post>();
  for (const post of remotePosts) {
    merged.set(post.slug, post);
  }
  for (const post of localPosts) {
    // Local admin posts override same slug from Strapi.
    merged.set(post.slug, post);
  }

  return Array.from(merged.values()).sort(
    (a, b) =>
      new Date(b.publishedAt || 0).getTime() -
      new Date(a.publishedAt || 0).getTime(),
  );
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const local = await getLocalPostBySlug(slug);
    if (local) return local;
  } catch {
    // Ignore local read errors and continue to Strapi.
  }

  const posts = await fetchStrapi<Array<{ id: number; attributes: any }>>(
    "posts",
    `filters[slug][$eq]=${slug}&populate=coverImage`,
  );

  if (!posts || posts.length === 0)
    return fallbackPosts.find((post) => post.slug === slug) ?? null;
  return mapPost(posts[0]);
}

export async function getPostSlugs(): Promise<string[]> {
  const posts = await getPosts();
  return posts.map((post) => post.slug);
}

export async function getPostCategories(): Promise<
  Array<{ label: string; slug: string; count: number }>
> {
  const posts = await getPosts();
  const map = new Map<string, { label: string; slug: string; count: number }>();

  for (const post of posts) {
    const label = post.category || "Tin tức";
    const slug = toCategorySlug(label || "tin-tuc");
    const existing = map.get(slug);
    if (existing) {
      existing.count += 1;
    } else {
      map.set(slug, { label, slug, count: 1 });
    }
  }

  return Array.from(map.values()).sort((a, b) => b.count - a.count);
}

export async function getPostsByCategorySlug(
  categorySlug: string,
): Promise<Post[]> {
  const posts = await getPosts();
  return posts.filter(
    (post) => toCategorySlug(post.category || "tin-tuc") === categorySlug,
  );
}

function mapProject(entry: { id: number; attributes: any }): Project {
  const attributes = entry.attributes ?? {};

  return {
    id: entry.id,
    slug: attributes.slug,
    title: attributes.title,
    summary: attributes.summary,
    description: attributes.description ?? "",
    category: attributes.category ?? "Residential",
    style: attributes.style ?? "Modern",
    budget: attributes.budget ?? "3B-5B",
    coverImage: mapImage(attributes.coverImage?.data?.attributes ?? null),
    gallery:
      attributes.gallery?.data?.map(
        (image: { attributes: { url: string; alternativeText?: string } }) =>
          mapImage(image.attributes),
      ) ?? [],
    details: attributes.details ?? [
      { label: "Area", value: attributes.area ?? "" },
      { label: "Duration", value: attributes.duration ?? "" },
      { label: "Scope", value: attributes.scope ?? "" },
    ],
  };
}

function mapPost(entry: { id: number; attributes: any }): Post {
  const attributes = entry.attributes ?? {};
  const rawContent = attributes.content ?? attributes.contentHtml ?? "";
  const content = rawContent.includes("<")
    ? sanitizeHtml(rawContent, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat([
          "img",
          "h2",
          "h3",
        ]),
        allowedAttributes: {
          a: ["href", "target", "rel"],
          img: ["src", "alt"],
        },
      })
    : rawContent;

  return {
    id: entry.id,
    slug: attributes.slug,
    title: attributes.title,
    excerpt: attributes.excerpt,
    category: attributes.category ?? "Design",
    content,
    coverImage: mapImage(attributes.coverImage?.data?.attributes ?? null),
    publishedAt: attributes.publishedAt ?? new Date().toISOString(),
  };
}
