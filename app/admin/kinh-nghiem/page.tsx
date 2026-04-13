import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { readBlogPosts } from "@/lib/blog-post-storage";
import { DeleteBlogPostButton } from "@/components/admin/delete-blog-post-button";

export const revalidate = 0;

export default async function AdminBlogPostsPage() {
  const posts = await readBlogPosts();

  return (
    <Container className="py-12">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold">Quản Lý Kinh Nghiệm Hay</h1>
          <Link href="/admin/kinh-nghiem/new">
            <Button className="bg-amber-600 hover:bg-amber-700">
              + Thêm Bài Viết
            </Button>
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 py-12 text-center">
            <p className="mb-4 text-gray-600">Chưa có bài viết nào</p>
            <Link href="/admin/kinh-nghiem/new">
              <Button className="bg-amber-600 hover:bg-amber-700">
                Tạo Bài Viết Đầu Tiên
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="flex items-center justify-between gap-4 rounded-lg border border-gray-200 p-4 hover:bg-gray-50"
              >
                <div className="flex gap-4">
                  {post.coverImage?.url && (
                    <div className="relative h-20 w-20 overflow-hidden rounded-lg bg-gray-100">
                      <Image
                        src={post.coverImage.url}
                        alt={post.title}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-600">{post.category}</p>
                    <p className="text-xs text-gray-500">/blog/{post.slug}</p>
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
    </Container>
  );
}
