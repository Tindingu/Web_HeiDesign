import { getDbPool } from "@/lib/db/neon";

type CountRow = { count: string | number };
type NumberRow = Record<string, string | number | null>;

type ChartTone = "amber" | "emerald" | "sky" | "rose" | "slate";

export type DashboardChartItem = {
  label: string;
  value: number;
  tone?: ChartTone;
};

export type DashboardModuleHealth = {
  label: string;
  href: string;
  value: number;
  target: number;
  unit: string;
  description: string;
};

export type DashboardTodoItem = {
  label: string;
  href: string;
  tone: "amber" | "rose";
  note: string;
};

export type DashboardLatestItem = {
  label: string;
  updatedAt: string;
};

export type AdminDashboardData = {
  syncedAt: string;
  latestUpdatedAt: string | null;
  stats: {
    totalPublicContent: number;
    recentTotal: number;
    projectCount: number;
    featuredProjectCount: number;
    articleCount: number;
    blogCount: number;
    recentBlogCount: number;
    coveragePercent: number;
    writtenArticleTypeCount: number;
    articleTypeCount: number;
    writtenTargetCount: number;
    seoGapCount: number;
  };
  contentBars: DashboardChartItem[];
  projectCategoryBars: DashboardChartItem[];
  articleSectionBars: DashboardChartItem[];
  galleryBars: DashboardChartItem[];
  moduleHealth: DashboardModuleHealth[];
  todoItems: DashboardTodoItem[];
  systemResources: Array<{
    label: string;
    value: number;
  }>;
  latestRows: DashboardLatestItem[];
};

type ArticleCoverageRow = {
  section_name: string;
  type_name: string;
  article_count: string | number;
};

const pool = getDbPool();

