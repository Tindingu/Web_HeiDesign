import { Container } from "@/components/shared/container";

const reasons = [
  {
    title: "Tối ưu chi phí",
    description:
      "Trực tiếp sản xuất, kiểm soát chất lượng theo quy trình nội bộ, giúp tối ưu ngân sách mà vẫn đảm bảo chuẩn hoàn thiện.",
  },
  {
    title: "Tiến độ nhanh",
    description:
      "Hệ thống quản trị dự án theo mốc rõ ràng, báo cáo định kỳ và đội thi công chủ động giúp công trình luôn đúng kế hoạch.",
  },
  {
    title: "Chuyên nghiệp",
    description:
      "Đội ngũ kiến trúc sư, kỹ sư và thợ tay nghề cao phối hợp chặt chẽ từ ý tưởng đến bàn giao.",
  },
  {
    title: "Tận tâm",
    description:
      "Theo sát từng chi tiết, tư vấn tận nơi và đồng hành cùng khách hàng trong suốt quá trình sử dụng.",
  },
];

export function WhyChooseHei() {
  return (
    <section className="bg-slate-50 py-24 text-slate-900">
      <Container className="space-y-16">
        {/* Main Grid */}
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Image Left */}
          <div className="overflow-hidden rounded-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://res.cloudinary.com/dfazfoh2l/image/upload/v1777104620/Rectangle-8_dptgar.jpg"
              alt="Đội ngũ HEI Design"
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>

          {/* Content Right */}
          <div className="space-y-10">
            <div className="space-y-3">
              <h2 className="text-xl font-bold uppercase leading-tight text-[#1f4569] md:text-2xl">
                TẠI SAO NÊN
                <br />
                CHỌN HEI DESIGN
              </h2>
              <p className="text-lg text-slate-600">
                Những lý do tại sao chúng tôi là lựa chọn hàng đầu cho dự án của
                bạn.
              </p>
            </div>

            <div className="space-y-6">
              {reasons.map((reason) => (
                <div
                  key={reason.title}
                  className="group space-y-2 border-l-2 border-amber-600 pl-5 transition-all duration-300 hover:border-amber-500 hover:pl-6"
                >
                  <h3 className="text-lg font-semibold leading-tight text-slate-900">
                    {reason.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-600">
                    {reason.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
