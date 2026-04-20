"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import type { ProcessStep } from "@/lib/strapi";

export function ProcessTimeline({ steps }: { steps: ProcessStep[] }) {
  return (
    <section className="py-20">
      <Container className="space-y-10">
        <SectionHeading
          label="Quy trình"
          title="Quy trình chuyên nghiệp từ ý tưởng đến bàn giao"
          description="Các cột mốc rõ ràng, giao tiếp minh bạch và bàn giao hoàn thiện."
        />
        <div className="grid gap-6 md:grid-cols-4">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-border/60 bg-muted/40 p-5"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                0{index + 1}
              </p>
              <h3 className="mt-3 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
