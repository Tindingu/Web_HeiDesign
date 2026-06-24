"use client";

import Image from "next/image";
import { useState } from "react";
import { Loader2, Send } from "lucide-react";

const initialForm = {
  fullName: "",
  phone: "",
  need: "",
};

const inputClass =
  "h-[3.35rem] rounded-xl border border-white/55 bg-white/72 px-4 text-sm text-[#17120e] shadow-sm outline-none transition duration-300 placeholder:text-[#75685f]/65 focus:border-[#1f4569]/55 focus:bg-white/95 focus:ring-4 focus:ring-white/35";

export function CtaStrip() {
  const [formState, setFormState] = useState(initialForm);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  const updateField = (field: keyof typeof initialForm, value: string) => {
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formState,
          pageUrl: "/",
          source: "Homepage luxury contact",
        }),
      });

      const payload = (await response.json()) as {
        ok?: boolean;
        error?: string;
      };

      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || "Không thể gửi thông tin.");
      }

      setStatus("success");
      setMessage("Đã gửi. HEI sẽ liên hệ sớm.");
      setFormState(initialForm);
      window.setTimeout(() => setStatus("idle"), 4000);
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error ? error.message : "Không thể gửi thông tin.",
      );
    }
  };

  return (
    <section
      id="nhan-bao-gia"
      className="relative scroll-mt-28 overflow-hidden bg-[linear-gradient(135deg,#f5f2ee_0%,#d2bca7_50%,#c3aa91_100%)] py-10 sm:scroll-mt-36 sm:py-14 lg:py-[4.5rem]"
    >
      <div className="pointer-events-none absolute -left-28 top-10 h-80 w-80 rounded-full bg-white/40 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-8rem] right-[-6rem] h-[28rem] w-[28rem] rounded-full bg-[#5d412f]/25 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_68%_24%,rgba(255,255,255,0.42),transparent_30%),radial-gradient(circle_at_14%_84%,rgba(36,52,72,0.16),transparent_34%)]" />

      <div className="relative mx-auto grid max-w-7xl gap-7 px-4 sm:px-6 md:grid-cols-[0.88fr_1.12fr] md:items-center lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <div className="group relative hidden min-h-[420px] overflow-visible transition duration-500 hover:-translate-y-1 md:block lg:min-h-[540px]">
          <Image
            src="/upload/formlienhenhanh/girlpoint.png"
            alt="Tư vấn nội thất HEI Design"
            fill
            className="object-contain object-bottom transition duration-700 group-hover:scale-[1.02]"
            sizes="(max-width: 1024px) 100vw, 48vw"
            priority={false}
          />
        </div>

        <div className="rounded-[1.6rem] border border-white/45 bg-white/30 p-5 shadow-[0_28px_80px_rgba(63,46,34,0.18)] backdrop-blur-xl transition duration-500 hover:-translate-y-1 sm:p-7 lg:p-9">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#6f5948]">
            Liên hệ nhanh
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#111827] sm:text-4xl">
            Nhận Miễn Phí Thiết Kế
          </h2>

          <p className="mt-3 text-sm leading-6 text-[#3a2d24]/75">
            Để lại thông tin, HEI sẽ tư vấn phương án phù hợp.
          </p>

          <form className="mt-7 space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                value={formState.fullName}
                onChange={(event) =>
                  updateField("fullName", event.target.value)
                }
                required
                placeholder="Tên của bạn"
                className={inputClass}
              />

              <input
                value={formState.phone}
                onChange={(event) => updateField("phone", event.target.value)}
                required
                placeholder="Số điện thoại"
                className={inputClass}
              />
            </div>

            <textarea
              value={formState.need}
              onChange={(event) => updateField("need", event.target.value)}
              required
              rows={4}
              placeholder="Thông tin công trình cần tư vấn"
              className="min-h-32 w-full rounded-xl border border-white/55 bg-white/72 px-4 py-4 text-sm text-[#17120e] shadow-sm outline-none transition duration-300 placeholder:text-[#75685f]/65 focus:border-[#1f4569]/55 focus:bg-white/95 focus:ring-4 focus:ring-white/35"
            />

            <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center">
              <button
                type="submit"
                disabled={status === "sending"}
                className="inline-flex h-[3.35rem] items-center justify-center gap-2 rounded-xl bg-[#0b1220] px-7 text-sm font-semibold uppercase tracking-[0.14em] text-white shadow-[0_18px_38px_rgba(11,18,32,0.24)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#1f4569] hover:shadow-[0_22px_48px_rgba(31,69,105,0.26)] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {status === "sending" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                Nhận tư vấn ngay
              </button>

              {message && (
                <p
                  className={`text-sm ${
                    status === "error" ? "text-red-800" : "text-[#3a2d24]/75"
                  }`}
                  aria-live="polite"
                >
                  {message}
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
