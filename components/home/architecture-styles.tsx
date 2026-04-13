"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/shared/container";
import { useState } from "react";

const architectureStyles = [
  {
    id: "modern",
    name: "MODERN LUXURY",
    projects: Array(4)
      .fill(null)
      .map((_, i) => ({
        image: `/upload/architecture/modern-${i + 1}.jpg`,
      })),
  },
  {
    id: "contemporary",
    name: "HIỆN ĐẠI",
    projects: Array(4)
      .fill(null)
      .map((_, i) => ({
        image: `/upload/architecture/contemporary-${i + 1}.jpg`,
      })),
  },
  {
    id: "classic",
    name: "TÂN CỔ ĐIỂN",
    projects: Array(4)
      .fill(null)
      .map((_, i) => ({
        image: `/upload/architecture/classic-${i + 1}.jpg`,
      })),
  },
  {
    id: "wabi",
    name: "WABI SABI",
    projects: Array(4)
      .fill(null)
      .map((_, i) => ({
        image: `/upload/architecture/wabi-${i + 1}.jpg`,
      })),
  },
  {
    id: "minimalism",
    name: "MINIMALISM",
    projects: Array(4)
      .fill(null)
      .map((_, i) => ({
        image: `/upload/architecture/minimalism-${i + 1}.jpg`,
      })),
  },
  {
    id: "japandi",
    name: "JAPANDI",
    projects: Array(4)
      .fill(null)
      .map((_, i) => ({
        image: `/upload/architecture/japandi-${i + 1}.jpg`,
      })),
  },
  {
    id: "tropical",
    name: "TROPICAL",
    projects: Array(4)
      .fill(null)
      .map((_, i) => ({
        image: `/upload/architecture/tropical-${i + 1}.jpg`,
      })),
  },
];

export function ArchitectureStyles() {
  const [activeTab, setActiveTab] = useState("modern");

  const activeStyle = architectureStyles.find(
    (style) => style.id === activeTab,
  );

  return (
    <section className="bg-gray-900 py-20 text-white">
      <Container className="space-y-12">
        {/* Header */}
        <h2 className="text-5xl font-bold md:text-6xl">KIẾN TRÚC NHÀ PHỐ</h2>

        {/* Tabs */}
        <div className="flex flex-wrap gap-6 border-b border-gray-700 pb-6">
          {architectureStyles.map((style) => (
            <button
              key={style.id}
              onClick={() => setActiveTab(style.id)}
              className={`text-sm font-semibold uppercase tracking-wide transition-colors ${
                activeTab === style.id
                  ? "text-amber-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {style.name}
            </button>
          ))}
        </div>

        {/* Projects Grid - 4 columns */}
        {activeStyle && (
          <div className="grid gap-4 md:grid-cols-4">
            {activeStyle.projects.map((project, idx) => (
              <div
                key={idx}
                className="group relative h-64 overflow-hidden rounded-lg md:h-80"
              >
                <Image
                  src={project.image}
                  alt={`${activeStyle.name} ${idx + 1}`}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 25vw"
                />
                <div className="absolute inset-0 bg-black/20 transition duration-300 group-hover:bg-black/40" />
              </div>
            ))}
          </div>
        )}

        {/* View More */}
        <div className="flex justify-end">
          <Link
            href="/kien-truc"
            className="inline-flex items-center gap-3 text-lg font-semibold transition hover:text-amber-400"
          >
            <span>XEM THÊM</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-current">
              <ArrowRight className="h-5 w-5" />
            </div>
          </Link>
        </div>
      </Container>
    </section>
  );
}
