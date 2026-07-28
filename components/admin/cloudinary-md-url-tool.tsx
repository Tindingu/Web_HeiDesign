"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Copy, Download, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type CloudinaryAsset = {
  assetId: string;
  publicId: string;
  secureUrl: string;
  format: string;
  filename: string;
  originalFilename: string;
  displayName: string;
  folder: string;
};

type ReplaceResult = {
  output: string;
  replaced: Array<{ from: string; to: string; key: string }>;
  unmatched: string[];
  assets: CloudinaryAsset[];
};

function stripQueryAndHash(value: string) {
  return value.split("#")[0].split("?")[0];
}

function basename(value: string) {
  const cleaned = decodeURIComponent(stripQueryAndHash(value))
    .replace(/\\/g, "/")
    .replace(/^<|>$/g, "");
  return cleaned.split("/").pop() || cleaned;
}

function stripExtension(name: string) {
  return name.replace(/\.[a-z0-9]+$/i, "");
}

function normalizeKey(value: string) {
  return stripExtension(basename(value))
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function candidateKeys(asset: CloudinaryAsset) {
  const values = [
    asset.originalFilename,
    asset.filename,
    asset.displayName,
    asset.publicId.split("/").pop() || "",
    asset.secureUrl,
  ].filter(Boolean);

  const keys = new Set<string>();
  for (const value of values) {
    const key = normalizeKey(value);
    if (!key) continue;
    keys.add(key);

    // Cloudinary/import tools sometimes prepend ids before the original name.
    for (const separator of ["-", "_"]) {
      const parts = key.split(separator).filter(Boolean);
      for (let index = 1; index < parts.length; index++) {
        keys.add(parts.slice(index).join("-"));
      }
    }
  }

  return [...keys];
}

function buildAssetMap(assets: CloudinaryAsset[]) {
  const map = new Map<string, CloudinaryAsset[]>();

  for (const asset of assets) {
    for (const key of candidateKeys(asset)) {
      const list = map.get(key) || [];
      list.push(asset);
      map.set(key, list);
    }
  }

  return map;
}

function findAsset(
  source: string,
  assetMap: Map<string, CloudinaryAsset[]>,
) {
  const key = normalizeKey(source);
  const exact = assetMap.get(key);
  if (exact?.length === 1) return { asset: exact[0], key };
  if (exact && exact.length > 1) return { asset: exact[0], key };

  for (const [candidate, assets] of assetMap.entries()) {
    if (
      candidate.startsWith(`${key}-`) ||
      candidate.startsWith(`${key}_`) ||
      candidate.endsWith(`-${key}`) ||
      candidate.endsWith(`_${key}`) ||
      key.endsWith(`-${candidate}`) ||
      key.endsWith(`_${candidate}`)
    ) {
      return { asset: assets[0], key: candidate };
    }
  }

  return null;
}

function replaceMarkdownImageUrls(
  markdown: string,
  assets: CloudinaryAsset[],
): ReplaceResult {
  const assetMap = buildAssetMap(assets);
  const replaced: ReplaceResult["replaced"] = [];
  const unmatchedSet = new Set<string>();

  let output = markdown.replace(
    /(!\[[^\]]*\]\()([^\s)]+)(\s+["'][^"']*["'])?(\))/g,
    (full, prefix: string, source: string, title = "", suffix: string) => {
      if (/^https?:\/\//i.test(source) && source.includes("res.cloudinary.com")) {
        return full;
      }

      const match = findAsset(source, assetMap);
      if (!match) {
        unmatchedSet.add(source);
        return full;
      }

      replaced.push({ from: source, to: match.asset.secureUrl, key: match.key });
      return `${prefix}${match.asset.secureUrl}${title}${suffix}`;
    },
  );

  output = output.replace(
    /(<img[^>]+src=["'])([^"']+)(["'][^>]*>)/g,
    (full, prefix: string, source: string, suffix: string) => {
      if (/^https?:\/\//i.test(source) && source.includes("res.cloudinary.com")) {
        return full;
      }

      const match = findAsset(source, assetMap);
      if (!match) {
        unmatchedSet.add(source);
        return full;
      }

      replaced.push({ from: source, to: match.asset.secureUrl, key: match.key });
      return `${prefix}${match.asset.secureUrl}${suffix}`;
    },
  );

  return {
    output,
    replaced,
    unmatched: [...unmatchedSet],
    assets,
  };
}

