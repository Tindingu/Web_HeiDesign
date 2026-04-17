"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Project } from "@/lib/strapi";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import Link from "next/link";

type FormData = Omit<Project, "id" | "createdAt" | "updatedAt">;

const initialFormData: FormData = {
  slug: "",
  title: "",
  summary: "",
  description: "",
  category: "Căn hộ",
  style: "Hiện đại",
  budget: "3-5 tỷ",
  coverImage: { url: "", alt: "", blurDataURL: "" },
  gallery: [],
  details: [
    { label: "Diện tích", value: "" },
    { label: "Thời gian", value: "" },
    { label: "Phạm vi", value: "" },
  ],
  projectDetails: {
    area: "",
    duration: "",
    scope: "",
    client: "",
    location: "",
    completedDate: "",
  },
  highlights: [],
  sections: [],
  wordContent: "",
  featured: false,
};

export function ProjectForm({ project }: { project?: Project }) {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>(
    project || initialFormData,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [useWordArticle, setUseWordArticle] = useState(
    Boolean(project?.wordContent),
  );
  const [wordFile, setWordFile] = useState<File | null>(null);
  const [wordLoading, setWordLoading] = useState(false);
  const [wordError, setWordError] = useState("");
  const [wordMessage, setWordMessage] = useState("");
  const [categoryOptions, setCategoryOptions] = useState<string[]>([
    "Căn hộ",
    "Biệt thự",
    "Nhà phố",
    "Văn phòng",
    "Khách sạn",
    "Café",
  ]);
  const [styleOptions, setStyleOptions] = useState<string[]>([
    "Hiện đại",
    "Tân cổ điển",
    "Minimalism",
    "Japandi",
    "Wabi Sabi",
    "Tropical",
    "Modern Luxury",
  ]);

  useEffect(() => {
    const loadTaxonomies = async () => {
      try {
        const response = await fetch("/api/taxonomies", { cache: "no-store" });
        const payload = await response.json();
        if (!response.ok || !payload?.ok) return;
        const categoryNames = (payload?.data?.projectCategories || [])
          .map((item: { name: string }) => item.name)
          .filter(Boolean);
        const styleNames = (payload?.data?.projectStyles || [])
          .map((item: { name: string }) => item.name)
          .filter(Boolean);

        if (categoryNames.length > 0) {
          const mergedCategories = project?.category && !categoryNames.includes(project.category)
            ? [project.category, ...categoryNames]
            : categoryNames;
          setCategoryOptions(mergedCategories);
          setFormData((prev) => ({
            ...prev,
            category: prev.category || mergedCategories[0],
          }));
        }

        if (styleNames.length > 0) {
          const mergedStyles = project?.style && !styleNames.includes(project.style)
            ? [project.style, ...styleNames]
            : styleNames;
          setStyleOptions(mergedStyles);
          setFormData((prev) => ({
            ...prev,
            style: prev.style || mergedStyles[0],
          }));
        }
      } catch {
        // Keep fallback list.
      }
    };

    void loadTaxonomies();
  }, [project?.category, project?.style]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError("");

      try {
        const method = project ? "PUT" : "POST";
        const url = project
          ? `/api/projects?id=${project.id}`
          : "/api/projects";

        const payload = {
          ...formData,
          wordContent: useWordArticle ? formData.wordContent || "" : "",
        };

        const response = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error("Failed to save project");
        }

        router.push("/admin/projects");
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    },
    [formData, project, router, useWordArticle],
  );

  const handleConvertWord = useCallback(async () => {
    if (!wordFile) {
      setWordError("Vui lòng chọn file Word (.docx)");
      setWordMessage("");
      return;
    }

    if (!wordFile.name.toLowerCase().endsWith(".docx")) {
      setWordError("Chỉ hỗ trợ file .docx");
      setWordMessage("");
      return;
    }

    setWordLoading(true);
    setWordError("");
    setWordMessage("");

    try {
      const uploadData = new FormData();
      uploadData.append("file", wordFile);
      uploadData.append("autoCreate", "false");

      const response = await fetch("/api/convert-word", {
        method: "POST",
        body: uploadData,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Chuyển đổi file Word thất bại");
      }

      const data = await response.json();
      setFormData((prev) => ({ ...prev, wordContent: data.markdown || "" }));
      setWordMessage("Đã chuyển đổi file Word thành nội dung bài viết dự án.");
    } catch (err) {
      setWordError(err instanceof Error ? err.message : "Có lỗi xảy ra");
    } finally {
      setWordLoading(false);
    }
  }, [wordFile]);

  return (
    <Container className="py-12">
      <div className="max-w-2xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">
            {project ? "Sửa Dự Án" : "Thêm Dự Án Mới"}
          </h1>
          <Link href="/admin/projects">
            <Button variant="outline">Quay Lại</Button>
          </Link>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <fieldset className="space-y-4">
            <legend className="text-lg font-semibold">Thông Tin Cơ Bản</legend>

            <div>
              <label className="block text-sm font-medium">Slug*</label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Tiêu Đề*</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Mô Tả Ngắn*</label>
              <textarea
                required
                value={formData.summary}
                onChange={(e) =>
                  setFormData({ ...formData, summary: e.target.value })
                }
                rows={2}
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">
                Mô Tả Chi Tiết*
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={4}
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium">Loại Hình</label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {categoryOptions.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <Link
                  href="/admin/categories"
                  className="mt-2 inline-block text-xs text-amber-700 hover:underline"
                >
                  Quản lý category/style dự án
                </Link>
              </div>

              <div>
                <label className="block text-sm font-medium">Phong Cách</label>
                <select
                  value={formData.style}
                  onChange={(e) =>
                    setFormData({ ...formData, style: e.target.value })
                  }
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {styleOptions.map((style) => (
                    <option key={style} value={style}>
                      {style}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium">Ngân Sách</label>
                <input
                  type="text"
                  value={formData.budget}
                  onChange={(e) =>
                    setFormData({ ...formData, budget: e.target.value })
                  }
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="e.g. 3-5 tỷ"
                />
              </div>
            </div>
          </fieldset>

          {/* Cover Image */}
          <fieldset className="space-y-4">
            <legend className="text-lg font-semibold">Ảnh Bìa</legend>

            <div>
              <label className="block text-sm font-medium">URL Ảnh*</label>
              <input
                type="text"
                required
                value={formData.coverImage.url}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    coverImage: { ...formData.coverImage, url: e.target.value },
                  })
                }
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="/upload/projects/..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Alt Text</label>
              <input
                type="text"
                value={formData.coverImage.alt}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    coverImage: { ...formData.coverImage, alt: e.target.value },
                  })
                }
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </fieldset>

          {/* Gallery Images */}
          <fieldset className="space-y-4">
            <legend className="text-lg font-semibold">Hình Ảnh Dự Án</legend>
            <p className="text-sm text-gray-600">
              Thêm nhiều hình ảnh cho phần gallery
            </p>

            {/* Existing Gallery Images */}
            {formData.gallery.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm font-medium">Các ảnh hiện có:</p>
                {formData.gallery.map((image, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg border border-gray-200 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div>
                          <label className="block text-xs font-medium text-gray-600">
                            URL Ảnh {idx + 1}
                          </label>
                          <input
                            type="text"
                            value={image.url}
                            onChange={(e) => {
                              const newGallery = [...formData.gallery];
                              newGallery[idx].url = e.target.value;
                              setFormData({ ...formData, gallery: newGallery });
                            }}
                            className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-500"
                            placeholder="/upload/projects/..."
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600">
                            Alt Text
                          </label>
                          <input
                            type="text"
                            value={image.alt}
                            onChange={(e) => {
                              const newGallery = [...formData.gallery];
                              newGallery[idx].alt = e.target.value;
                              setFormData({ ...formData, gallery: newGallery });
                            }}
                            className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-500"
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const newGallery = formData.gallery.filter(
                            (_, i) => i !== idx,
                          );
                          setFormData({ ...formData, gallery: newGallery });
                        }}
                        className="mt-1 rounded bg-red-50 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add Gallery Image Button */}
            <button
              type="button"
              onClick={() => {
                setFormData({
                  ...formData,
                  gallery: [
                    ...formData.gallery,
                    { url: "", alt: "", blurDataURL: "" },
                  ],
                });
              }}
              className="rounded-lg border-2 border-dashed border-amber-300 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700 hover:bg-amber-100"
            >
              + Thêm Ảnh Mới
            </button>
          </fieldset>

          {/* Sections - Chi Tiết Các Phòng/Khu Vực */}
          <fieldset className="space-y-4">
            <legend className="text-lg font-semibold">
              Chi Tiết Các Phòng/Khu Vực
            </legend>
            <p className="text-sm text-gray-600">
              Thêm nội dung chi tiết cho các phòng/khu vực với hình ảnh
            </p>

            {/* Existing Sections */}
            {formData.sections && formData.sections.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm font-medium">Các phòng hiện có:</p>
                {formData.sections.map((section, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg border border-gray-200 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600">
                            Tiêu Đề Phòng/Khu Vực {idx + 1}
                          </label>
                          <input
                            type="text"
                            value={section.title}
                            onChange={(e) => {
                              const newSections = [...formData.sections!];
                              newSections[idx].title = e.target.value;
                              setFormData({
                                ...formData,
                                sections: newSections,
                              });
                            }}
                            className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-500"
                            placeholder="e.g. Phòng Khách - Không Gian Tiếp Khách"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-600">
                            Nội Dung Mô Tả
                          </label>
                          <textarea
                            value={section.content}
                            onChange={(e) => {
                              const newSections = [...formData.sections!];
                              newSections[idx].content = e.target.value;
                              setFormData({
                                ...formData,
                                sections: newSections,
                              });
                            }}
                            rows={3}
                            className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-500"
                            placeholder="Mô tả chi tiết về phòng/khu vực..."
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-600">
                            URL Hình Ảnh
                          </label>
                          <input
                            type="text"
                            value={section.image?.url || ""}
                            onChange={(e) => {
                              const newSections = [...formData.sections!];
                              if (!newSections[idx].image) {
                                newSections[idx].image = { url: "", alt: "" };
                              }
                              newSections[idx].image.url = e.target.value;
                              setFormData({
                                ...formData,
                                sections: newSections,
                              });
                            }}
                            className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-500"
                            placeholder="/upload/projects/..."
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-600">
                            Alt Text Hình Ảnh
                          </label>
                          <input
                            type="text"
                            value={section.image?.alt || ""}
                            onChange={(e) => {
                              const newSections = [...formData.sections!];
                              if (!newSections[idx].image) {
                                newSections[idx].image = { url: "", alt: "" };
                              }
                              newSections[idx].image.alt = e.target.value;
                              setFormData({
                                ...formData,
                                sections: newSections,
                              });
                            }}
                            className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-500"
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const newSections = formData.sections!.filter(
                            (_, i) => i !== idx,
                          );
                          setFormData({ ...formData, sections: newSections });
                        }}
                        className="mt-1 rounded bg-red-50 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add Section Button */}
            <button
              type="button"
              onClick={() => {
                const newSection = {
                  title: "",
                  content: "",
                  image: { url: "", alt: "" },
                };
                setFormData({
                  ...formData,
                  sections: [...(formData.sections || []), newSection],
                });
              }}
              className="rounded-lg border-2 border-dashed border-amber-300 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700 hover:bg-amber-100"
            >
              + Thêm Phòng/Khu Vực Mới
            </button>
          </fieldset>

          

          {/* Highlights - Điểm Nổi Bật */}
          <fieldset className="space-y-4">
            <legend className="text-lg font-semibold">Điểm Nổi Bật</legend>
            <p className="text-sm text-gray-600">
              Thêm những điểm nổi bật của dự án
            </p>

            {/* Existing Highlights */}
            {formData.highlights && formData.highlights.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Các điểm nổi bật hiện có:</p>
                {formData.highlights.map((highlight, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={highlight}
                      onChange={(e) => {
                        const newHighlights = [...formData.highlights!];
                        newHighlights[idx] = e.target.value;
                        setFormData({ ...formData, highlights: newHighlights });
                      }}
                      className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="e.g. Thiết kế nội thất cao cấp..."
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newHighlights = formData.highlights!.filter(
                          (_, i) => i !== idx,
                        );
                        setFormData({ ...formData, highlights: newHighlights });
                      }}
                      className="rounded bg-red-50 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
                    >
                      Xóa
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add Highlight Button */}
            <button
              type="button"
              onClick={() => {
                setFormData({
                  ...formData,
                  highlights: [...(formData.highlights || []), ""],
                });
              }}
              className="rounded-lg border-2 border-dashed border-amber-300 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700 hover:bg-amber-100"
            >
              + Thêm Điểm Nổi Bật Mới
            </button>
          </fieldset>

          {/* Project Details */}
          <fieldset className="space-y-4">
            <legend className="text-lg font-semibold">Chi Tiết Dự Án</legend>

            {formData.projectDetails && (
              <>
                <div>
                  <label className="block text-sm font-medium">Diện Tích</label>
                  <input
                    type="text"
                    value={formData.projectDetails.area}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        projectDetails: {
                          ...formData.projectDetails!,
                          area: e.target.value,
                        },
                      })
                    }
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="e.g. 320 m²"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">Thời Gian</label>
                  <input
                    type="text"
                    value={formData.projectDetails.duration}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        projectDetails: {
                          ...formData.projectDetails!,
                          duration: e.target.value,
                        },
                      })
                    }
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="e.g. 6 tháng"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">Phạm Vi</label>
                  <input
                    type="text"
                    value={formData.projectDetails.scope}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        projectDetails: {
                          ...formData.projectDetails!,
                          scope: e.target.value,
                        },
                      })
                    }
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="e.g. Thiết kế + Thi công"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">
                    Khách Hàng
                  </label>
                  <input
                    type="text"
                    value={formData.projectDetails.client || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        projectDetails: {
                          ...formData.projectDetails!,
                          client: e.target.value,
                        },
                      })
                    }
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">Địa Điểm</label>
                  <input
                    type="text"
                    value={formData.projectDetails.location || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        projectDetails: {
                          ...formData.projectDetails!,
                          location: e.target.value,
                        },
                      })
                    }
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </>
            )}
          </fieldset>

          {/* Featured */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured || false}
              onChange={(e) =>
                setFormData({ ...formData, featured: e.target.checked })
              }
              className="h-4 w-4"
            />
            <label htmlFor="featured" className="text-sm font-medium">
              Dự án nổi bật
            </label>
          </div>
          <fieldset className="space-y-4 rounded-lg border-2 border-dashed border-amber-300 bg-amber-50 p-4">
            <legend className="px-2 text-lg font-semibold">
              Bài Viết Từ Word (Tùy Chọn)
            </legend>

            <label className="flex items-center gap-2 text-sm font-medium">
              <input
                type="checkbox"
                checked={useWordArticle}
                onChange={(e) => {
                  const isChecked = e.target.checked;
                  setUseWordArticle(isChecked);
                  setWordError("");
                  setWordMessage("");
                  if (!isChecked) {
                    setWordFile(null);
                    setFormData({ ...formData, wordContent: "" });
                  }
                }}
                className="h-4 w-4"
              />
              Dùng bài viết chuyển từ file Word cho project này
            </label>

            {useWordArticle && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium">
                    File Word (.docx)
                  </label>
                  <input
                    type="file"
                    accept=".docx"
                    onChange={(e) => setWordFile(e.target.files?.[0] || null)}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleConvertWord}
                  disabled={wordLoading}
                  className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700 disabled:bg-gray-400"
                >
                  {wordLoading
                    ? "Đang chuyển đổi..."
                    : "Chuyển Word thành bài viết"}
                </button>

                {wordMessage && (
                  <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
                    {wordMessage}
                  </p>
                )}

                {wordError && (
                  <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                    {wordError}
                  </p>
                )}

                <div>
                  <label className="block text-sm font-medium">
                    Nội dung bài viết (Markdown)
                  </label>
                  <textarea
                    value={formData.wordContent || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, wordContent: e.target.value })
                    }
                    rows={12}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Nội dung sau khi chuyển từ Word sẽ xuất hiện ở đây..."
                  />
                </div>
              </div>
            )}
          </fieldset>

          {/* Submit */}
          <div className="flex gap-4 pt-6">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-amber-600 hover:bg-amber-700"
            >
              {loading ? "Đang lưu..." : "Lưu Dự Án"}
            </Button>
            <Link href="/admin/projects" className="flex-1">
              <Button variant="outline" className="w-full">
                Hủy
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </Container>
  );
}
