"use client";

import { useCallback, useEffect, useState } from "react";
import type { RefObject } from "react";

export function useFullscreen(targetRef: RefObject<HTMLElement>) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleChange = () => {
      setIsFullscreen(document.fullscreenElement === targetRef.current);
    };

    document.addEventListener("fullscreenchange", handleChange);
    return () => document.removeEventListener("fullscreenchange", handleChange);
  }, [targetRef]);

  const toggleFullscreen = useCallback(async () => {
    const target = targetRef.current;
    if (!target) return;

    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }

    await target.requestFullscreen();
  }, [targetRef]);

  return { isFullscreen, toggleFullscreen };
}
