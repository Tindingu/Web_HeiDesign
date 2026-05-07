"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { LeadCaptureForm } from "@/components/contact/lead-capture-form";

const POPUP_NEXT_AT_KEY = "HEI_lead_popup_next_at";
const FIVE_SECONDS = 5_000;
const FIVE_MINUTES = 5 * 60_000;

export function LeadCapturePopup() {
  const pathname = usePathname();
  const pageUrl = pathname || "/";
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;

    const now = Date.now();
    const nextAtRaw = window.localStorage.getItem(POPUP_NEXT_AT_KEY);
    const nextAt = nextAtRaw ? Number(nextAtRaw) : 0;
    const initialDelay = nextAt > now ? nextAt - now : FIVE_SECONDS;

    const timer = window.setTimeout(() => {
      setIsOpen(true);
      window.localStorage.setItem(
        POPUP_NEXT_AT_KEY,
        String(Date.now() + FIVE_MINUTES),
      );
    }, initialDelay);

    return () => window.clearTimeout(timer);
  }, [pathname]);

  if (pathname.startsWith("/admin")) return null;

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
          className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-4 shadow-2xl"
          >
            <button
              type="button"
              onClick={closeAndScheduleNext}
              aria-label="Đóng form"
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-slate-950 text-white transition hover:bg-[#1f4569]"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="space-y-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="space-y-2 pr-8">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
                  Liên hệ nhanh
                </p>
                <h2 className="text-xl font-bold uppercase leading-tight text-[#1f4569]">
                  Để lại thông tin để HEI liên hệ
                </h2>
                <p className="text-sm leading-6 text-slate-600">
                  Chúng tôi sẽ liên hệ và tư vấn phương án phù hợp trong thời
                  gian sớm nhất.
                </p>
              </div>

              <LeadCaptureForm
                pageUrl={pageUrl}
                source="Popup liên hệ"
                submitLabel="Gửi ngay"
                onSuccess={closeAndScheduleNext}
              />
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
