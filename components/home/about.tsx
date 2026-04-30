import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/shared/container";

export function About() {
  const stats = [
    { label: "Dự án", value: "200+" },
    { label: "Khách hàng", value: "300+" },
    { label: "Công trình", value: "200+" },
    { label: "Hài lòng", value: "98%" },
  ];

  return (
    <section className="bg-[#f6f8fb] py-20 text-slate-900">
      <Container className="space-y-16">
        {/* Main Content */}
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          {/* Left */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-xl font-bold uppercase leading-tight text-[#1f4569] md:text-2xl">
                VỀ CHÚNG TÔI
              </h2>
              <p className="text-lg leading-relaxed text-slate-600 indent-8">
                Tại{" "}
                <span className="font-semibold text-slate-800">Hei Design</span>
                , không gian không chỉ là nơi ở mà là ngôn ngữ phản chiếu phong
                cách sống. Thay vì những khuôn mẫu, chúng tôi điêu khắc giá trị
                vô hình thành nét nội thất tinh xảo, nơi thẩm mỹ và công năng
                giao thoa tuyệt đối. Mỗi dự án là một tuyên ngôn về sự{" "}
                <span className="italic font-medium text-amber-600">
                  "Độc bản"
                </span>
                , nơi bản sắc cá nhân và văn hóa doanh nghiệp được tôn vinh đầy
                kiêu hãnh.
              </p>
            </div>
            <Link
              href="/gioi-thieu"
              className="inline-flex items-center gap-3 text-lg font-semibold text-slate-900 transition hover:text-[#1f4569]"
            >
              <span>ĐỌC THÊM</span>
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-current">
                <ArrowRight className="h-5 w-5" />
              </div>
            </Link>
          </div>

          {/* Right - Image */}
          <div className="relative h-96 overflow-hidden rounded-2xl md:h-[450px]">
            <Image
              src="/upload/about/image.png"
              alt="ICEP Team"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-6 border-t border-slate-200 px-0 pt-8 sm:gap-x-6 sm:gap-y-8 sm:pt-12 md:grid-cols-4 md:gap-8">
          {stats.map((stat, index) => (
            <div
              key={stat.value}
              className={`border-slate-200 pl-0 ${
                index >= 2 ? "border-t pt-6 sm:pt-8 md:border-t-0 md:pt-0" : ""
              } ${index % 2 === 1 ? "border-l pl-4 sm:pl-6 md:pl-8" : ""} ${
                index >= 1 ? "md:border-l md:pl-8" : ""
              }`}
            >
              <p className="text-3xl font-bold text-amber-600 sm:text-4xl">
                {stat.value}
              </p>
              <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-500 sm:text-sm sm:tracking-widest">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
