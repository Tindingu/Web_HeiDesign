"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [showRouteLoader, setShowRouteLoader] = useState(false);
  const isFirstRenderRef = useRef(true);
  const routeKey = pathname;

  useEffect(() => {
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      return;
    }

    setShowRouteLoader(true);
    const timeout = window.setTimeout(() => {
      setShowRouteLoader(false);
    }, 560);

    return () => window.clearTimeout(timeout);
  }, [routeKey]);

  return (
    <>
      <AnimatePresence>
        {showRouteLoader && (
          <motion.div
            key="route-loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="pointer-events-none fixed inset-0 z-[95] grid place-items-center bg-[#0a1220]/42 backdrop-blur-[2px]"
          >
            <div className="flex items-center gap-3 rounded-full border border-white/20 bg-[#0a1220]/88 px-4 py-3 text-white shadow-xl">
              <span className="relative h-5 w-5">
                <span className="hei-loader-pulse absolute inset-0 rounded-full border border-amber-300/40" />
                <span className="absolute inset-0 rounded-full border-2 border-white/30" />
                <span className="hei-loader-spin absolute inset-0 rounded-full border-2 border-transparent border-t-amber-400 border-r-amber-300" />
              </span>
              <span className="hei-loader-shimmer text-xs font-semibold uppercase tracking-[0.2em]">
                Đang tải...
              </span>
              <span className="flex items-center gap-1 pl-0.5">
                <span className="hei-loader-dot h-1.5 w-1.5 rounded-full bg-amber-300 [animation-delay:0ms]" />
                <span className="hei-loader-dot h-1.5 w-1.5 rounded-full bg-amber-300 [animation-delay:120ms]" />
                <span className="hei-loader-dot h-1.5 w-1.5 rounded-full bg-amber-300 [animation-delay:240ms]" />
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div
          key={routeKey}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </>
  );
}
