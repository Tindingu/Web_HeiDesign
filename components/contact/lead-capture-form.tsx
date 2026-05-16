"use client";

import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type LeadCaptureFormProps = {
  pageUrl: string;
  source: string;
  className?: string;
  onSuccess?: () => void;
  submitLabel?: string;
  buttonClassName?: string;
  compact?: boolean;
  variant?: "default" | "luxury";
};

const initialState = {
  fullName: "",
  phone: "",
  need: "",
};

const luxuryFieldClass =
  "h-[3.2rem] w-full rounded-xl border border-slate-200/85 bg-white px-4 text-sm text-[#17120e] shadow-sm outline-none transition duration-300 placeholder:text-[#75685f]/65 focus:border-[#1f4569]/55 focus:ring-4 focus:ring-[#1f4569]/10";

const defaultFieldClass =
  "h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1f4569] focus:ring-4 focus:ring-[#1f4569]/10";

export function LeadCaptureForm({
  pageUrl,
  source,
  className,
  onSuccess,
  submitLabel = "Gửi ngay",
  buttonClassName,
  compact = false,
  variant = "default",
}: LeadCaptureFormProps) {
  const [formState, setFormState] = useState(initialState);
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const isLuxury = variant === "luxury";

  const updateField = (field: keyof typeof initialState, value: string) => {
    setFormState((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "sending") return;

    setStatus("sending");
    setMessage("");

    try {
      const response = await fetch("/api/contact-leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formState,
          pageUrl,
          source,
        }),
      });

      const payload = (await response.json()) as {
        ok?: boolean;
        error?: string;
      };

      if (!response.ok || !payload.ok) {
        throw new Error(
          payload.error || "Không thể gửi thông tin ngay lúc này.",
        );
      }

      setStatus("success");
      setMessage("Đã gửi thông tin. HEI sẽ liên hệ sớm.");
      setFormState(initialState);
      onSuccess?.();
      window.setTimeout(() => setStatus("idle"), 4000);
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Không thể gửi thông tin ngay lúc này.",
      );
    }
  };

  const fieldClass = isLuxury ? luxuryFieldClass : defaultFieldClass;

  return (
    <form
      className={cn(isLuxury ? "space-y-3.5" : "space-y-4", className)}
      onSubmit={handleSubmit}
    >
      <div
        className={cn(
          compact ? "grid gap-4 md:grid-cols-3" : "space-y-4",
          isLuxury && "space-y-3.5",
        )}
      >
        <div className={cn(isLuxury ? "space-y-0" : "space-y-2")}>
          {!isLuxury && (
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Họ và tên
            </label>
          )}
          <input
            value={formState.fullName}
            onChange={(event) => updateField("fullName", event.target.value)}
            required
            placeholder={isLuxury ? "Tên của bạn" : "Nhập họ và tên"}
            className={fieldClass}
          />
        </div>

        <div className={cn(isLuxury ? "space-y-0" : "space-y-2")}>
          {!isLuxury && (
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Số điện thoại
            </label>
          )}
          <input
            value={formState.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            required
            placeholder={isLuxury ? "Số điện thoại" : "Nhập số điện thoại"}
            className={fieldClass}
          />
        </div>

        <div
          className={cn(
            isLuxury ? "space-y-0" : "space-y-2",
            compact ? "md:col-span-1" : "",
          )}
        >
          {!isLuxury && (
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Bạn muốn HEI tư vấn gì?
            </label>
          )}
          <textarea
            value={formState.need}
            onChange={(event) => updateField("need", event.target.value)}
            required
            rows={compact || isLuxury ? 3 : 4}
            placeholder={
              isLuxury ? "Bạn muốn tư vấn hạng mục nào?" : "Mô tả nhu cầu của bạn"
            }
            className={cn(
              isLuxury
                ? "min-h-[6.5rem] w-full rounded-xl border border-slate-200/85 bg-white px-4 py-4 text-sm text-[#17120e] shadow-sm outline-none transition duration-300 placeholder:text-[#75685f]/65 focus:border-[#1f4569]/55 focus:ring-4 focus:ring-[#1f4569]/10"
                : "min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1f4569] focus:ring-4 focus:ring-[#1f4569]/10",
            )}
          />
        </div>
      </div>

      <input type="hidden" name="pageUrl" value={pageUrl} />
      <input type="hidden" name="source" value={source} />

      <div
        className={cn(
          "flex flex-col gap-3 sm:flex-row sm:items-center",
          isLuxury && "pt-1",
        )}
      >
        <Button
          type="submit"
          size="lg"
          className={cn(
            isLuxury
              ? "h-[3.2rem] rounded-xl bg-[#0b1220] px-6 text-sm font-semibold uppercase tracking-[0.14em] text-white shadow-[0_16px_34px_rgba(11,18,32,0.22)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#1f4569]"
              : "bg-[#1f4569] text-white hover:bg-[#173855]",
            buttonClassName,
          )}
          disabled={status === "sending"}
        >
          {status === "sending" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          <span>{status === "sending" ? "Đang gửi..." : submitLabel}</span>
        </Button>
        <p
          className={cn(
            "text-sm",
            status === "error"
              ? "text-red-700"
              : status === "success"
                ? "text-emerald-700"
                : isLuxury
                  ? "text-[#3a2d24]/70"
                  : "text-slate-500",
            isLuxury && !message && "hidden sm:block",
          )}
          aria-live="polite"
        >
          {message ||
            (isLuxury
              ? "HEI sẽ phản hồi sớm."
              : "Thông tin sẽ được gửi tới đội ngũ tư vấn của HEI Design.")}
        </p>
      </div>
    </form>
  );
}
