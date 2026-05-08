import { Container } from "@/components/shared/container";
import type { Service } from "@/lib/strapi";
import { CheckCircle2 } from "lucide-react";

const BG_IMAGE =
  "https://res.cloudinary.com/dfazfoh2l/image/upload/v1777104620/Rectangle-8_dptgar.jpg";

export function Services({ services }: { services: Service[] }) {
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
      <div className="absolute inset-0 bg-[#0a1628]/80" />

      <Container className="relative z-10 space-y-10">
        {/* Header */}
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-400">
            Dịch vụ
          </p>
          <h2 className="text-xl font-bold uppercase leading-tight text-white md:text-2xl lg:text-3xl">
            Thiết kế và thi công trọn gói
          </h2>
          <p className="max-w-xl text-sm leading-relaxed text-slate-300 md:text-base">
            Quy trình minh bạch với giám sát chuyên nghiệp, vật liệu cao cấp và
            chất lượng hoàn hảo.
          </p>
        </div>

        {/* Service cards */}
        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.title}
              className="group rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur-sm transition hover:border-amber-400/50 hover:bg-white/15"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full border-2 border-amber-400 text-amber-400 transition group-hover:bg-amber-400 group-hover:text-white">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-white">
                {service.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
