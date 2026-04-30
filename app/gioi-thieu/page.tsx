import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Compass,
  Eye,
  Flag,
  HeartHandshake,
} from "lucide-react";
import { Container } from "@/components/shared/container";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 120;

export const generateMetadata = () =>
  buildMetadata({
    title: "Giới thiệu ICEP Design",
    description:
      "ICEP Design là đơn vị thiết kế, thi công nội thất trọn gói với quy trình minh bạch, đội ngũ chuyên sâu và định hướng phát triển bền vững.",
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

export default function AboutPage() {
  return (
    <main className="bg-white text-slate-900">
      <section className="border-b border-slate-200 bg-[#f8fafc] py-12 md:py-16">
        <Container>
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-slate-500">
              Hồ sơ doanh nghiệp
            </p>
            <h1 className="max-w-4xl text-3xl font-semibold leading-tight text-[#1f4569] md:text-5xl">
              Giới thiệu về ICEP Design
            </h1>
            <p className="max-w-3xl text-base leading-8 text-slate-600">
              ICEP Design là đơn vị tư vấn thiết kế và thi công nội thất trọn
              gói, tập trung vào giải pháp phù hợp thực tế sử dụng của từng gia
              đình. Chúng tôi xây dựng trải nghiệm dịch vụ rõ ràng, từ khâu khảo
              sát, thiết kế, lựa chọn vật liệu đến giám sát thi công và hậu mãi
              sau bàn giao.
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <Link
                href="/lien-he"
                className="inline-flex items-center gap-2 rounded-full bg-[#1f4569] px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-[#16344f]"
              >
                <span>Liên hệ tư vấn</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/du-an"
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-slate-700 transition hover:border-[#1f4569] hover:text-[#1f4569]"
              >
                <span>Xem dự án tiêu biểu</span>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-14 md:py-20">
        <Container>
          <div className="grid gap-8 md:grid-cols-[1.05fr_0.95fr] md:items-start">
            <div className="space-y-5">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                Chúng tôi là ai
              </p>
              <h2 className="text-3xl font-semibold leading-tight text-[#1f4569] md:text-[2.2rem]">
                Đơn vị thiết kế thi công nội thất theo định hướng cá nhân hóa
              </h2>
              <p className="text-base leading-8 text-slate-600">
                Mỗi dự án tại ICEP Design được triển khai dựa trên 3 lớp nghiên
                cứu: nhu cầu sinh hoạt thực tế, đặc điểm không gian và khả năng
                đầu tư của gia chủ. Cách tiếp cận này giúp phương án đạt hiệu
                quả sử dụng cao thay vì chỉ tập trung vào hình ảnh.
              </p>
              <p className="text-base leading-8 text-slate-600">
                Song song đó, đội ngũ thiết kế, kỹ thuật và giám sát thi công
                làm việc trên cùng một hệ tiêu chuẩn để đảm bảo tính đồng bộ từ
                bản vẽ đến hiện trường. Khách hàng luôn được cập nhật tiến độ và
                phương án xử lý phát sinh theo quy trình rõ ràng.
              </p>
            </div>

            <div className="space-y-4">
              <article className="rounded-[22px] border border-slate-200 bg-slate-50 p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Định hướng dịch vụ
                </p>
                <h3 className="mt-2 text-xl font-semibold text-slate-900">
                  Dễ hiểu - Dễ kiểm soát - Dễ đồng hành
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Toàn bộ lộ trình dự án được chia theo giai đoạn, có checklist
                  nghiệm thu cụ thể và đầu mối phụ trách rõ ràng để khách hàng
                  luôn nắm được tình trạng thực tế công trình.
                </p>
              </article>
              <article className="rounded-[22px] border border-slate-200 bg-white p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Cam kết chất lượng
                </p>
                <h3 className="mt-2 text-xl font-semibold text-slate-900">
                  Đặt trải nghiệm sống làm trung tâm
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Chúng tôi không chỉ bàn giao một công trình đẹp mà tập trung
                  xây dựng không gian có thể vận hành bền vững, thuận tiện cho
                  sinh hoạt dài hạn của từng gia đình.
                </p>
              </article>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-y border-slate-200 bg-[#f8fafc] py-12 md:py-14">
        <Container>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {quickStats.map((item) => (
              <article
                key={item.label}
                className="rounded-[20px] border border-slate-200 bg-white px-5 py-6"
              >
                <p className="text-3xl font-bold text-[#1f4569]">
                  {item.value}
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500">
                  {item.label}
                </p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-14 md:py-20">
        <Container className="space-y-8">
          <div className="max-w-3xl space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              Tầm nhìn - Sứ mệnh - Giá trị
            </p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#1f4569] md:text-4xl">
              Triết lý vận hành của ICEP Design
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {coreBlocks.map((item) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.title}
                  className="rounded-[22px] border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-[#1f4569]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    {item.description}
                  </p>
                </article>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="pb-14 md:pb-20">
        <Container className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className="relative min-h-[420px] overflow-hidden rounded-[26px] border border-slate-200">
            <Image
              src="/upload/about/image.png"
              alt="Đội ngũ tư vấn thiết kế nội thất"
              fill
              sizes="(max-width: 1024px) 100vw, 56vw"
              className="object-cover"
            />
          </div>

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
        </Container>
      </section>

      <section className="pb-20">
        <Container>
          <div className="rounded-[28px] border border-slate-200 bg-[#1f4569] p-8 text-white md:p-12">
            <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-200">
                  Đồng hành dài hạn
                </p>
                <h2 className="text-3xl font-semibold leading-tight md:text-4xl">
                  ICEP Design sẵn sàng đồng hành trong toàn bộ vòng đời không
                  gian sống của bạn
                </h2>
                <p className="max-w-2xl text-sm leading-7 text-slate-100/90 md:text-base">
                  Từ tư vấn ý tưởng ban đầu đến bảo trì sau bàn giao, đội ngũ
                  luôn giữ vai trò đối tác đồng hành đáng tin cậy, giúp không
                  gian duy trì chất lượng sử dụng và giá trị thẩm mỹ lâu dài.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
                <Link
                  href="/lien-he"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#1f4569] transition hover:bg-slate-100"
                >
                  <HeartHandshake className="h-4 w-4" />
                  <span>Nhận tư vấn</span>
                </Link>
                <Link
                  href="/du-an"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/70 px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-white/10"
                >
                  <Building2 className="h-4 w-4" />
                  <span>Xem dự án</span>
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
