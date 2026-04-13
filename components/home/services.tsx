import { SectionHeading } from "@/components/shared/section-heading";
import { Container } from "@/components/shared/container";
import type { Service } from "@/lib/strapi";
import { Armchair, Hammer, Sparkles } from "lucide-react";

const iconMap = {
  Armchair,
  Hammer,
  Sparkles,
};

export function Services({ services }: { services: Service[] }) {
  return (
    <section className="border-y border-border/60 bg-muted/30 py-20">
      <Container className="space-y-10">
        <SectionHeading
          label="Dịch vụ"
          title="Thiết kế và thi công trọn gói"
          description="Quy trình minh bạch với giám sát chuyên nghiệp, vật liệu cao cấp và chất lượng hoàn hảo."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {services.map((service) => {
            const Icon =
              iconMap[service.icon as keyof typeof iconMap] ?? Sparkles;
            return (
              <div
                key={service.title}
                className="rounded-2xl border border-border/60 bg-background p-6 shadow-soft"
              >
                <Icon className="h-6 w-6 text-primary" />
                <h3 className="mt-4 text-xl font-semibold">{service.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
