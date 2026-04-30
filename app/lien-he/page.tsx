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
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/constants";

export const revalidate = 120;

export const generateMetadata = () =>
  buildMetadata({
    title: "Liên hệ ICEP Design",
    description:
      "Liên hệ ICEP Design để được tư vấn thiết kế thi công nội thất, nhận báo giá và lịch khảo sát nhanh chóng.",
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
    title: "Khu vực hoạt động",
    value: siteConfig.address,
    href: "https://maps.google.com",
    note: "Khảo sát tận nơi tại TP.HCM và khu vực lân cận",
  },
];

const officeHours = [
  "Thứ 2 - Thứ 6: 08:00 - 18:30",
  "Thứ 7: 08:30 - 17:30",
  "Chủ nhật: Nhận lịch hẹn trước",
];

export default function ContactPage() {
  return (
    <main className="bg-white text-slate-900">
      <section className="border-b border-slate-200 bg-[#f8fafc] py-12 md:py-16">
        <Container className="space-y-5">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            Liên hệ
          </p>
          <h1 className="max-w-4xl text-3xl font-semibold leading-tight text-[#1f4569] md:text-5xl">
            Kết nối với đội ngũ ICEP Design
          </h1>
          <p className="max-w-3xl text-base leading-8 text-slate-600">
            Chia sẻ nhu cầu thiết kế hoặc thi công nội thất của bạn. Đội ngũ
            chuyên môn sẽ tư vấn định hướng phù hợp, phạm vi triển khai và ngân
            sách dự kiến theo từng giai đoạn thực hiện.
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <Link
              href={`tel:${siteConfig.phone}`}
              className="inline-flex items-center gap-2 rounded-full bg-[#1f4569] px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-[#16344f]"
            >
              <Phone className="h-4 w-4" />
              <span>Gọi ngay</span>
            </Link>
            <Link
              href="/bao-gia"
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-slate-700 transition hover:border-[#1f4569] hover:text-[#1f4569]"
            >
              <span>Nhận báo giá</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Container>
      </section>

      <section className="py-12 md:py-16">
        <Container className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6 rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                Gửi yêu cầu tư vấn
              </p>
              <h2 className="text-2xl font-semibold leading-tight text-[#1f4569] md:text-3xl">
                Để lại thông tin, ICEP Design sẽ liên hệ sớm nhất
              </h2>
              <p className="text-sm leading-7 text-slate-600">
                Vui lòng điền đầy đủ thông tin để đội ngũ tư vấn có thể phản hồi
                chính xác theo nhu cầu của bạn.
              </p>
            </div>

            <LeadCaptureForm
              pageUrl="/lien-he"
              source="Contact Page"
              submitLabel="Gửi yêu cầu"
              className="pt-1"
            />
          </div>

          <aside className="space-y-5 rounded-[26px] border border-slate-200 bg-[#f8fafc] p-6 md:p-8">
            <h3 className="text-xl font-semibold text-[#1f4569] md:text-2xl">
              Thông tin liên hệ
            </h3>

            <div className="space-y-4">
              {contactCards.map((item) => {
                const Icon = item.icon;

                return (
                  <article
                    key={item.title}
                    className="rounded-2xl border border-slate-200 bg-white p-4"
                  >
                    <div className="flex items-start gap-3">
                      <span className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-[#1f4569]">
                        <Icon className="h-4 w-4" />
                      </span>
                      <div className="space-y-1">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                          {item.title}
                        </p>
                        <a
                          href={item.href}
                          target={
                            item.title === "Khu vực hoạt động"
                              ? "_blank"
                              : undefined
                          }
                          rel={
                            item.title === "Khu vực hoạt động"
                              ? "noreferrer"
                              : undefined
                          }
                          className="text-sm font-semibold text-slate-900 hover:text-[#1f4569]"
                        >
                          {item.value}
                        </a>
                        <p className="text-xs leading-6 text-slate-500">
                          {item.note}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

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

            <article className="rounded-2xl border border-slate-200 bg-[#1f4569] p-4 text-white">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-100">
                  Hỗ trợ dự án
                </p>
              </div>
              <p className="mt-2 text-sm leading-7 text-slate-100">
                Đối với công trình cần khảo sát trực tiếp, đội ngũ sẽ chủ động
                sắp xếp lịch hẹn phù hợp và gửi đề xuất sơ bộ sau buổi làm việc.
              </p>
            </article>
          </aside>
        </Container>
      </section>

      <section className="pb-20">
        <Container>
          <div className="overflow-hidden rounded-[26px] border border-slate-200">
            <div className="border-b border-slate-200 bg-[#f8fafc] px-6 py-4">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#1f4569]">
                Bản đồ khu vực hoạt động
              </p>
            </div>
            <iframe
              title="Bản đồ liên hệ ICEP Design"
              src="https://maps.google.com/maps?q=Ho%20Chi%20Minh%20City&t=&z=12&ie=UTF8&iwloc=&output=embed"
              className="h-[420px] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </Container>
      </section>
    </main>
  );
}
