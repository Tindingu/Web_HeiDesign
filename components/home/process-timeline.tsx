"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/shared/container";
import type { ProcessStep } from "@/lib/strapi";

const BG_IMAGE =
  "https://res.cloudinary.com/dfazfoh2l/image/upload/v1777536424/3_nxuqht.png";

export function ProcessTimeline({ steps }: { steps: ProcessStep[] }) {
  return (
    <section
      className="relative py-16 md:py-20"
      style={{
        backgroundImage: `url(${BG_IMAGE})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-[#0a1628]/85" />

      <Container className="relative z-10 space-y-10">
        {/* Header */}
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-400">
            Quy trình
          </p>
          <h2 className="text-xl font-bold uppercase leading-tight text-white md:text-2xl lg:text-3xl">
            Quy trình chuyên nghiệp từ ý tưởng đến bàn giao
          </h2>
          <p className="max-w-xl text-sm leading-relaxed text-slate-300 md:text-base">
            Các cột mốc rõ ràng, giao tiếp minh bạch và bàn giao hoàn thiện.
          </p>
        </div>

        {/* Steps */}
        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-4">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="group rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur-sm transition hover:border-amber-400/50 hover:bg-white/15"
            >
              <p className="text-3xl font-bold text-amber-400 opacity-80">
                0{index + 1}
              </p>
              <h3 className="mt-3 text-base font-semibold leading-snug text-white md:text-lg">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
