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
};

const initialState = {
  fullName: "",
  phone: "",
  need: "",
};

export function LeadCaptureForm({
  pageUrl,
  source,
  className,
  onSuccess,
  submitLabel = "Gửi ngay",
  buttonClassName,
  compact = false,
}: LeadCaptureFormProps) {
  const [formState, setFormState] = useState(initialState);
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

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
      setMessage("Đã gửi thông tin. Chúng tôi sẽ liên hệ sớm nhất.");
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

  return (
    <form className={cn("space-y-4", className)} onSubmit={handleSubmit}>
      <div className={cn(compact ? "grid gap-4 md:grid-cols-3" : "space-y-4")}>
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Họ và tên
          </label>
          <input
            value={formState.fullName}
            onChange={(event) => updateField("fullName", event.target.value)}
            required
            placeholder="Nhập họ và tên"
            className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1f4569]"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Số điện thoại
          </label>
          <input
            value={formState.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            required
            placeholder="Nhập số điện thoại"
            className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1f4569]"
          />
        </div>

        <div className={cn("space-y-2", compact ? "md:col-span-1" : "")}>
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Bạn muốn ICEP tư vấn gì?
          </label>
          <textarea
            value={formState.need}
            onChange={(event) => updateField("need", event.target.value)}
            required
            rows={compact ? 1 : 4}
            placeholder="Mô tả nhu cầu của bạn"
            className="min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1f4569]"
          />
        </div>
      </div>

      <input type="hidden" name="pageUrl" value={pageUrl} />
      <input type="hidden" name="source" value={source} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button
          type="submit"
          size="lg"
          className={cn(
            "bg-[#1f4569] text-white hover:bg-[#173855]",
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
              ? "text-red-600"
              : status === "success"
                ? "text-emerald-600"
                : "text-slate-500",
          )}
          aria-live="polite"
        >
          {message ||
            "Thông tin sẽ được gửi tới đội ngũ tư vấn của ICEP Design."}
        </p>
      </div>
    </form>
  );
}
