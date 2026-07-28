"use client";

import { useEffect, useMemo, useState } from "react";
import type { RefObject } from "react";

const PAGE_ASPECT_RATIO = 794 / 1123;

interface Size {
  width: number;
  height: number;
}

export function useFlipbookSize(containerRef: RefObject<HTMLElement>) {
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    let frameId = 0;
    const observer = new ResizeObserver(([entry]) => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => {
        const rect = entry.contentRect;
        setSize({
          width: Math.max(0, rect.width),
          height: Math.max(0, rect.height),
        });
      });
    });

    observer.observe(element);
    return () => {
      cancelAnimationFrame(frameId);
      observer.disconnect();
    };
  }, [containerRef]);

  return useMemo(() => {
    const isMobile = size.width < 820;
    const horizontalPadding = isMobile ? 44 : 148;
    const verticalPadding = isMobile ? 108 : 118;
    const availableWidth = Math.max(280, size.width - horizontalPadding);
    const availableHeight = Math.max(420, size.height - verticalPadding);
    const pagesAcross = isMobile ? 1 : 2;
    const pageWidthBySpace = availableWidth / pagesAcross;
    const pageWidthByHeight = availableHeight * PAGE_ASPECT_RATIO;
    const calculatedWidth = Math.floor(
      Math.min(pageWidthBySpace, pageWidthByHeight)
    );
    const minPageWidth = isMobile ? 250 : 430;
    const maxPageWidth = isMobile ? 430 : 620;
    const pageWidth = Math.min(
      maxPageWidth,
      Math.max(minPageWidth, calculatedWidth)
    );
    const pageHeight = Math.floor(pageWidth / PAGE_ASPECT_RATIO);

    return {
      isMobile,
      pageWidth,
      pageHeight,
    };
  }, [size.height, size.width]);
}
