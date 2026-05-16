import Link from "next/link";
import { ArrowLeft, Construction } from "lucide-react";

type ConfiguratorComingSoonProps = {
  title: string;
};

export function ConfiguratorComingSoon({ title }: ConfiguratorComingSoonProps) {
  return (
    <main className="min-h-[70vh] bg-slate-950 px-4 py-16 text-white sm:px-6 lg:px-8">
      <section className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full border border-amber-300/30 bg-amber-300/10 text-amber-300 shadow-[0_24px_80px_rgba(245,158,11,0.12)]">
          <Construction className="h-10 w-10" />
        </div>

        <p className="mt-8 text-sm font-semibold uppercase tracking-[0.22em] text-amber-300">
          {title}
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          Chức năng này đang được phát triển
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-white/65">
          HEI Design đang chuẩn bị dữ liệu mask và vật liệu cho không gian này.
          Bạn có thể thử trước công cụ phối màu phòng bếp đang hoạt động.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/phoimau-bep"
            className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-200"
          >
            Thử phối màu phòng bếp
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white/75 transition hover:border-white/35 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Về trang chủ
          </Link>
        </div>
      </section>
    </main>
  );
}