export function CloudinaryMdUrlTool() {
  const [folder, setFolder] = useState("");
  const [markdownFile, setMarkdownFile] = useState<File | null>(null);
  const [markdown, setMarkdown] = useState("");
  const [result, setResult] = useState<ReplaceResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const canRun = useMemo(
    () => folder.trim().length > 0 && markdown.trim().length > 0,
    [folder, markdown],
  );

  const handleFileChange = async (file: File | null) => {
    setMarkdownFile(file);
    setResult(null);
    setError("");

    if (!file) {
      setMarkdown("");
      return;
    }

    if (!file.name.toLowerCase().endsWith(".md")) {
      setError("Vui lòng chọn file .md");
      setMarkdown("");
      return;
    }

    setMarkdown(await file.text());
  };

  const runReplace = async () => {
    if (!canRun) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/admin/cloudinary-assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folder }),
      });
      const payload = await response.json();

      if (!response.ok || !payload?.ok) {
        throw new Error(payload?.error || "Không thể lấy ảnh từ Cloudinary");
      }

      setResult(replaceMarkdownImageUrls(markdown, payload.data || []));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  const copyOutput = async () => {
    if (!result?.output) return;
    await navigator.clipboard.writeText(result.output);
  };

  const downloadOutput = () => {
    if (!result?.output) return;
    const blob = new Blob([result.output], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = markdownFile?.name || "index.md";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 rounded-lg border border-slate-200 bg-white p-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-slate-900">
          Cloudinary Markdown URL Tool
        </h2>
        <p className="text-sm text-slate-600">
          Nhập folder Cloudinary, chọn file index.md, tool sẽ thay các link ảnh
          trong Markdown bằng URL Cloudinary bằng cách so sánh tên ảnh, bỏ qua
          đuôi file như .jpg, .png, .webp.
        </p>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-slate-900">
          Folder Cloudinary
        </label>
        <input
          value={folder}
          onChange={(event) => setFolder(event.target.value)}
          placeholder="Ví dụ: Thiết kế nội thất chung cư"
          className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none focus:ring-2 focus:ring-amber-500"
        />
        <p className="text-xs text-slate-500">
          Nhập đúng folder đang chứa ảnh trên Cloudinary, không cần dấu / ở đầu
          hoặc cuối.
        </p>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-slate-900">
          File Markdown
        </label>
        <div className="relative rounded-lg border-2 border-dashed border-amber-300 bg-amber-50 px-6 py-4">
          <input
            type="file"
            accept=".md,text/markdown,text/plain"
            onChange={(event) =>
              void handleFileChange(event.target.files?.[0] ?? null)
            }
            className="absolute inset-0 cursor-pointer opacity-0"
          />
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-amber-600" />
            <div>
              <p className="font-semibold text-slate-900">
                {markdownFile?.name || "Chọn file index.md"}
              </p>
              <p className="text-sm text-slate-600">
                Tool chỉ xử lý text trên máy bạn, không lưu DB.
              </p>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <Button
        type="button"
        onClick={runReplace}
        disabled={!canRun || loading}
        className="w-full bg-amber-600 hover:bg-amber-700"
      >
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Đang lấy ảnh và thay URL...
          </span>
        ) : (
          "Lấy URL Cloudinary và thay trong Markdown"
        )}
      </Button>

      {result && (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase text-slate-500">
                Assets
              </p>
              <p className="text-2xl font-bold text-slate-900">
                {result.assets.length}
              </p>
            </div>
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
              <p className="text-xs font-semibold uppercase text-emerald-700">
                Đã thay
              </p>
              <p className="text-2xl font-bold text-emerald-800">
                {result.replaced.length}
              </p>
            </div>
            <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
              <p className="text-xs font-semibold uppercase text-orange-700">
                Chưa match
              </p>
              <p className="text-2xl font-bold text-orange-800">
                {result.unmatched.length}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button type="button" onClick={copyOutput} variant="outline">
              <Copy className="mr-2 h-4 w-4" />
              Copy Markdown
            </Button>
            <Button type="button" onClick={downloadOutput} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Tải index.md
            </Button>
          </div>

          {result.replaced.length > 0 && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
              <div className="mb-2 flex items-center gap-2 font-semibold">
                <CheckCircle2 className="h-4 w-4" />
                Các ảnh đã được thay URL
              </div>
              <div className="max-h-44 space-y-2 overflow-auto">
                {result.replaced.map((item, index) => (
                  <p key={`${item.from}-${index}`} className="break-all">
                    <span className="font-semibold">{item.from}</span>
                    {" -> "}
                    {item.to}
                  </p>
                ))}
              </div>
            </div>
          )}

          {result.unmatched.length > 0 && (
            <div className="rounded-lg border border-orange-200 bg-orange-50 p-4 text-sm text-orange-800">
              <p className="mb-2 font-semibold">Ảnh chưa tìm thấy URL match:</p>
              <div className="max-h-44 space-y-1 overflow-auto">
                {result.unmatched.map((item) => (
                  <p key={item} className="break-all">
                    {item}
                  </p>
                ))}
              </div>
            </div>
          )}

          <textarea
            value={result.output}
            readOnly
            className="h-96 w-full rounded-lg border border-slate-300 p-4 font-mono text-xs outline-none"
          />
        </div>
      )}
    </div>
  );
}
