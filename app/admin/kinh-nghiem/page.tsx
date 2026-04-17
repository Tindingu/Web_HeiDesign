import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { readBlogPosts } from "@/lib/blog-post-storage";
import { DeleteBlogPostButton } from "@/components/admin/delete-blog-post-button";
import { StatsPanel } from "@/components/admin/stats-panel";

export const revalidate = 0;

export default async function AdminBlogPostsPage() {
  const posts = await readBlogPosts();
  const categoryMap = posts.reduce<Map<string, number>>((acc, post) => {
    const key = post.category || "Tin tức";
    acc.set(key, (acc.get(key) || 0) + 1);
    return acc;
  }, new Map());

  const categoryData = Array.from(categoryMap.entries())
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);

  const thisMonthCount = posts.filter((post) => {
    const date = new Date(post.publishedAt || 0);
    const now = new Date();
    return (
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  }).length;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Blog Management</p>
            <h2 className="text-2xl font-semibold text-slate-900">Quản lý bài viết kinh nghiệm</h2>
          </div>
          <Link href="/admin/kinh-nghiem/new">
            <Button className="bg-amber-600 hover:bg-amber-700">
              + Thêm Bài Viết
            </Button>
          </Link>
        </div>
      </div>

      <StatsPanel
        title="Thống kê bài viết kinh nghiệm"
        subtitle="Theo dõi số bài theo chuyên mục và số bài trong tháng"
        summaries={[
          { label: "Tổng bài viết", value: posts.length, tone: "slate" },
          { label: "Bài viết tháng này", value: thisMonthCount, tone: "emerald" },
          { label: "Số chuyên mục", value: categoryData.length, tone: "sky" },
        ]}
        chartTitle="Biểu đồ bài viết theo chuyên mục"
        data={categoryData}
        emptyText="Chưa có dữ liệu bài viết"
      />

      {posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-12 text-center">
          <p className="mb-4 text-slate-600">Chưa có bài viết nào</p>
          <Link href="/admin/kinh-nghiem/new">
            <Button className="bg-amber-600 hover:bg-amber-700">
              Tạo Bài Viết Đầu Tiên
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 p-4 transition hover:border-slate-300 hover:bg-slate-50"
            >
              <div className="flex min-w-0 flex-1 gap-4">
                {post.coverImage?.url && (
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                    <Image
                      src={post.coverImage.url}
                      alt={post.title}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-semibold text-slate-900">
                    {post.title}
                  </h3>
                  <p className="text-sm text-slate-600">{post.category}</p>
                  <p className="truncate text-xs text-slate-500">/blog/{post.slug}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Link href={`/admin/kinh-nghiem/${post.id}/edit`}>
                  <Button variant="outline" size="sm">
                    Sửa
                  </Button>
                </Link>
                <Link href={`/blog/${post.slug}`} target="_blank">
                  <Button variant="outline" size="sm">
                    Xem
                  </Button>
                </Link>
                <DeleteBlogPostButton postId={post.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
