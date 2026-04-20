"use client";

import { useEffect, useState } from "react";
import type { Heading } from "@/lib/mdx";
import { Menu, X } from "lucide-react";

export function BlogToc({ headings }: { headings: Heading[] }) {
  const [active, setActive] = useState<string | null>(headings[0]?.id ?? null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const elements = headings
      .map((heading) => document.getElementById(heading.id))
      .filter(Boolean) as HTMLElement[];
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -60% 0px" },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed left-4 top-1/2 z-40 -translate-y-1/2 rounded-full border border-border/70 bg-background/95 p-3 shadow-sm"
        aria-label="Mở mục lục bài viết"
      >
        <Menu className="h-6 w-6 text-foreground" />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/30"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="absolute left-3 top-24 w-[min(88vw,360px)] max-h-[72vh] overflow-hidden rounded-lg border border-border/70 bg-background shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border/60 px-3 py-2">
              <p className="text-2xl font-bold text-foreground">Nội dung</p>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label="Đóng mục lục bài viết"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <ul className="max-h-[58vh] space-y-1 overflow-y-auto p-3 text-sm leading-snug">
              {headings.map((heading) => (
                <li
                  key={heading.id}
                  className={heading.level === 3 ? "pl-3" : ""}
                >
                  <a
                    href={`#${heading.id}`}
                    onClick={() => setIsOpen(false)}
                    className={`block rounded px-2 py-1 transition-colors ${
                      active === heading.id
                        ? "bg-muted text-foreground font-medium"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {heading.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
