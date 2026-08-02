"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { LeadCaptureForm } from "@/components/contact/lead-capture-form";

const POPUP_NEXT_AT_KEY = "HEI_lead_popup_next_at";
const INITIAL_POPUP_DELAY = 50_000;
const FIVE_MINUTES = 5 * 60_000;

export function LeadCapturePopup() {
  const pathname = usePathname();
  const pageUrl = pathname || "/";
  const [isOpen, setIsOpen] = useState(false);
  const shouldHidePopup =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/uat") ||
    pathname === "/bao-gia";

  useEffect(() => {
    if (shouldHidePopup) return;

    const now = Date.now();
    const nextAtRaw = window.localStorage.getItem(POPUP_NEXT_AT_KEY);
    const nextAt = nextAtRaw ? Number(nextAtRaw) : 0;
    const initialDelay = nextAt > now ? nextAt - now : INITIAL_POPUP_DELAY;

    const timer = window.setTimeout(() => {
      setIsOpen(true);
      window.localStorage.setItem(
        POPUP_NEXT_AT_KEY,
        String(Date.now() + FIVE_MINUTES),
      );
    }, initialDelay);

    return () => window.clearTimeout(timer);
  }, [pathname, shouldHidePopup]);

  if (shouldHidePopup) return null;

  const closeAndScheduleNext = () => {
    setIsOpen(false);
    window.localStorage.setItem(
      POPUP_NEXT_AT_KEY,
      String(Date.now() + FIVE_MINUTES),
    );
  };

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-slate-950/62 px-2 py-3 backdrop-blur-sm sm:px-5 sm:py-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 26, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className="relative w-full max-w-[31rem] overflow-hidden rounded-2xl border border-white/70 bg-[linear-gradient(135deg,#ffffff_0%,#fbfaf8_52%,#f3eee8_100%)] p-1.5 shadow-[0_28px_80px_rgba(15,23,42,0.28)] sm:rounded-[1.75rem] sm:p-4"
          >
            <div className="pointer-events-none absolute -left-16 top-0 h-56 w-56 rounded-full bg-[#f5f2ee]/80 blur-3xl" />
            <div className="pointer-events-none absolute bottom-[-5rem] right-[-5rem] h-64 w-64 rounded-full bg-[#d2bca7]/26 blur-3xl" />

            <button
              type="button"
              onClick={closeAndScheduleNext}
              aria-label="Đóng form"
              className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[#0b1220] text-white shadow-lg transition hover:bg-[#1f4569] sm:right-4 sm:top-4 sm:h-9 sm:w-9"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="relative rounded-[0.85rem] border border-slate-200/80 bg-white/90 px-4 py-4 shadow-[0_18px_48px_rgba(63,46,34,0.12)] backdrop-blur-xl sm:rounded-[1.45rem] sm:p-7">
              <div className="max-w-sm pr-8 sm:pr-9">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#6f5948] sm:text-xs sm:tracking-[0.26em]">
                  Liên hệ nhanh
                </p>
                <h2 className="mt-2 text-xl font-bold leading-tight tracking-tight text-[#111827] sm:mt-3 sm:text-3xl">
                  Nhận Miễn Phí Thiết Kế
                </h2>
                <p className="mt-1.5 text-xs leading-5 text-[#3a2d24]/75 sm:mt-2 sm:text-sm sm:leading-6">
                  Để lại thông tin, HEI sẽ tư vấn phương án phù hợp.
                </p>
              </div>

              <LeadCaptureForm
                pageUrl={pageUrl}
                source="Popup liên hệ"
                submitLabel="Nhận tư vấn ngay"
                onSuccess={closeAndScheduleNext}
                variant="luxury"
                className="mt-3.5 sm:mt-5"
              />
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
