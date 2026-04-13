import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { readArticles } from "@/lib/article-storage";
import Image from "next/image";
import { DeleteArticleButton } from "@/components/admin/delete-article-button";
import {
  buildTargetTypePath,
  getTargetLabel,
  resolveArticleSection,
  resolveArticleType,
} from "@/lib/article-path";

export const revalidate = 0; // Always fresh

async function ArticlesListPage() {
  const articles = await readArticles();

  return (
    <Container className="py-12">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold">Quản Lý Bài Viết Dự Án</h1>
          <Link href="/admin/du-an/new">
            <Button className="bg-amber-600 hover:bg-amber-700">
              + Thêm Bài Viết
            </Button>
          </Link>
        </div>

        {articles.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 py-12 text-center">
            <p className="mb-4 text-gray-600">Chưa có bài viết nào</p>
            <Link href="/admin/du-an/new">
              <Button className="bg-amber-600 hover:bg-amber-700">
                Tạo Bài Viết Đầu Tiên
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {articles.map((article) => {
              const targetSection = resolveArticleSection(article);
              const targetType = resolveArticleType(article);
              const publicPath = buildTargetTypePath(targetSection, targetType);

              return (
                <div
                  key={article.id}
                  className="flex items-center justify-between gap-4 rounded-lg border border-gray-200 p-4 hover:bg-gray-50"
                >
                  <div className="flex gap-4">
                    {article.coverImageUrl && (
                      <div className="relative h-20 w-20 overflow-hidden rounded-lg bg-gray-100">
                        <Image
                          src={article.coverImageUrl}
                          alt={article.title}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {article.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Viết cho: {getTargetLabel(targetSection, targetType)}
                      </p>
                      <p className="text-xs text-gray-500">
                        Trang hiển thị: {publicPath}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link href={`/admin/du-an/${article.id}/edit`}>
                      <Button variant="outline" size="sm">
                        Sửa
                      </Button>
                    </Link>
                    <Link href={publicPath} target="_blank">
                      <Button variant="outline" size="sm">
                        Xem
                      </Button>
                    </Link>
                    <DeleteArticleButton articleId={article.id} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Container>
  );
}

export default ArticlesListPage;
