"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

type CategoryItem = {
  id: number;
  name: string;
};

type ArticleSectionItem = {
  id: number;
  name: string;
  code?: string;
};

type ArticleTypeItem = {
  id: number;
  name: string;
  code: string;
  sectionId: number;
  sectionCode: string;
  sectionName: string;
};

type TaxonomyResponse = {
  ok: boolean;
  data: {
    blogCategories: CategoryItem[];
    projectCategories: CategoryItem[];
    projectStyles: CategoryItem[];
    articleSections: ArticleSectionItem[];
    articleTypes: ArticleTypeItem[];
  };
  error?: string;
};

type TabKey =
  | "blog-category"
  | "project-category"
  | "project-style"
  | "article-type";

const tabMeta: Record<TabKey, { label: string; hint: string }> = {
  "project-category": {
    label: "Category dự án",
    hint: "Nhóm công trình cho phần dự án hoàn thiện",
  },
  "project-style": {
    label: "Style dự án",
    hint: "Phong cách cho phần kiến trúc",
  },
  "blog-category": {
    label: "Category blog",
    hint: "Phân loại nội dung cho Kinh nghiệm hay",
  },
  "article-type": {
    label: "Mục bài viết",
    hint: "Danh mục hiển thị cho thiết kế/thi công",
  },
};

