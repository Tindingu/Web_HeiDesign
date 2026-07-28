"use client";

import dynamic from "next/dynamic";
import type { PdfFlipbookProps } from "./types";

const PdfFlipbookClient = dynamic(
  () => import("./pdf-flipbook").then((module) => module.PdfFlipbook),
  {
    ssr: false,
    loading: () => (
      <div className="grid min-h-screen place-items-center bg-[#151515] text-white">
        Đang tải flipbook...
      </div>
    ),
  }
);

export function PdfFlipbookLoader(props: PdfFlipbookProps) {
  return <PdfFlipbookClient {...props} />;
}
