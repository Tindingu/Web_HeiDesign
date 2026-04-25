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
                VỀ CHÚNG
                <br />
                TÔI
              </h2>
              <p className="text-lg leading-relaxed text-slate-600">
                Chúng tôi tin rằng, mỗi một ngôi nhà đều sở hữu một câu chuyện
                và về đẹp trong vẻn của riêng nó. Thế nên, với thông điệp{" "}
                <span className="italic text-amber-600">
                  "Every Home Can Talk"
                </span>
                , chúng tôi hi vọng có thể trở thành một người bạn thân thiết
                độc hành cùng khách hàng trong hành trình tìm ra tiếng nói cá
                nhân của từng ngôi nhà, giúp khách hàng có thể lắng nghe được
                thành âm mà ngôi nhà trong mơ của họ đang vang vong
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
              src="/upload/about/team-photo.png"
              alt="ICEP Team"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-8 border-t border-slate-200 px-0 pt-12 md:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.value}
              className="border-l border-slate-200 pl-6 first:border-l-0 first:pl-0"
            >
              <p className="text-4xl font-bold text-amber-600">{stat.value}</p>
              <p className="mt-2 text-sm uppercase tracking-widest text-slate-500">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
