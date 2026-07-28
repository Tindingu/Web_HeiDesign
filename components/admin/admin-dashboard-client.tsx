"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  CircleDashed,
  Clock3,
  FileText,
  FolderKanban,
  Gauge,
  ImageIcon,
  Layers3,
  Loader2,
  MessageSquareQuote,
  Newspaper,
  RefreshCw,
  Sparkles,
  Video,
} from "lucide-react";
import { AnimatedNumber } from "@/components/admin/animated-number";
import type {
  AdminDashboardData,
  DashboardChartItem,
  DashboardModuleHealth,
} from "@/lib/admin-dashboard-data";

const CACHE_KEY = "hei-admin-dashboard-cache-v1";

function percent(value: number, total: number) {
  if (total <= 0) return 0;
  return Math.round((value / total) * 100);
}

function formatDate(value?: string | null) {
  if (!value) return "Chưa sync dữ liệu";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Chưa sync dữ liệu";
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function toneClass(tone: DashboardChartItem["tone"]) {
  if (tone === "amber") return "bg-amber-500";
  if (tone === "emerald") return "bg-emerald-500";
  if (tone === "sky") return "bg-sky-500";
  if (tone === "rose") return "bg-rose-500";
  return "bg-slate-700";
}

function Panel({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="hei-dashboard-rise rounded-[26px] bg-white/95 p-5">
      <div className="mb-5">
        <h2 className="text-lg font-bold text-slate-950">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

function StatCard({
  label,
  value,
  note,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number;
  note: string;
  icon: React.ComponentType<{ className?: string }>;
  tone: "slate" | "amber" | "emerald" | "sky";
}) {
  const toneMap = {
    slate: "bg-white/15 text-white",
    amber: "bg-amber-100 text-amber-700",
    emerald: "bg-emerald-100 text-emerald-700",
    sky: "bg-sky-100 text-sky-700",
  };
  const cardToneMap = {
    slate:
      "bg-slate-950 text-white shadow-[0_24px_55px_rgba(15,23,42,0.22)]",
    amber: "bg-amber-50 text-slate-950",
    emerald: "bg-emerald-50 text-slate-950",
    sky: "bg-sky-50 text-slate-950",
  };
  const mutedToneMap = {
    slate: "text-slate-300",
    amber: "text-amber-900/65",
    emerald: "text-emerald-900/65",
    sky: "text-sky-900/65",
  };
  const labelToneMap = {
    slate: "text-slate-300",
    amber: "text-amber-700/70",
    emerald: "text-emerald-700/70",
    sky: "text-sky-700/70",
  };

  return (
    <div
      className={`hei-dashboard-rise rounded-[26px] p-5 ${cardToneMap[tone]}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p
            className={`text-xs font-semibold uppercase tracking-[0.16em] ${labelToneMap[tone]}`}
          >
            {label}
          </p>
          <p className="mt-3 text-4xl font-bold tracking-tight">
            <AnimatedNumber value={value} />
          </p>
          <p className={`mt-2 text-sm ${mutedToneMap[tone]}`}>{note}</p>
        </div>
        <div className={`grid h-12 w-12 place-items-center rounded-2xl ${toneMap[tone]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function MiniBars({ data }: { data: DashboardChartItem[] }) {
  const max = Math.max(...data.map((item) => item.value), 1);

  return (
    <div className="space-y-3">
      {data.map((item) => (
        <div
          key={item.label}
          className="group relative grid grid-cols-[120px_1fr_44px] items-center gap-3 text-sm"
        >
          <p className="truncate font-medium text-slate-600">{item.label}</p>
          <div className="h-8 overflow-hidden rounded-xl bg-slate-100">
            <div
              className={`hei-dashboard-bar-x flex h-full items-center justify-end rounded-xl pr-2 text-xs font-bold text-white transition-all duration-500 group-hover:brightness-110 ${toneClass(item.tone)}`}
              style={{ width: `${Math.max(8, percent(item.value, max))}%` }}
            >
              <AnimatedNumber value={item.value} />
            </div>
          </div>
          <p className="text-right font-semibold text-slate-700">
            <AnimatedNumber value={item.value} />
          </p>
          <div className="pointer-events-none absolute right-10 top-1/2 z-10 -translate-y-1/2 translate-x-2 rounded-xl bg-slate-950 px-3 py-2 text-xs font-medium text-white opacity-0 shadow-xl transition duration-200 group-hover:translate-x-0 group-hover:opacity-100">
            {item.label}: {item.value} mục
          </div>
        </div>
      ))}
    </div>
  );
}

function ColumnChart({ data }: { data: DashboardChartItem[] }) {
  const max = Math.max(...data.map((item) => item.value), 1);
  const guideValues = [max, Math.ceil(max / 2), 0];

  return (
    <div className="rounded-[22px] bg-slate-50/80 px-4 pb-4 pt-5">
      <div className="relative h-[190px]">
        <div className="absolute inset-x-0 bottom-10 top-0">
          {guideValues.map((value, index) => (
            <div
              key={`${value}-${index}`}
              className="absolute left-0 right-0 flex items-center gap-2"
              style={{ top: `${index * 50}%` }}
            >
              <span className="w-6 text-right text-[10px] font-semibold text-slate-400">
                {value}
              </span>
              <span className="h-px flex-1 bg-slate-200/80" />
            </div>
          ))}
        </div>
        <div className="absolute inset-x-8 bottom-0 top-0 flex items-end gap-3">
          {data.map((item) => {
            const height = Math.max(14, percent(item.value, max));
            return (
              <div
                key={item.label}
                className="group relative flex min-w-0 flex-1 flex-col items-center justify-end gap-3"
              >
                <div className="pointer-events-none absolute bottom-[calc(100%+10px)] left-1/2 z-10 -translate-x-1/2 translate-y-2 whitespace-nowrap rounded-xl bg-slate-950 px-3 py-2 text-xs font-medium text-white opacity-0 shadow-xl transition duration-200 group-hover:translate-y-0 group-hover:opacity-100">
                  {item.label}: {item.value} dự án
                </div>
                <div className="relative flex h-[140px] w-full items-end justify-center">
                  <span
                    className="absolute text-xs font-bold text-slate-700 transition group-hover:text-slate-950"
                    style={{ bottom: `calc(${height}% + 8px)` }}
                  >
                    <AnimatedNumber value={item.value} />
                  </span>
                  <span
                    className="absolute h-px w-8 bg-slate-300"
                    style={{ bottom: `calc(${height}% + 2px)` }}
                  />
                  <div
                    className={`hei-dashboard-bar-y w-full max-w-[54px] rounded-t-2xl ${toneClass(item.tone)} opacity-90 transition-all duration-500 ease-out group-hover:scale-y-105 group-hover:opacity-100 group-hover:shadow-lg`}
                    style={{ height: `${height}%`, transformOrigin: "bottom" }}
                  />
                </div>
                <p className="line-clamp-2 min-h-[32px] text-center text-xs font-semibold leading-4 text-slate-500 transition group-hover:text-slate-900">
                  {item.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between border-t border-slate-200/70 pt-3 text-xs text-slate-500">
        <span>Số dự án</span>
        <span className="font-semibold text-slate-700">
          Tổng{" "}
          <AnimatedNumber value={data.reduce((sum, item) => sum + item.value, 0)} />
        </span>
      </div>
    </div>
  );
}

function DonutChart({
  data,
  centerLabel,
}: {
  data: DashboardChartItem[];
  centerLabel: string;
}) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let current = 0;
  const palette = ["#d97706", "#059669", "#0284c7", "#e11d48", "#475569"];
  const stops =
    total > 0
      ? data
          .map((item, index) => {
            const start = current;
            current += (item.value / total) * 100;
            return `${palette[index % palette.length]} ${start}% ${current}%`;
          })
          .join(", ")
      : "#e2e8f0 0% 100%";

  return (
    <div className="grid gap-5 md:grid-cols-[220px_1fr] md:items-center">
      <div className="hei-dashboard-pop group relative mx-auto grid h-[220px] w-[220px] place-items-center rounded-full transition duration-300 hover:scale-[1.02]">
        <div
          className="absolute inset-0 rounded-full transition duration-500 group-hover:rotate-6"
          style={{ background: `conic-gradient(${stops})` }}
        />
        <div className="relative grid h-[138px] w-[138px] place-items-center rounded-full bg-white text-center">
          <div>
            <p className="text-3xl font-bold text-slate-950">
              <AnimatedNumber value={total} />
            </p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              {centerLabel}
            </p>
          </div>
        </div>
      </div>
      <div className="space-y-3">
        {data.map((item, index) => (
          <div
            key={item.label}
            className="group relative flex items-center justify-between gap-3 rounded-2xl bg-slate-50/80 px-3 py-2 transition hover:bg-white"
          >
            <div className="flex min-w-0 items-center gap-3">
              <span
                className="h-3 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: palette[index % palette.length] }}
              />
              <span className="truncate text-sm font-semibold text-slate-700">
                {item.label}
              </span>
            </div>
            <span className="font-bold text-slate-950">
              <AnimatedNumber value={item.value} />
            </span>
            <div className="pointer-events-none absolute right-3 top-10 z-10 rounded-xl bg-slate-950 px-3 py-2 text-xs font-medium text-white opacity-0 shadow-xl transition group-hover:opacity-100">
              {percent(item.value, total)}% tổng số
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RadialList({ data }: { data: DashboardChartItem[] }) {
  const max = Math.max(...data.map((item) => item.value), 1);

  return (
    <div className="grid grid-cols-2 gap-3">
      {data.map((item) => {
        const ratio = percent(item.value, max);
        return (
          <div
            key={item.label}
            className="hei-dashboard-rise group relative rounded-2xl bg-slate-50/80 p-4 text-center transition hover:-translate-y-1 hover:bg-white"
          >
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-full transition group-hover:scale-105">
              <div
                className="absolute h-20 w-20 rounded-full"
                style={{
                  background: `conic-gradient(#0284c7 ${ratio}%, #e2e8f0 ${ratio}% 100%)`,
                }}
              />
              <div className="relative grid h-14 w-14 place-items-center rounded-full bg-white">
                <span className="text-lg font-bold text-slate-950">
                  <AnimatedNumber value={item.value} />
                </span>
              </div>
            </div>
            <p className="mt-3 line-clamp-2 text-xs font-semibold leading-4 text-slate-600">
              {item.label}
            </p>
            <div className="pointer-events-none absolute left-1/2 top-3 z-10 -translate-x-1/2 -translate-y-2 whitespace-nowrap rounded-xl bg-slate-950 px-3 py-2 text-xs font-medium text-white opacity-0 shadow-xl transition group-hover:translate-y-0 group-hover:opacity-100">
              {item.value} slot đã cấu hình
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ProgressLine({
  label,
  value,
  total,
  href,
}: {
  label: string;
  value: number;
  total: number;
  href?: string;
}) {
  const ratio = percent(value, total);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="font-semibold text-slate-700">{label}</span>
        <span className="text-slate-500">
          <AnimatedNumber value={value} />/<AnimatedNumber value={total} /> mục
        </span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className="hei-dashboard-bar-x h-full rounded-full bg-gradient-to-r from-amber-500 to-emerald-500"
          style={{ width: `${ratio}%` }}
        />
      </div>
      {href && (
        <Link
          href={href}
          className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 hover:text-amber-800"
        >
          Mở module <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  );
}

function ModuleCard({ item }: { item: DashboardModuleHealth }) {
  const ratio = percent(Math.min(item.value, item.target), item.target);
  const done = item.value >= item.target;

  return (
    <Link
      href={item.href}
      className="group relative rounded-2xl bg-slate-50/80 p-4 transition duration-300 hover:-translate-y-1 hover:bg-amber-50/80"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-slate-900">{item.label}</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            {item.description}
          </p>
        </div>
        {done ? (
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
        ) : (
          <CircleDashed className="h-5 w-5 shrink-0 text-amber-500" />
        )}
      </div>
      <div className="mt-4 flex items-end justify-between">
        <p className="text-2xl font-bold text-slate-950">
          <AnimatedNumber value={item.value} />
        </p>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
          {item.unit}
        </p>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
        <div
          className={`hei-dashboard-bar-x h-full rounded-full transition-all duration-500 group-hover:brightness-110 ${done ? "bg-emerald-500" : "bg-amber-500"}`}
          style={{ width: `${ratio}%` }}
        />
      </div>
    </Link>
  );
}

function EmptyState({ onSync, loading }: { onSync: () => void; loading: boolean }) {
  return (
    <div className="grid min-h-[72vh] place-items-center">
      <div className="max-w-xl rounded-[30px] bg-white/95 p-8 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-slate-950 text-amber-300">
          <Gauge className="h-6 w-6" />
        </div>
        <h1 className="mt-5 text-2xl font-bold text-slate-950">
          Dashboard chưa có dữ liệu sync
        </h1>
        <p className="mt-3 text-sm leading-7 text-slate-500">
          Trang này không tự truy vấn Neon khi vừa mở. Nhấn nút bên dưới khi bạn
          muốn lấy số liệu mới nhất cho admin dashboard.
        </p>
        <button
          type="button"
          onClick={onSync}
          disabled={loading}
          className="mt-6 inline-flex h-11 items-center gap-2 rounded-2xl bg-slate-950 px-5 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-wait disabled:opacity-70"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          Sync dữ liệu
        </button>
      </div>
    </div>
  );
}

export function AdminDashboardClient() {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const cached = window.localStorage.getItem(CACHE_KEY);
    if (!cached) return;
    try {
      setData(JSON.parse(cached) as AdminDashboardData);
    } catch {
      window.localStorage.removeItem(CACHE_KEY);
    }
  }, []);

  const syncData = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/dashboard", {
        cache: "no-store",
      });
      const payload = await response.json();
      if (!response.ok || !payload?.ok) {
        throw new Error(payload?.error || "Không thể sync dashboard");
      }
      setData(payload.data);
      window.localStorage.setItem(CACHE_KEY, JSON.stringify(payload.data));
    } catch (syncError) {
      setError(
        syncError instanceof Error
          ? syncError.message
          : "Không thể sync dashboard",
      );
    } finally {
      setLoading(false);
    }
  };

  const resourceIcons = useMemo(
    () => [Layers3, Sparkles, FileText, ImageIcon, Video, MessageSquareQuote],
    [],
  );

  if (!data) {
    return <EmptyState onSync={syncData} loading={loading} />;
  }

  return (
    <div className="space-y-6">
      {/* <section className="hei-dashboard-rise overflow-hidden rounded-[30px] bg-slate-950 text-white shadow-[0_22px_55px_rgba(15,23,42,0.18)]">
        <div className="relative p-6 sm:p-8">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(245,158,11,0.22),transparent_30%),radial-gradient(circle_at_85%_15%,rgba(14,165,233,0.18),transparent_28%)]" />
          <div className="relative flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">
                <Gauge className="h-3.5 w-3.5" />
                Admin Dashboard
              </p>
              <h1 className="mt-4 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">
                Báo cáo tổng quan website HEI Design
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
                Dữ liệu chỉ được làm mới khi bạn nhấn Sync, giúp tránh việc mở
                dashboard là truy vấn Neon liên tục.
              </p>
            </div>
            <div className="space-y-3">
              <div className="rounded-2xl bg-white/10 px-4 py-3 text-right">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-300">
                  Dữ liệu sync lúc
                </p>
                <p className="mt-1 text-lg font-bold text-white">
                  {formatDate(data.syncedAt)}
                </p>
              </div>
              <button
                type="button"
                onClick={syncData}
                disabled={loading}
                className="ml-auto flex h-10 items-center gap-2 rounded-2xl bg-amber-500 px-4 text-sm font-bold text-slate-950 transition hover:bg-amber-400 disabled:cursor-wait disabled:opacity-75"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                Sync dữ liệu
              </button>
            </div>
          </div>
        </div>
      </section> */}
<div className="flex flex-col gap-3 rounded-2xl bg-white/10 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
  <div>
    <p className="text-black uppercase tracking-[0.16em] text-slate-300">
      Dữ liệu sync lúc
    </p>

    <p className="mt-1 text-lg font-bold text-black">
      {formatDate(data.syncedAt)}
    </p>
  </div>

  <button
    type="button"
    onClick={syncData}
    disabled={loading}
    className="flex h-10 shrink-0 items-center justify-center gap-2  bg-amber-500 px-4 text-sm font-bold text-slate-950 transition hover:bg-amber-400 disabled:cursor-wait disabled:opacity-75"
  >
    {loading ? (
      <Loader2 className="h-4 w-4 animate-spin" />
    ) : (
      <RefreshCw className="h-4 w-4" />
    )}

    {loading ? "Đang đồng bộ..." : "Sync dữ liệu"}
  </button>
</div>

      {error && (
        <div className="rounded-2xl bg-rose-50 p-4 text-sm font-semibold text-rose-700">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Tổng nội dung"
          value={data.stats.totalPublicContent}
          note={`${data.stats.recentTotal} nội dung cập nhật 30 ngày gần đây`}
          icon={Layers3}
          tone="slate"
        />
        <StatCard
          label="Dự án thi công"
          value={data.stats.projectCount}
          note={`${data.stats.featuredProjectCount} dự án đang đánh dấu nổi bật`}
          icon={FolderKanban}
          tone="amber"
        />
        <StatCard
          label="Bài SEO dự án"
          value={data.stats.articleCount}
          note={`${data.stats.coveragePercent}% hạng mục đã có bài đại diện`}
          icon={FileText}
          tone="emerald"
        />
        <StatCard
          label="Blog kinh nghiệm"
          value={data.stats.blogCount}
          note={`${data.stats.recentBlogCount} bài cập nhật trong 30 ngày`}
          icon={Newspaper}
          tone="sky"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Panel
          title="Tổng quan nội dung public"
          subtitle="So sánh nhanh các nhóm nội dung chính đang tạo traffic cho website"
        >
          <MiniBars data={data.contentBars} />
        </Panel>
        <Panel
          title="Mức độ phủ bài viết SEO"
          subtitle="Dựa trên các hạng mục bài viết đã khai báo trong Category & Style"
        >
          <div className="space-y-5">
            <ProgressLine
              label="Hạng mục đã có bài"
              value={data.stats.writtenArticleTypeCount}
              total={data.stats.articleTypeCount}
              href="/admin/du-an"
            />
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-emerald-50 p-4">
                <p className="text-3xl font-bold text-emerald-700">
                  <AnimatedNumber value={data.stats.writtenTargetCount} />
                </p>
                <p className="text-sm text-emerald-900/70">Đã viết</p>
              </div>
              <div className="rounded-2xl bg-amber-50 p-4">
                <p className="text-3xl font-bold text-amber-700">
                  <AnimatedNumber value={data.stats.seoGapCount} />
                </p>
                <p className="text-sm text-amber-900/70">Còn thiếu</p>
              </div>
            </div>
          </div>
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Panel title="Dự án theo loại hình" subtitle="Top nhóm dự án hiện có">
          <ColumnChart data={data.projectCategoryBars} />
        </Panel>
        <Panel title="Bài SEO theo section" subtitle="Thiết kế, thi công, dự án">
          <DonutChart data={data.articleSectionBars} centerLabel="bài SEO" />
        </Panel>
        <Panel title="Gallery kiến trúc" subtitle="Số slot đã cấu hình theo style">
          <RadialList data={data.galleryBars} />
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.95fr]">
        <Panel
          title="Trạng thái module trang chủ"
          subtitle="Các module quan trọng ảnh hưởng trực tiếp đến trải nghiệm homepage"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {data.moduleHealth.map((item) => (
              <ModuleCard key={item.label} item={item} />
            ))}
          </div>
        </Panel>
        <Panel
          title="Việc nên xử lý tiếp"
          subtitle="Ưu tiên các hạng mục thiếu bài hoặc module chưa đủ dữ liệu"
        >
          {data.todoItems.length === 0 ? (
            <div className="rounded-2xl bg-emerald-50 p-5 text-emerald-800">
              <CheckCircle2 className="mb-3 h-7 w-7" />
              <p className="font-semibold">Các module chính đang ổn.</p>
              <p className="mt-1 text-sm text-emerald-700">
                Tiếp tục cập nhật nội dung mới để duy trì tín hiệu SEO.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.todoItems.map((item) => (
                <Link
                  key={`${item.label}-${item.note}`}
                  href={item.href}
                  className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50/80 p-3 transition hover:bg-amber-50/80"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${
                        item.tone === "rose"
                          ? "bg-rose-100 text-rose-600"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      <AlertTriangle className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-800">
                        {item.label}
                      </p>
                      <p className="text-xs text-slate-500">{item.note}</p>
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-400" />
                </Link>
              ))}
            </div>
          )}
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Panel title="Tài nguyên hệ thống" subtitle="Số lượng taxonomy và media module">
          <div className="grid gap-3 sm:grid-cols-2">
            {data.systemResources.map((item, index) => {
              const Icon = resourceIcons[index] || Layers3;
              return (
                <div key={item.label} className="rounded-2xl bg-slate-50/90 p-4">
                  <Icon className="h-5 w-5 text-amber-600" />
                  <p className="mt-3 text-2xl font-bold text-slate-950">
                    <AnimatedNumber value={item.value} />
                  </p>
                  <p className="text-sm text-slate-500">{item.label}</p>
                </div>
              );
            })}
          </div>
        </Panel>
        <Panel title="Lịch sử cập nhật gần nhất" subtitle="Module nào vừa được chỉnh sửa">
          <div className="space-y-3">
            {data.latestRows.map((item) => (
              <div
                key={`${item.label}-${item.updatedAt}`}
                className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50/90 p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-white text-slate-600">
                    <Clock3 className="h-4 w-4" />
                  </div>
                  <p className="font-semibold text-slate-800">{item.label}</p>
                </div>
                <p className="text-right text-xs font-medium text-slate-500">
                  {formatDate(item.updatedAt)}
                </p>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