export function TaxonomyManager() {
  const [tab, setTab] = useState<TabKey>("project-category");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [blogCategories, setBlogCategories] = useState<CategoryItem[]>([]);
  const [projectCategories, setProjectCategories] = useState<CategoryItem[]>(
    [],
  );
  const [projectStyles, setProjectStyles] = useState<CategoryItem[]>([]);
  const [articleSections, setArticleSections] = useState<ArticleSectionItem[]>(
    [],
  );
  const [articleTypes, setArticleTypes] = useState<ArticleTypeItem[]>([]);

  const [newName, setNewName] = useState("");
  const [newCode, setNewCode] = useState("");
  const [sectionId, setSectionId] = useState<number>(0);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const [editingCode, setEditingCode] = useState("");
  const [editingSectionId, setEditingSectionId] = useState<number>(0);

  const sectionOptions = useMemo(() => articleSections, [articleSections]);

  const reload = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/taxonomies", { cache: "no-store" });
      const payload = (await res.json()) as TaxonomyResponse;
      if (!res.ok || !payload.ok) {
        throw new Error(payload.error || "Không thể tải dữ liệu taxonomy");
      }

      setBlogCategories(payload.data.blogCategories || []);
      setProjectCategories(payload.data.projectCategories || []);
      setProjectStyles(payload.data.projectStyles || []);
      setArticleSections(payload.data.articleSections || []);
      setArticleTypes(payload.data.articleTypes || []);

      if (!sectionId && payload.data.articleSections?.[0]) {
        setSectionId(payload.data.articleSections[0].id);
      }
      if (!editingSectionId && payload.data.articleSections?.[0]) {
        setEditingSectionId(payload.data.articleSections[0].id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void reload();
  }, []);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    setError("");

    const body: any = {
      kind: tab,
      name: newName,
    };

    if (tab === "article-type") {
      body.code = newCode || undefined;
      body.sectionId = sectionId;
    }

    const res = await fetch("/api/taxonomies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const payload = await res.json();
    if (!res.ok || !payload.ok) {
      setError(payload.error || "Không thể tạo item");
      return;
    }

    setNewName("");
    setNewCode("");
    await reload();
  };

  const handleDelete = async (id: number) => {
    setError("");
    const res = await fetch(`/api/taxonomies?kind=${tab}&id=${id}`, {
      method: "DELETE",
    });
    const payload = await res.json();
    if (!res.ok || !payload.ok) {
      setError(payload.error || "Không thể xóa item");
      return;
    }
    await reload();
  };

  const handleUpdate = async () => {
    if (!editingId || !editingName.trim()) return;

    const body: any = {
      kind: tab,
      id: editingId,
      name: editingName,
    };
    if (tab === "article-type") {
      body.code = editingCode || undefined;
      body.sectionId = editingSectionId;
    }

    const res = await fetch("/api/taxonomies", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const payload = await res.json();
    if (!res.ok || !payload.ok) {
      setError(payload.error || "Không thể cập nhật item");
      return;
    }

    setEditingId(null);
    setEditingName("");
    setEditingCode("");
    await reload();
  };

  const items =
    tab === "blog-category"
      ? blogCategories
      : tab === "project-category"
        ? projectCategories
        : tab === "project-style"
          ? projectStyles
          : articleTypes;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Button
          variant={tab === "project-category" ? "default" : "outline"}
          onClick={() => setTab("project-category")}
        >
          Category Dự Án
        </Button>
        <Button
          variant={tab === "project-style" ? "default" : "outline"}
          onClick={() => setTab("project-style")}
        >
          Style Dự Án
        </Button>
        <Button
          variant={tab === "blog-category" ? "default" : "outline"}
          onClick={() => setTab("blog-category")}
        >
          Category Blog
        </Button>
        <Button
          variant={tab === "article-type" ? "default" : "outline"}
          onClick={() => setTab("article-type")}
        >
          Mục Bài Viết
        </Button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
        <p className="text-sm font-medium text-slate-700">
          {tabMeta[tab].label}
        </p>
        <p className="text-xs text-slate-500">{tabMeta[tab].hint}</p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="space-y-3 rounded-xl border border-slate-200 p-4">
        <h3 className="text-lg font-semibold">Thêm mới</h3>
        <div className="grid gap-3 md:grid-cols-3">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Tên"
            className="rounded-lg border border-gray-300 px-3 py-2"
          />
          {tab === "article-type" && (
            <input
              type="text"
              value={newCode}
              onChange={(e) => setNewCode(e.target.value)}
              placeholder="Code (vd: biet-thu)"
              className="rounded-lg border border-gray-300 px-3 py-2"
            />
          )}
          {tab === "article-type" && (
            <select
              value={sectionId}
              onChange={(e) => setSectionId(Number(e.target.value))}
              className="rounded-lg border border-gray-300 px-3 py-2"
            >
              {sectionOptions.map((section) => (
                <option key={section.id} value={section.id}>
                  {section.name}
                </option>
              ))}
            </select>
          )}
        </div>
        <Button onClick={handleCreate}>Thêm</Button>
      </div>

      <div className="rounded-xl border border-slate-200 p-4">
        <h3 className="mb-3 text-lg font-semibold">Danh sách</h3>
        {loading ? (
          <p className="text-sm text-gray-600">Đang tải...</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-gray-600">Chưa có dữ liệu</p>
        ) : (
          <div className="space-y-3">
            {items.map((item: any) => {
              const isEditing = editingId === item.id;
              return (
                <div
                  key={item.id}
                  className="flex flex-col gap-3 rounded-lg border border-slate-200 p-3"
                >
                  {isEditing ? (
                    <>
                      <div className="grid gap-3 md:grid-cols-3">
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className="rounded-lg border border-gray-300 px-3 py-2"
                        />
                        {tab === "article-type" && (
                          <input
                            type="text"
                            value={editingCode}
                            onChange={(e) => setEditingCode(e.target.value)}
                            className="rounded-lg border border-gray-300 px-3 py-2"
                          />
                        )}
                        {tab === "article-type" && (
                          <select
                            value={editingSectionId}
                            onChange={(e) =>
                              setEditingSectionId(Number(e.target.value))
                            }
                            className="rounded-lg border border-gray-300 px-3 py-2"
                          >
                            {sectionOptions.map((section) => (
                              <option key={section.id} value={section.id}>
                                {section.name}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleUpdate}>
                          Lưu
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingId(null)}
                        >
                          Hủy
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-sm">
                        <p className="font-medium">{item.name}</p>
                        {item.code && (
                          <p className="text-gray-500">code: {item.code}</p>
                        )}
                        {tab === "project-style" && !item.code && (
                          <p className="text-gray-500">Style dự án</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingId(item.id);
                            setEditingName(item.name);
                            setEditingCode(item.code || "");
                            setEditingSectionId(item.sectionId || sectionId);
                          }}
                        >
                          Sửa
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-200 text-red-600 hover:bg-red-50"
                          onClick={() => void handleDelete(item.id)}
                        >
                          Xóa
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
