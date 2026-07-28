"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  CheckCircle2,
  Database,
  Eye,
  FileText,
  RefreshCw,
  ShieldCheck,
  UploadCloud,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { UatPost } from "@/lib/uat-post-storage";

type UatPostImporterProps = {
  sourcePost: UatPost;
  initialPosts: UatPost[];
};

export function UatPostImporter({
  sourcePost,
  initialPosts,
}: UatPostImporterProps) {
  const router = useRouter();
  const [posts, setPosts] = useState(initialPosts);
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [markdownFile, setMarkdownFile] = useState<File | null>(null);
  const [draftSlug, setDraftSlug] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const importPost = async () => {
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/uat/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sourceSlug: sourcePost.sourceSlug }),
        cache: "no-store",
      });
      const payload = await response.json();

      if (!response.ok || !payload?.ok) {
        throw new Error(payload?.error || "Khong the import bai UAT");
      }

      setPosts((current) => [
        payload.data,
        ...current.filter((item) => item.slug !== payload.data.slug),
      ]);
      setMessage("Da post bai vao kho local UAT.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Co loi khi import UAT");
    } finally {
      setLoading(false);
    }
  };

  const uploadMarkdown = async () => {
    if (!markdownFile) {
      setError("Vui lòng chọn file Markdown .md");
      return;
    }

    setUploadLoading(true);
    setMessage("");
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", markdownFile);
      formData.append("slug", draftSlug);

      const response = await fetch("/api/uat/upload-md", {
        method: "POST",
        body: formData,
        cache: "no-store",
      });
      const payload = await response.json();

      if (!response.ok || !payload?.ok) {
        throw new Error(payload?.error || "Không thể upload Markdown UAT");
      }

      const uploadedPost = payload.data.post as UatPost;
      setPosts((current) => [
        uploadedPost,
        ...current.filter((item) => item.slug !== uploadedPost.slug),
      ]);
      setMessage(`Đã lưu Markdown local: ${payload.data.savedTo}`);
      router.push(`/uat/bai-viet/${uploadedPost.slug}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Có lỗi khi upload Markdown UAT",
      );
    } finally {
      setUploadLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f3ed] px-4 py-8 text-slate-900">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-2xl border border-amber-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                <ShieldCheck className="h-4 w-4" />
                UAT local only
              </p>
              <h1 className="mt-3 text-3xl font-bold text-[#1f4569]">
                Dang bai UAT tu file MD, image va metadata
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                Moi thao tac o day chi doc file trong
                <span className="font-semibold">
                  {" "}
                  icep-design-posts/thiet-ke-noi-that-chung-cu
                </span>{" "}
                va luu vao <span className="font-semibold">.uat/posts.json</span>.
                Khong goi Neon DB, Cloudinary, Meta Pixel hay Vercel revalidate.
              </p>
            </div>
            <Button
              type="button"
              onClick={() => router.refresh()}
              variant="outline"
              className="self-start"
            >
              <RefreshCw className="h-4 w-4" />
              Tai lai
            </Button>
          </div>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
                <UploadCloud className="h-4 w-4" />
                Upload Markdown
              </p>
              <h2 className="mt-3 text-2xl font-bold text-slate-950">
                Upload file .md và lưu vào source local
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                File sẽ được lưu tại{" "}
                <span className="font-semibold">
                  icep-design-posts/admin-md-drafts/&lt;slug&gt;/index.md
                </span>
                , đồng thời tạo metadata local và mở preview ngay sau khi upload.
              </p>
            </div>

            <div className="grid w-full gap-3 lg:max-w-xl">
              <label className="grid gap-2 text-sm font-semibold text-slate-700">
                Folder/slug lưu local
                <input
                  value={draftSlug}
                  onChange={(event) => setDraftSlug(event.target.value)}
                  placeholder="VD: thiet-ke-noi-that-chung-cu"
                  className="h-11 rounded-xl border border-slate-200 px-4 text-sm font-medium outline-none transition focus:border-amber-400"
                />
              </label>

              <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-dashed border-amber-300 bg-amber-50/60 px-4 py-4 transition hover:bg-amber-50">
                <span className="flex min-w-0 items-center gap-3">
                  <FileText className="h-5 w-5 shrink-0 text-amber-700" />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-bold text-slate-800">
                      {markdownFile?.name || "Chọn file Markdown .md"}
                    </span>
                    <span className="block text-xs text-slate-500">
                      Không lưu DB, chỉ ghi file local trong source
                    </span>
                  </span>
                </span>
                <input
                  type="file"
                  accept=".md,text/markdown,text/plain"
                  className="hidden"
                  onChange={(event) =>
                    setMarkdownFile(event.target.files?.[0] || null)
                  }
                />
              </label>

              <Button
                type="button"
                onClick={uploadMarkdown}
                disabled={uploadLoading}
                className="h-11 bg-slate-950 text-white hover:bg-slate-800"
              >
                {uploadLoading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
                {uploadLoading ? "Đang lưu local..." : "Upload và xem preview"}
              </Button>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
              <FileText className="h-4 w-4" />
              Source local
            </div>
            <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
              <img
                src={sourcePost.coverImageUrl}
                alt={sourcePost.title}
                className="h-56 w-full object-cover"
              />
            </div>
            <h2 className="mt-4 text-2xl font-bold text-slate-950">
              {sourcePost.title}
            </h2>
            <p className="mt-2 line-clamp-4 text-sm leading-6 text-slate-600">
              {sourcePost.excerpt}
            </p>
            <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-3">
                <dt className="text-slate-500">Slug</dt>
                <dd className="font-semibold text-slate-900">{sourcePost.slug}</dd>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <dt className="text-slate-500">Category</dt>
                <dd className="font-semibold text-slate-900">
                  {sourcePost.category || "N/A"}
                </dd>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <dt className="text-slate-500">Images</dt>
                <dd className="font-semibold text-slate-900">
                  {sourcePost.imageCount}
                </dd>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <dt className="text-slate-500">Markdown</dt>
                <dd className="font-semibold text-slate-900">
                  {sourcePost.markdown.length.toLocaleString()} ky tu
                </dd>
              </div>
            </dl>
            <Button
              type="button"
              onClick={importPost}
              disabled={loading}
              className="mt-5 w-full bg-[#1f4569] text-white hover:bg-[#17324d]"
            >
              <Database className="h-4 w-4" />
              {loading ? "Dang post vao local..." : "Post bai vao UAT local"}
            </Button>
            {message ? (
              <p className="mt-3 flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
                <CheckCircle2 className="h-4 w-4" />
                {message}
              </p>
            ) : null}
            {error ? (
              <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
                {error}
              </p>
            ) : null}
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
                  Bai da post local
                </p>
                <h2 className="mt-1 text-2xl font-bold text-slate-950">
                  Kho UAT
                </h2>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                {posts.length} bai
              </span>
            </div>

            <div className="mt-5 space-y-3">
              {posts.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
                  Chua co bai nao trong UAT. Bam nut post de tao ban local dau tien.
                </div>
              ) : (
                posts.map((post) => (
                  <article
                    key={post.slug}
                    className="rounded-2xl border border-slate-200 p-4 transition hover:border-amber-300 hover:shadow-md"
                  >
                    <div className="flex gap-4">
                      <img
                        src={post.coverImageUrl}
                        alt={post.title}
                        className="h-20 w-24 shrink-0 rounded-xl object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <h3 className="line-clamp-2 font-bold text-slate-950">
                          {post.title}
                        </h3>
                        <p className="mt-1 truncate text-xs text-slate-500">
                          /uat/bai-viet/{post.slug}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <Link
                            href={`/uat/bai-viet/${post.slug}`}
                            className="rounded-full bg-[#1f4569] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#17324d]"
                          >
                            Xem preview
                          </Link>
                          <span className="rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600">
                            {new Date(post.importedAt).toLocaleString("vi-VN")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
