import { Container } from "@/components/shared/container";
import { LeadCaptureForm } from "@/components/contact/lead-capture-form";

export function CtaStrip() {
  return (
    <section className="py-16">
      <Container>
        <div className="grid gap-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm lg:grid-cols-[0.95fr_1.05fr] lg:p-10">
          <div className="space-y-5">
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                Sẵn sàng bắt đầu
              </p>
              <h2 className="text-xl font-bold uppercase leading-tight text-[#1f4569] md:text-2xl">
                Nhận báo giá chi tiết trong vài phút.
              </h2>
              <p className="max-w-xl text-sm leading-7 text-slate-600">
                Để lại thông tin liên hệ và nhu cầu của bạn, đội ngũ ICEP Design
                sẽ phản hồi sớm nhất.
              </p>
            </div>

            <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 px-4 py-3">
                Tư vấn thiết kế và thi công trọn gói
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-3">
                Phản hồi nhanh, thông tin rõ ràng
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 md:p-6">
            <LeadCaptureForm
              pageUrl="/"
              source="Homepage CTA"
              submitLabel="Gửi thông tin"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
