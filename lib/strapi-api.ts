/**
 * Strapi API Integration
 *
 * This module handles communication with Strapi CMS.
 * Falls back to local JSON storage if Strapi is unavailable.
 *
 * Environment Variables Required:
 * - NEXT_PUBLIC_STRAPI_URL: Base URL of Strapi API (e.g., http://localhost:1337)
 * - STRAPI_API_TOKEN: API token for authentication
 */

import { readProjects } from "@/lib/project-storage";

// ============================================================================
// TYPES
// ============================================================================

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

// ============================================================================
// CONSTANTS
// ============================================================================

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const API_TOKEN = process.env.STRAPI_API_TOKEN || "";

const defaultBlurDataURL =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAICAgIChEDDggKDBcTFhcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoGSj/2wBDAQcHBwoIChMICChMGhYYTCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAj/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8VAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA//Z";

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
    icon: "Hammer2",
  },
  {
    title: "Tư vấn, lập kế hoạch",
    description:
      "Xác định nhu cầu của bạn và phát triển chiến lược nội thất hoàn chỉnh.",
    icon: "Lightbulb",
  },
];

// ============================================================================
// API UTILITIES
// ============================================================================

/**
 * Fetch from Strapi API with error handling
 */
async function fetchStrapi(
  path: string,
  options: {
    method?: "GET" | "POST" | "PUT" | "DELETE";
    body?: any;
    revalidate?: number;
  } = {},
) {
  if (!API_TOKEN) {
    throw new Error(
      "STRAPI_API_TOKEN is not set. Check your environment variables.",
    );
  }

  const url = `${STRAPI_URL}/api${path}`;
  const method = options.method || "GET";
  const body = options.body ? JSON.stringify(options.body) : null;

  try {
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_TOKEN}`,
      },
      body,
      next: { revalidate: options.revalidate ?? 3600 }, // Cache for 1 hour by default
    });

    if (!response.ok) {
      console.error(
        `Strapi API Error: ${response.status} ${response.statusText}`,
      );
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error(`Strapi Fetch Error: ${error}`);
    return null;
  }
}

/**
 * Convert Strapi image URL to Cloudinary URL if needed
 */
function normalizeImageUrl(url: string): string {
  if (!url) return "";

  // If already a full Cloudinary URL, return as-is
  if (url.includes("res.cloudinary.com")) {
    return url;
  }

  // If it's a relative Strapi URL
  if (url.startsWith("/")) {
    return `${STRAPI_URL}${url}`;
  }

  // If it's already absolute, return as-is
  return url;
}

/**
 * Map Strapi project to our Project type
 */
function mapProject(item: any): Project {
  const coverImageUrl =
    item.coverImage?.url || item.coverImage?.formats?.large?.url || "";

  const gallery = (item.gallery || [])
    .filter((img: any) => img.url)
    .map((img: any) => ({
      url: normalizeImageUrl(img.url),
      alt: img.alternativeText || img.name || item.title,
      blurDataURL: defaultBlurDataURL,
    }));

  return {
    id: item.id,
    slug: item.slug,
    title: item.title,
    summary: item.summary,
    description: item.description,
    category: item.category,
    style: item.style,
    budget: item.budget,
    coverImage: {
      url: normalizeImageUrl(coverImageUrl),
      alt: item.coverImage?.alternativeText || item.title,
      blurDataURL: defaultBlurDataURL,
    },
    gallery,
    details: [
      { label: "Diện tích", value: item.area || "-" },
      { label: "Thời gian", value: item.duration || "-" },
      { label: "Phạm vi", value: item.scope || "-" },
    ],
    projectDetails: {
      area: item.area,
      duration: item.duration,
      scope: item.scope,
      client: item.client,
      location: item.location,
      completedDate: item.completedDate,
    },
    highlights: item.highlights || [],
    featured: item.featured || false,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

// ============================================================================
// PUBLIC FUNCTIONS
// ============================================================================

/**
 * Get all projects from Strapi
 * Falls back to local JSON storage if Strapi is unavailable
 */
export async function getProjects(): Promise<Project[]> {
  // Try Strapi first
  const strapiData = await fetchStrapi(
    "/projects?populate=coverImage,gallery&sort[0]=createdAt:desc&pagination[limit]=100",
  );

  if (strapiData?.data) {
    return strapiData.data.map(mapProject);
  }

  // Fallback to local storage
  console.warn("Falling back to local project storage");
  return await readProjects();
}

/**
 * Get featured projects (marked as featured in Strapi)
 */
export async function getFeaturedProjects(): Promise<Project[]> {
  // Try Strapi first
  const strapiData = await fetchStrapi(
    "/projects?filters[featured][$eq]=true&populate=coverImage,gallery&sort[0]=createdAt:desc&pagination[limit]=6",
  );

  if (strapiData?.data) {
    return strapiData.data.map(mapProject);
  }

  // Fallback to local storage
  console.warn("Falling back to local project storage for featured projects");
  const allProjects = await readProjects();
  return allProjects.filter((p) => p.featured).slice(0, 6);
}

/**
 * Get single project by slug
 */
export async function getProjectBySlug(slug: string): Promise<Project | null> {
  // Try Strapi first
  const strapiData = await fetchStrapi(
    `/projects?filters[slug][$eq]=${slug}&populate=*`,
  );

  if (strapiData?.data?.length > 0) {
    return mapProject(strapiData.data[0]);
  }

  // Fallback to local storage
  console.warn(`Falling back to local storage for project: ${slug}`);
  const allProjects = await readProjects();
  return allProjects.find((p) => p.slug === slug) || null;
}

/**
 * Get all project slugs (for static generation)
 */
export async function getProjectSlugs(): Promise<string[]> {
  // Try Strapi first
  const strapiData = await fetchStrapi(
    "/projects?fields=slug&pagination[limit]=1000",
  );

  if (strapiData?.data) {
    return strapiData.data.map((p: any) => p.slug);
  }

  // Fallback to local storage
  console.warn("Falling back to local storage for project slugs");
  const allProjects = await readProjects();
  return allProjects.map((p) => p.slug);
}

/**
 * Get hero section content
 */
export function getHero() {
  return fallbackHero;
}

/**
 * Get services list
 */
export function getServices(): Service[] {
  return fallbackServices;
}

/**
 * Get portfolio filters (available styles, categories, budgets)
 */
export function getPortfolioFilters(): PortfolioFilters {
  return {
    styles: [
      "Hiện Đại",
      "Tân Cổ Điển",
      "Minimalism",
      "Japandi",
      "Wabi Sabi",
      "Tropical",
      "Modern Luxury",
    ],
    categories: ["Biệt Thự", "Nhà Phố", "Căn Hộ", "Công Trình Dịch Vụ"],
    budgets: [
      "< 500 triệu",
      "500 triệu - 1 tỷ",
      "1 - 2 tỷ",
      "2 - 3 tỷ",
      "> 3 tỷ",
    ],
  };
}

/**
 * Get process steps
 */
export function getProcessSteps(): ProcessStep[] {
  return [
    {
      title: "1. Tư vấn & Lập kế hoạch",
      description:
        "Gặp mặt trực tiếp, hiểu rõ nhu cầu, sở thích và ngân sách của bạn.",
    },
    {
      title: "2. Thiết kế nội thất",
      description:
        "Tạo bản thiết kế 3D chi tiết, lựa chọn màu sắc, vật liệu, nội thất phù hợp.",
    },
    {
      title: "3. Báo giá & Ký hợp đồng",
      description:
        "Cung cấp báo giá minh bạch, chi tiết từng hạng mục công việc.",
    },
    {
      title: "4. Thi công & Giám sát",
      description:
        "Thực hiện thi công chuyên nghiệp với tiến độ rõ ràng, bảo hành chất lượng.",
    },
    {
      title: "5. Bàn giao & Hỗ trợ",
      description:
        "Bàn giao công trình hoàn thiện, hướng dẫn sử dụng, hỗ trợ bảo hành.",
    },
  ];
}

/**
 * Get testimonials
 */
export function getTestimonials(): Testimonial[] {
  return [
    {
      name: "Chị Linh",
      role: "Chủ nhân biệt thự",
      quote:
        "Dịch vụ chuyên nghiệp, đội ngũ nhân viên tận tâm. Tôi rất hài lòng với kết quả cuối cùng.",
    },
    {
      name: "Anh Tuấn",
      role: "Giám đốc công ty",
      quote:
        "Không chỉ đẹp về bề ngoài, mà còn được tư vấn tối ưu hóa không gian sử dụng.",
    },
    {
      name: "Cô Hoa",
      role: "Nhà thiết kế",
      quote:
        "Tôi lựa chọn làm việc với ICEP vì sự tỉ mỉ và chuyên nghiệp của họ.",
    },
  ];
}
