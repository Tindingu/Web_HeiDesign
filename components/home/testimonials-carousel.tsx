"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import type { Testimonial } from "@/lib/strapi";

export function TestimonialsCarousel({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (testimonials.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  return (
    <section className="border-y border-border/60 bg-background py-20">
      <Container className="space-y-10">
        <SectionHeading
          label="Đánh giá"
          title="Khách hàng tin tưởng"
          description="Chủ nhà riêng và các doanh nghiệp khách sạn lựa chọn ICEP vì sự đảm bảo chất lượng."
        />
        <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-muted/40">
          <div
            className="flex transition-transform duration-500"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {testimonials.map((testimonial) => (
              <div key={testimonial.name} className="min-w-full p-8">
                <p className="text-lg text-foreground">“{testimonial.quote}”</p>
                <p className="mt-4 text-sm text-muted-foreground">
                  {testimonial.name}
                </p>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {testimonial.role}
                </p>
              </div>
            ))}
          </div>
          <div className="absolute bottom-4 right-4 flex gap-2">
            {testimonials.map((_, idx) => (
              <button
                key={`dot-${idx}`}
                className={`h-2 w-2 rounded-full ${index === idx ? "bg-primary" : "bg-muted"}`}
                onClick={() => setIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
