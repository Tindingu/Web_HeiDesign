import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getAllServices } from "@/lib/services";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "Dịch Vụ Thiết Kế Nội Thất | ICEP Design",
  description:
    "Dịch vụ thiết kế nội thất chuyên nghiệp từ ICEP Design. Nhà ở, văn phòng, nhà hàng, khách sạn...",
};

export default async function ServicesPage() {
  const services = await getAllServices();

  return (
    <main className="bg-white">
      {/* Hero */}
      <div className="relative h-96 overflow-hidden bg-gray-900">
        <Image
          src="https://res.cloudinary.com/dfazfoh2l/image/upload/v1771992147/vila_tld4bi.webp"
          alt="Services"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center">
          <Container className="w-full">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-bold text-white md:text-5xl">
                Dịch Vụ Thiết Kế Nội Thất
              </h1>
              <p className="mt-4 text-xl text-gray-200">
                Chúng tôi cung cấp giải pháp thiết kế nội thất chuyên nghiệp cho
                mọi loại không gian
              </p>
            </div>
          </Container>
        </div>
      </div>

      {/* Services Grid */}
      <Container className="py-20">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900">
            Các Dịch Vụ Của Chúng Tôi
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Từ tư vấn đến thi công, chúng tôi sẽ giúp bạn biến không gian mơ ước
            thành hiện thực
          </p>
        </div>

        {services.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2">
            {services.map((service) => (
              <Link
                key={service.slug}
                href={`/dich-vu/${service.slug}`}
                className="group"
              >
                <div className="relative h-72 overflow-hidden rounded-lg bg-gray-200">
                  <Image
                    src={service.coverImage}
                    alt={service.title}
                    fill
                    className="object-cover transition duration-300 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/40" />
                  <div className="absolute inset-0 flex flex-col items-start justify-end p-6 text-white">
                    <h3 className="text-2xl font-bold">{service.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm text-gray-200">
                      {service.description}
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-sm font-semibold">
                      Xem Chi Tiết
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-lg bg-gray-50 p-12 text-center">
            <p className="text-gray-600">Chưa có dịch vụ nào được công bố</p>
          </div>
        )}
      </Container>

      {/* CTA Section */}
      <div className="bg-gray-900 py-16 text-white">
        <Container>
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold md:text-4xl">
              Hãy Liên Hệ Với Chúng Tôi Ngay
            </h2>
            <p className="mt-4 text-lg text-gray-300">
              Chúng tôi sẵn sàng tư vấn và giúp bạn thực hiện dự án của mình
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button asChild className="bg-amber-600 hover:bg-amber-700">
                <Link href="/bao-gia">Nhận Báo Giá</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-gray-900"
              >
                <a href="tel:0795743429">Gọi Tư Vấn: 0795 743 429</a>
              </Button>
            </div>
          </div>
        </Container>
      </div>
    </main>
  );
}
