"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { LeadCaptureForm } from "@/components/contact/lead-capture-form";

export function LeadCapturePopup() {
  const pathname = usePathname();
  const pageUrl = pathname || "/";
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;

    const firstTimer = window.setTimeout(() => setIsOpen(true), 5000);
    const repeatTimer = window.setInterval(
      () => setIsOpen(true),
      5 * 60 * 1000,
    );

    return () => {
      window.clearTimeout(firstTimer);
      window.clearInterval(repeatTimer);
    };
  }, [pathname]);

  if (pathname.startsWith("/admin")) return null;

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
              onClick={() => setIsOpen(false)}
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
                  Để lại thông tin để ICEP gọi lại
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
                onSuccess={() =>
                  window.setTimeout(() => setIsOpen(false), 5 * 60 * 1000)
                }
              />
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
