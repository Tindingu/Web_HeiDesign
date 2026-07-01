import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Compass,
  Eye,
  Flag,
  HeartHandshake,
  PlayCircle,
} from "lucide-react";
import { Container } from "@/components/shared/container";
import { ScrollReveal } from "@/components/home/scroll-reveal";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 86400;

export const generateMetadata = () =>
  buildMetadata({
    title: "Giới thiệu HEI Design",
    description:
      "HEI Design là đơn vị thiết kế, thi công nội thất trọn gói với quy trình minh bạch, đội ngũ chuyên sâu và định hướng phát triển bền vững.",
    path: "/gioi-thieu",
    image: "/upload/about/image.png",
  });

const quickStats = [
  { value: "2014", label: "Năm hình thành" },
  { value: "500+", label: "Dự án đã triển khai" },
  { value: "120+", label: "Nhân sự & đối tác" },
  { value: "98%", label: "Mức độ hài lòng" },
];

const coreBlocks = [
  {
    icon: Eye,
    title: "Tầm nhìn",
    description:
      "Trở thành thương hiệu thiết kế và thi công nội thất đáng tin cậy tại Việt Nam với hệ tiêu chuẩn dịch vụ minh bạch, chuyên sâu và bền vững.",
  },
  {
    icon: Compass,
    title: "Sứ mệnh",
    description:
      "Biến nhu cầu sống của từng gia đình thành không gian có bản sắc riêng, tối ưu công năng, ngân sách và giá trị sử dụng lâu dài.",
  },
  {
    icon: Flag,
    title: "Giá trị cốt lõi",
    description:
      "Tận tâm trong tư vấn, chuẩn xác trong thiết kế, kỷ luật trong thi công và trách nhiệm trong bảo hành hậu mãi.",
  },
];

const timeline = [
  {
    year: "2014",
    title: "Khởi đầu hành trình",
    description:
      "Xây dựng đội ngũ thiết kế cốt lõi, tập trung các dự án nhà ở và căn hộ tại TP.HCM.",
  },
  {
    year: "2018",
    title: "Mở rộng năng lực thi công",
    description:
      "Hoàn thiện quy trình thiết kế - sản xuất - thi công khép kín, kiểm soát chất lượng theo từng mốc.",
  },
  {
    year: "2021",
    title: "Chuẩn hóa dịch vụ",
    description:
      "Số hóa quy trình chăm sóc khách hàng, báo cáo tiến độ và theo dõi chi phí minh bạch theo tuần.",
  },
  {
    year: "2026",
    title: "Phát triển bền vững",
    description:
      "Đẩy mạnh giải pháp vật liệu an toàn, tối ưu vận hành và nâng cao trải nghiệm sống cho gia chủ.",
  },
];

const ABOUT_BG_IMAGE =
  "https://res.cloudinary.com/dfazfoh2l/image/upload/v1782636466/b33f9db56bfcdc3142a358fa58122b76_bzaw78.webp";

