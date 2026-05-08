"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/shared/container";
import { useEffect, useRef, useState } from "react";

export function About() {
  const stats = [
    { label: "Dự án", value: "200+" },
    { label: "Khách hàng", value: "300+" },
    { label: "Công trình", value: "200+" },
    { label: "Hài lòng", value: "98%" },
  ];

  const sectionRef = useRef<HTMLElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setHasAnimated(true);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="bg-white text-slate-900">
      {/* ── Main content ─────────────────────────────────── */}
      <Container className="py-12 sm:py-14 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 md:items-center md:gap-14">
          {/* Left – Text */}
          <div className="space-y-7">
            {/* Badge */}
            <span className="inline-block rounded-full border border-amber-400/60 bg-amber-50 px-4 py-1 text-xs font-bold uppercase tracking-[0.25em] text-amber-600">
              Về chúng tôi
            </span>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold uppercase leading-tight text-[#1f4569] md:text-3xl">
                Không gian là ngôn ngữ
                <br />
                <span className="text-2xl font-bold uppercase leading-tight text-[#1f4569] md:text-3xl">
                  phản chiếu phong cách sống
                </span>
              </h2>

              {/* Accent border left */}
              <div className="border-l-4 border-amber-500 pl-5">
                <p className="text-base leading-relaxed text-slate-600 md:text-lg">
                  Tại{" "}
                  <span className="font-semibold text-slate-800">
                    Hei Design
                  </span>
                  , thay vì những khuôn mẫu, chúng tôi điêu khắc giá trị vô hình
                  thành nét nội thất tinh xảo — nơi thẩm mỹ và công năng giao
                  thoa tuyệt đối. Mỗi dự án là một tuyên ngôn về sự{" "}
                  <span className="italic font-semibold text-amber-600">
                    &quot;Độc bản&quot;
                  </span>
                  , nơi bản sắc cá nhân và văn hóa doanh nghiệp được tôn vinh
                  đầy kiêu hãnh.
                </p>
              </div>
            </div>

            <Link
              href="/gioi-thieu"
              className="group inline-flex items-center gap-3 text-base font-semibold uppercase tracking-[0.15em] text-[#1f4569] transition hover:text-amber-600"
            >
              <span>Đọc thêm</span>
              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-current transition group-hover:bg-amber-600 group-hover:border-amber-600 group-hover:text-white">
                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          </div>

          {/* Right – Image with decorative accents */}
          <div className="relative">
            {/* Decorative background block */}
            <div className="absolute -bottom-4 -right-4 h-full w-full rounded-2xl border-2 border-amber-400/40 bg-amber-50/60" />
            <div className="relative h-[380px] overflow-hidden rounded-2xl shadow-xl md:h-[460px]">
              <Image
                src="/upload/about/image.png"
                alt="HEI Team"
                fill
                className="object-cover transition duration-700 hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {/* Experience badge */}
              <div className="absolute bottom-5 left-5 rounded-xl bg-[#0a1628]/85 px-4 py-3 text-white backdrop-blur-sm">
                <p className="text-2xl font-bold text-amber-400">10+</p>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-300">
                  Năm kinh nghiệm
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* ── Stats strip — dark background ────────────────── */}
      <div className="bg-[#0a1628]">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div
                key={stat.value}
                className={`flex flex-col items-center justify-center py-8 px-4 text-center ${
                  index !== stats.length - 1
                    ? "border-b border-white/10 md:border-b-0 md:border-r"
                    : ""
                } ${index % 2 === 0 && index + 1 < stats.length ? "border-r border-white/10 md:border-r-0 md:border-r" : ""}`}
              >
                <AnimatedStat value={stat.value} active={hasAnimated} />
                <p className="mt-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </div>
    </section>
  );
}

function AnimatedStat({ value, active }: { value: string; active: boolean }) {
  const match = value.match(/^(\d+)(.*)$/);
  const target = match ? Number(match[1]) : 0;
  const suffix = match?.[2] ?? value;
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!active) return;

    let frame = 0;
    const duration = 1200;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(target * eased));

      if (progress < 1) {
        frame = window.requestAnimationFrame(tick);
      }
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [active, target]);

  if (!match) {
    return (
      <p className="text-3xl font-bold text-amber-400 sm:text-4xl">{value}</p>
    );
  }

  return (
    <p className="text-3xl font-bold text-amber-400 sm:text-4xl md:text-5xl">
      {active ? displayValue : 0}
      {suffix}
    </p>
  );
}
