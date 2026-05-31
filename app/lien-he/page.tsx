import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Clock3,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { Container } from "@/components/shared/container";
import { LeadCaptureForm } from "@/components/contact/lead-capture-form";
import { ScrollReveal } from "@/components/home/scroll-reveal";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/constants";

export const revalidate = 86400;

export const generateMetadata = () =>
  buildMetadata({
    title: "Liên hệ HEI Design",
    description:
      "Liên hệ HEI Design để được tư vấn thiết kế thi công nội thất, nhận báo giá và lịch khảo sát nhanh chóng.",
    path: "/lien-he",
  });

const contactCards = [
  {
    icon: Phone,
    title: "Hotline tư vấn",
    value: siteConfig.phone,
    href: `tel:${siteConfig.phone}`,
    note: "Hỗ trợ nhanh từ 8:00 - 20:00 mỗi ngày",
  },
  {
    icon: Mail,
    title: "Email tiếp nhận",
    value: siteConfig.email,
    href: `mailto:${siteConfig.email}`,
    note: "Phản hồi trong vòng 24 giờ làm việc",
  },
  {
    icon: MapPin,
    title: "Địa chỉ văn phòng",
    value: siteConfig.address,
    href: `https://maps.google.com/?q=${encodeURIComponent(siteConfig.address)}`,
    note: "Làm việc trực tiếp tại văn phòng theo lịch hẹn",
  },
];

const officeHours = [
  "Thứ 2 - Thứ 6: 08:00 - 18:30",
  "Thứ 7: 08:30 - 17:30",
  "Chủ nhật: Nhận lịch hẹn trước",
];

const CONTACT_BG_IMAGE =
  "https://res.cloudinary.com/dfazfoh2l/image/upload/v1778941313/a_vuflqe.webp";

export default function ContactPage() {
  return (
    <main className="bg-[#f4f6fb] text-slate-900">
      <section
        className="relative flex min-h-[100svh] items-center overflow-hidden md:min-h-screen"
        style={{
          backgroundImage: `url(${CONTACT_BG_IMAGE})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628]/90 via-[#0a1628]/78 to-[#0a1628]/62" />
        <Container className="relative z-10 py-24 md:py-32">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <ScrollReveal distance={20} delay={0.02}>
              <div className="space-y-6">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-300">
                  Liên hệ
                </p>
                <h1 className="max-w-4xl text-3xl font-semibold leading-tight text-white md:text-5xl">
                  Kết nối với đội ngũ HEI Design
                </h1>
                <p className="max-w-2xl text-base leading-8 text-slate-200">
                  Chia sẻ nhu cầu thiết kế hoặc thi công nội thất của bạn. Đội
                  ngũ chuyên môn sẽ tư vấn định hướng phù hợp, phạm vi triển
                  khai và ngân sách dự kiến theo từng giai đoạn thực hiện.
                </p>
                <div className="flex flex-wrap gap-3 pt-1">
                  <Link
                    href={`tel:${siteConfig.phone}`}
                    className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-slate-900 transition hover:bg-amber-400"
                  >
                    <Phone className="h-4 w-4" />
                    <span>Gọi ngay</span>
                  </Link>
                  <Link
                    href="/bao-gia"
                    className="inline-flex items-center gap-2 rounded-full border border-white/60 px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white transition hover:border-amber-300 hover:text-amber-200"
                  >
                    <span>Nhận báo giá</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal distance={18} delay={0.08}>
              <aside className="rounded-[24px] border border-white/20 bg-white/10 p-6 text-white backdrop-blur-sm md:p-7">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-300">
                  Thông tin nhanh
                </p>
                <div className="mt-4 space-y-3">
                  <a
                    href={`tel:${siteConfig.phone}`}
                    className="block rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm hover:border-amber-300/60"
                  >
                    Hotline: {siteConfig.phone}
                  </a>
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="block rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm hover:border-amber-300/60"
                  >
                    Email: {siteConfig.email}
                  </a>
                  <p className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-slate-200">
                    Địa chỉ: {siteConfig.address}
                  </p>
                </div>
              </aside>
            </ScrollReveal>
          </div>
        </Container>
      </section>

      <section className="py-12 md:py-16">
        <Container className="grid items-start gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <ScrollReveal distance={18} delay={0.03}>
            <aside className="space-y-5 rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Thông tin liên hệ
                </p>
                <h3 className="text-2xl font-semibold text-[#1f4569]">
                  Sẵn sàng hỗ trợ dự án của bạn
                </h3>
              </div>

              <div className="space-y-4">
                {contactCards.map((item) => {
                  const Icon = item.icon;

                  return (
                    <article
                      key={item.title}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <div className="flex items-start gap-3">
                        <span className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#1f4569]/10 text-[#1f4569]">
                          <Icon className="h-4 w-4" />
                        </span>
                        <div className="space-y-1">
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                            {item.title}
                          </p>
                          <a
                            href={item.href}
                            target={
                              item.title === "Địa chỉ văn phòng"
                                ? "_blank"
                                : undefined
                            }
                            rel={
                              item.title === "Địa chỉ văn phòng"
                                ? "noreferrer"
                                : undefined
                            }
                            className="text-sm font-semibold text-slate-900 hover:text-[#1f4569]"
                          >
                            {item.value}
                          </a>
                          <p className="text-xs leading-6 text-slate-600">
                            {item.note}
                          </p>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
                <article className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex items-center gap-2">
                    <Clock3 className="h-4 w-4 text-[#1f4569]" />
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Giờ làm việc
                    </p>
                  </div>
                  <ul className="mt-2 space-y-1 text-sm text-slate-700">
                    {officeHours.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>

                <article className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-[#1f4569]" />
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Hỗ trợ dự án
                    </p>
                  </div>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    Đội ngũ sẽ sắp xếp lịch khảo sát phù hợp và gửi đề xuất sơ
                    bộ sau buổi làm việc trực tiếp.
                  </p>
                </article>
              </div>
            </aside>
          </ScrollReveal>

          <ScrollReveal distance={18} delay={0.08}>
            <div className="space-y-6 rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Gửi yêu cầu tư vấn
                </p>
                <h2 className="text-2xl font-semibold leading-tight text-[#1f4569] md:text-3xl">
                  Để lại thông tin, HEI Design sẽ liên hệ sớm nhất
                </h2>
                <p className="text-sm leading-7 text-slate-600">
                  Vui lòng điền đầy đủ thông tin để đội ngũ tư vấn có thể phản
                  hồi chính xác theo nhu cầu của bạn.
                </p>
              </div>

              <LeadCaptureForm
                pageUrl="/lien-he"
                source="Contact Page"
                submitLabel="Gửi yêu cầu"
                className="pt-1"
              />
            </div>
          </ScrollReveal>
        </Container>
      </section>

      <section className="pb-20">
        <Container>
          <ScrollReveal distance={18} delay={0.08}>
            <div className="overflow-hidden rounded-[26px] border border-slate-200">
              <div className="border-b border-slate-200 bg-[#f8fafc] px-6 py-4">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#1f4569]">
                  Bản đồ khu vực hoạt động
                </p>
              </div>
              <iframe
                title="Bản đồ liên hệ HEI Design"
                src="https://maps.google.com/maps?q=Ho%20Chi%20Minh%20City&t=&z=12&ie=UTF8&iwloc=&output=embed"
                className="h-[420px] w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </ScrollReveal>
        </Container>
      </section>
    </main>
  );
}