export default function AboutPage() {
  return (
    <main className="bg-white text-slate-900">
      <section
        className="relative flex min-h-[100svh] items-center overflow-hidden md:min-h-screen"
        style={{
          backgroundImage: `url(${ABOUT_BG_IMAGE})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628]/92 via-[#0a1628]/78 to-[#0a1628]/62" />
        <Container className="relative z-10 py-24 md:py-32">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <ScrollReveal distance={22} delay={0.02}>
              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-amber-300">
                  Hồ sơ doanh nghiệp
                </p>
                <h1 className="max-w-4xl text-3xl font-semibold leading-tight text-white md:text-5xl">
                  Giới thiệu về HEI Design
                </h1>
                <p className="max-w-3xl text-base leading-8 text-slate-200">
                  HEI Design là đơn vị tư vấn thiết kế và thi công nội thất trọn
                  gói, tập trung vào giải pháp phù hợp thực tế sử dụng của từng
                  gia đình. Chúng tôi xây dựng trải nghiệm dịch vụ rõ ràng, từ
                  khảo sát đến bàn giao và hậu mãi.
                </p>
                <div className="flex flex-wrap gap-3 pt-1">
                  <Link
                    href="/lien-he"
                    className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-slate-900 transition hover:bg-amber-400"
                  >
                    <span>Liên hệ tư vấn</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="#video-gioi-thieu"
                    className="inline-flex items-center gap-2 rounded-full border border-white/60 px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white transition hover:border-amber-300 hover:text-amber-200"
                  >
                    <PlayCircle className="h-4 w-4" />
                    <span>Xem video giới thiệu</span>
                  </Link>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal distance={18} delay={0.08}>
              <aside className="rounded-[24px] border border-white/20 bg-white/10 p-6 text-white backdrop-blur-sm md:p-7">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-300">
                  Dấu mốc nổi bật
                </p>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {quickStats.map((item) => (
                    <article
                      key={item.label}
                      className="rounded-xl border border-white/15 bg-white/5 px-4 py-3"
                    >
                      <p className="text-2xl font-bold text-amber-300">
                        {item.value}
                      </p>
                      <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-slate-300">
                        {item.label}
                      </p>
                    </article>
                  ))}
                </div>
              </aside>
            </ScrollReveal>
          </div>
        </Container>
      </section>

      <section id="video-gioi-thieu" className="bg-[#FBF6F2] py-14 md:py-20">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
            <ScrollReveal distance={18} delay={0.03}>
              <div className="space-y-5">
                {/* <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-600">
                  Video giới thiệu
                </p> */}
                <h2 className="max-w-xl text-3xl font-semibold leading-tight text-[#1f4569] md:text-4xl">
                  Câu chuyện HEI Design qua từng không gian sống
                </h2>
                <p className="max-w-xl text-base leading-8 text-slate-600">
                  Khám phá cách HEI Design đồng hành cùng khách hàng từ ý tưởng,
                  bản vẽ, lựa chọn vật liệu đến thi công hoàn thiện. Mỗi công
                  trình là một bản sắc riêng, được cân bằng giữa thẩm mỹ, công
                  năng và trải nghiệm sống lâu dài.
                </p>
                <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                  {[
                    "Thiết kế cá nhân hóa",
                    "Thi công trọn gói",
                    "Đồng hành sau bàn giao",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-amber-200/70 bg-white/70 px-4 py-3 text-sm font-semibold text-[#1f4569] shadow-sm"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal distance={18} delay={0.08}>
              <div className="relative">
                <div className="absolute -bottom-4 -right-4 h-full w-full rounded-[28px] border border-amber-300/70" />
                <div className="relative overflow-hidden rounded-[28px] bg-[#0a1628] shadow-2xl shadow-slate-900/15">
                  <iframe
                    className="aspect-video w-full"
                    src="https://www.youtube.com/embed/A9HcovFL1uo"
                    title="Video giới thiệu HEI Design"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              </div>
            </ScrollReveal>
          </div>
        </Container>
      </section>

      <section className="py-12 md:py-16">
        <Container className="space-y-6 md:space-y-8">
          <ScrollReveal distance={18} delay={0.03}>
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                Chúng tôi là ai
              </p>
              <h2 className="max-w-3xl text-3xl font-semibold leading-tight text-[#1f4569] md:text-[2.1rem]">
                Đơn vị thiết kế thi công nội thất theo định hướng cá nhân hóa
              </h2>
              <p className="max-w-3xl text-base leading-8 text-slate-600">
                Mỗi dự án tại HEI Design được triển khai dựa trên 3 lớp nghiên
                cứu: nhu cầu sinh hoạt thực tế, đặc điểm không gian và khả năng
                đầu tư của gia chủ.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid gap-8 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:p-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <ScrollReveal distance={16} delay={0.04}>
              <div className="relative min-h-[340px] overflow-hidden rounded-[22px] border border-slate-200">
                <Image
                  src="/upload/about/image.png"
                  alt="Đội ngũ tư vấn thiết kế nội thất"
                  fill
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover"
                />
              </div>
            </ScrollReveal>

            <div className="grid gap-6 md:grid-cols-2">
              <ScrollReveal distance={14} delay={0.06}>
                <article className="rounded-[22px] border border-slate-200 bg-slate-50 p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Định hướng dịch vụ
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-slate-900">
                    Dễ hiểu - Dễ kiểm soát - Dễ đồng hành
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    Lộ trình dự án theo từng giai đoạn, có checklist nghiệm thu
                    và đầu mối phụ trách rõ ràng.
                  </p>
                </article>
              </ScrollReveal>

              <ScrollReveal distance={14} delay={0.1}>
                <article className="rounded-[22px] border border-slate-200 bg-white p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Cam kết chất lượng
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-slate-900">
                    Đặt trải nghiệm sống làm trung tâm
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    Đồng bộ từ thiết kế đến hiện trường, ưu tiên khả năng vận
                    hành bền vững cho sinh hoạt dài hạn.
                  </p>
                </article>
              </ScrollReveal>
            </div>
          </div>
        </Container>
      </section>

      <section className="pt-8 pb-14 md:pt-10 md:pb-20">
        <Container className="space-y-8">
          <ScrollReveal distance={18} delay={0.03}>
            <div className="max-w-3xl space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                Tầm nhìn - Sứ mệnh - Giá trị
              </p>
              <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#1f4569] md:text-4xl">
                Triết lý vận hành của HEI Design
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid gap-5 md:grid-cols-3">
            {coreBlocks.map((item, index) => {
              const Icon = item.icon;

              return (
                <ScrollReveal
                  key={item.title}
                  distance={14}
                  delay={0.05 + index * 0.04}
                >
                  <article className="group rounded-[22px] border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-6 shadow-sm transition hover:-translate-y-1 hover:border-amber-200 hover:shadow-lg">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-[#1f4569] transition group-hover:bg-amber-100 group-hover:text-amber-700">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="mt-4 text-lg font-semibold text-slate-900">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-slate-600">
                      {item.description}
                    </p>
                  </article>
                </ScrollReveal>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="pb-14 md:pb-20">
        <Container className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <ScrollReveal distance={18} delay={0.04}>
            <div className="relative min-h-[420px] overflow-hidden rounded-[26px] border border-slate-200">
              <Image
                src="/upload/about/image.png"
                alt="Đội ngũ tư vấn thiết kế nội thất"
                fill
                sizes="(max-width: 1024px) 100vw, 56vw"
                className="object-cover"
              />
            </div>
          </ScrollReveal>

          <ScrollReveal distance={18} delay={0.08}>
            <aside className="space-y-5 rounded-[26px] border border-slate-200 bg-white p-6 md:p-8">
              <h3 className="text-2xl font-semibold leading-tight text-[#1f4569] md:text-3xl">
                Hành trình phát triển
              </h3>
              <div className="space-y-4">
                {timeline.map((item) => (
                  <article
                    key={item.year}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      {item.year}
                    </p>
                    <h4 className="mt-1 text-base font-semibold text-slate-900">
                      {item.title}
                    </h4>
                    <p className="mt-1 text-sm leading-7 text-slate-600">
                      {item.description}
                    </p>
                  </article>
                ))}
              </div>
            </aside>
          </ScrollReveal>
        </Container>
      </section>

      <section
        className="relative border-t border-slate-200 py-14 md:py-20"
        style={{
          backgroundImage: `url(${ABOUT_BG_IMAGE})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-[#0a1628]/82" />
        <Container>
          <ScrollReveal distance={18} delay={0.05}>
            <div className="relative z-10 rounded-[28px] border border-white/20 bg-white/10 p-8 text-white backdrop-blur-sm md:p-12">
              <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-300">
                    Đồng hành dài hạn
                  </p>
                  <h2 className="text-3xl font-semibold leading-tight md:text-4xl">
                    HEI Design sẵn sàng đồng hành trong toàn bộ vòng đời không
                    gian sống của bạn
                  </h2>
                  <p className="max-w-2xl text-sm leading-7 text-slate-100 md:text-base">
                    Từ tư vấn ý tưởng ban đầu đến bảo trì sau bàn giao, đội ngũ
                    luôn giữ vai trò đối tác đồng hành đáng tin cậy, giúp không
                    gian duy trì chất lượng sử dụng và giá trị thẩm mỹ lâu dài.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
                  <Link
                    href="/lien-he"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-500 px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-slate-900 transition hover:bg-amber-400"
                  >
                    <HeartHandshake className="h-4 w-4" />
                    <span>Nhận tư vấn</span>
                  </Link>
                  <Link
                    href="/du-an"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-white/70 px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white transition hover:border-amber-300 hover:text-amber-200"
                  >
                    <Building2 className="h-4 w-4" />
                    <span>Xem dự án</span>
                  </Link>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </Container>
      </section>
    </main>
  );
}