function toNumber(value: unknown) {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function percent(value: number, total: number) {
  if (total <= 0) return 0;
  return Math.round((value / total) * 100);
}

async function count(query: string) {
  try {
    const result = await pool.query(query);
    const firstRow = result.rows[0] as CountRow | undefined;
    return toNumber(firstRow?.count);
  } catch {
    return 0;
  }
}

async function rows<T extends NumberRow>(query: string): Promise<T[]> {
  try {
    const result = await pool.query(query);
    return result.rows as T[];
  } catch {
    return [];
  }
}

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  const [
    projectCount,
    featuredProjectCount,
    articleCount,
    blogCount,
    heroImageCount,
    homepageBannerCount,
    standardVideoCount,
    shortVideoCount,
    testimonialCount,
    hotTopicCount,
    galleryCount,
    projectCategoryCount,
    projectStyleCount,
    articleTypeCount,
    writtenArticleTypeCount,
    recentProjectCount,
    recentArticleCount,
    recentBlogCount,
    categoryRows,
    articleSectionRows,
    coverageRows,
    galleryRows,
    latestRows,
  ] = await Promise.all([
    count("SELECT COUNT(*) AS count FROM projects"),
    count("SELECT COUNT(*) AS count FROM projects WHERE featured = TRUE"),
    count("SELECT COUNT(*) AS count FROM project_articles"),
    count("SELECT COUNT(*) AS count FROM blog_posts"),
    count(
      "SELECT COALESCE(array_length(image_urls, 1), 0) AS count FROM homepage_hero_banners ORDER BY id DESC LIMIT 1",
    ),
    count("SELECT COUNT(*) AS count FROM homepage_banners WHERE is_active = TRUE"),
    count(
      "SELECT COUNT(*) AS count FROM homepage_videos WHERE is_active = TRUE AND COALESCE(display_type, 'standard') = 'standard'",
    ),
    count(
      "SELECT COUNT(*) AS count FROM homepage_videos WHERE is_active = TRUE AND display_type = 'short'",
    ),
    count(
      "SELECT COUNT(*) AS count FROM homepage_testimonials WHERE is_active = TRUE",
    ),
    count(
      "SELECT COUNT(*) AS count FROM homepage_hot_topics WHERE COALESCE(topic_slug, '') <> ''",
    ),
    count("SELECT COUNT(*) AS count FROM architecture_gallery_items"),
    count("SELECT COUNT(*) AS count FROM project_categories"),
    count("SELECT COUNT(*) AS count FROM project_styles"),
    count("SELECT COUNT(*) AS count FROM article_types"),
    count(
      "SELECT COUNT(DISTINCT type_id) AS count FROM project_articles WHERE type_id IS NOT NULL",
    ),
    count(
      "SELECT COUNT(*) AS count FROM projects WHERE updated_at >= NOW() - INTERVAL '30 days'",
    ),
    count(
      "SELECT COUNT(*) AS count FROM project_articles WHERE updated_at >= NOW() - INTERVAL '30 days'",
    ),
    count(
      "SELECT COUNT(*) AS count FROM blog_posts WHERE updated_at >= NOW() - INTERVAL '30 days'",
    ),
    rows<{ label: string; count: string }>(`
      SELECT COALESCE(pc.name, 'Chưa phân loại') AS label, COUNT(*) AS count
      FROM projects p
      LEFT JOIN project_categories pc ON pc.id = p.category_id
      GROUP BY label
      ORDER BY COUNT(*) DESC
      LIMIT 6
    `),
    rows<{ label: string; count: string }>(`
      SELECT s.name AS label, COUNT(pa.id) AS count
      FROM article_sections s
      LEFT JOIN project_articles pa ON pa.section_id = s.id
      GROUP BY s.id, s.name
      ORDER BY COUNT(pa.id) DESC
    `),
    rows<ArticleCoverageRow>(`
      SELECT
        s.name AS section_name,
        t.name AS type_name,
        COUNT(pa.id) AS article_count
      FROM article_types t
      JOIN article_sections s ON s.id = t.section_id
      LEFT JOIN project_articles pa ON pa.type_id = t.id
      GROUP BY s.id, s.name, t.id, t.name
      ORDER BY s.id ASC, t.id ASC
    `),
    rows<{ label: string; count: string }>(`
      SELECT ps.name AS label, COUNT(agi.id) AS count
      FROM project_styles ps
      LEFT JOIN architecture_gallery_items agi ON agi.style_id = ps.id
      GROUP BY ps.id, ps.name
      ORDER BY COUNT(agi.id) DESC, ps.id ASC
      LIMIT 6
    `),
    rows<{ label: string; updated_at: string }>(`
      SELECT label, updated_at
      FROM (
        SELECT 'Dự án thi công' AS label, MAX(updated_at) AS updated_at FROM projects
        UNION ALL
        SELECT 'Bài SEO dự án' AS label, MAX(updated_at) AS updated_at FROM project_articles
        UNION ALL
        SELECT 'Kinh nghiệm hay' AS label, MAX(updated_at) AS updated_at FROM blog_posts
        UNION ALL
        SELECT 'Gallery kiến trúc' AS label, MAX(updated_at) AS updated_at FROM architecture_gallery_items
        UNION ALL
        SELECT 'Video trang chủ' AS label, MAX(updated_at) AS updated_at FROM homepage_videos
        UNION ALL
        SELECT 'Nhận xét khách hàng' AS label, MAX(updated_at) AS updated_at FROM homepage_testimonials
      ) latest
      WHERE updated_at IS NOT NULL
      ORDER BY updated_at DESC
      LIMIT 6
    `),
  ]);

  const chartTones: ChartTone[] = ["amber", "emerald", "sky", "rose", "slate"];
  const recentTotal = recentProjectCount + recentArticleCount + recentBlogCount;
  const totalPublicContent = projectCount + articleCount + blogCount;
  const seoGaps = coverageRows.filter((row) => toNumber(row.article_count) === 0);
  const writtenTargets = coverageRows.filter(
    (row) => toNumber(row.article_count) > 0,
  );

  const moduleHealth: DashboardModuleHealth[] = [
    {
      label: "Hero banner",
      href: "/admin/banner-trang-chu",
      value: heroImageCount,
      target: 1,
      unit: "ảnh",
      description: "Ảnh chính đầu trang chủ",
    },
    {
      label: "Banner trang chủ",
      href: "/admin/homepage-banners",
      value: homepageBannerCount,
      target: 1,
      unit: "banner",
      description: "Slider/banner nội dung trang chủ",
    },
    {
      label: "Video YouTube",
      href: "/admin/video",
      value: standardVideoCount,
      target: 1,
      unit: "video",
      description: "Video giới thiệu kênh chính",
    },
    {
      label: "Short video",
      href: "/admin/video",
      value: shortVideoCount,
      target: 4,
      unit: "shorts",
      description: "Shorts nên đủ 4 để hiển thị đẹp",
    },
    {
      label: "Nhận xét khách hàng",
      href: "/admin/nhan-xet-khach-hang",
      value: testimonialCount,
      target: 3,
      unit: "review",
      description: "Feedback tạo độ tin cậy ở homepage",
    },
    {
      label: "Chủ đề hot",
      href: "/admin/chu-de-hot",
      value: hotTopicCount,
      target: 1,
      unit: "topic",
      description: "Topic nổi bật kéo traffic SEO",
    },
  ];

  const todoItems: DashboardTodoItem[] = [
    ...seoGaps.slice(0, 5).map((row) => ({
      label: `${row.section_name}: ${row.type_name}`,
      href: "/admin/du-an/new",
      tone: "amber" as const,
      note: "Chưa có bài đại diện",
    })),
    ...moduleHealth
      .filter((item) => item.value < item.target)
      .slice(0, 4)
      .map((item) => ({
        label: item.label,
        href: item.href,
        tone: "rose" as const,
        note: `Cần tối thiểu ${item.target} ${item.unit}`,
      })),
  ].slice(0, 7);

  return {
    syncedAt: new Date().toISOString(),
    latestUpdatedAt: latestRows[0]?.updated_at
      ? new Date(String(latestRows[0].updated_at)).toISOString()
      : null,
    stats: {
      totalPublicContent,
      recentTotal,
      projectCount,
      featuredProjectCount,
      articleCount,
      blogCount,
      recentBlogCount,
      coveragePercent: percent(writtenArticleTypeCount, articleTypeCount),
      writtenArticleTypeCount,
      articleTypeCount,
      writtenTargetCount: writtenTargets.length,
      seoGapCount: seoGaps.length,
    },
    contentBars: [
      { label: "Dự án", value: projectCount, tone: "amber" },
      { label: "Bài SEO", value: articleCount, tone: "emerald" },
      { label: "Blog", value: blogCount, tone: "sky" },
    ],
    projectCategoryBars: categoryRows.map((row, index) => ({
      label: row.label,
      value: toNumber(row.count),
      tone: chartTones[index % chartTones.length],
    })),
    articleSectionBars: articleSectionRows.map((row, index) => ({
      label: row.label,
      value: toNumber(row.count),
      tone: chartTones[(index + 1) % chartTones.length],
    })),
    galleryBars: galleryRows.map((row, index) => ({
      label: row.label,
      value: toNumber(row.count),
      tone: chartTones[(index + 2) % chartTones.length],
    })),
    moduleHealth,
    todoItems,
    systemResources: [
      { label: "Project categories", value: projectCategoryCount },
      { label: "Project styles", value: projectStyleCount },
      { label: "Article targets", value: articleTypeCount },
      { label: "Gallery slots", value: galleryCount },
      {
        label: "Videos",
        value: standardVideoCount + shortVideoCount,
      },
      { label: "Testimonials", value: testimonialCount },
    ],
    latestRows: latestRows.map((item) => ({
      label: item.label,
      updatedAt: new Date(String(item.updated_at)).toISOString(),
    })),
  };
}
