import { ArrowDown, PlayCircle } from "lucide-react";
import { Container } from "@/components/shared/container";
import { PdfFlipbookLoader } from "@/components/pdf-flipbook/pdf-flipbook-loader";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 86400;

const PROFILE_PDF_URL = "/upload/profile/Profile-HEI%20Design.pdf";
const INTRO_VIDEO_URL = "https://www.youtube.com/embed/A9HcovFL1uo";

export const generateMetadata = () =>
  buildMetadata({
    title: "Giới thiệu HEI Design",
    description:
      "Xem video giới thiệu và hồ sơ năng lực HEI Design dưới dạng flipbook chuyên nghiệp.",
    path: "/gioi-thieu",
    image: "/upload/about/image.png",
  });

export default function AboutPage() {
  return (
    <main className="bg-[#FBF6F2] text-slate-950">
      <section className="relative overflow-hidden bg-[#FBF6F2] text-[#1F1F1F]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(200,146,46,0.18),transparent_34%),radial-gradient(circle_at_88%_0%,rgba(216,195,165,0.34),transparent_34%)]" />
        <Container className="relative grid min-h-[92svh] gap-10 py-16 md:py-20 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
          <div className="space-y-6">
            <div className="space-y-4">
              <h1 className="max-w-xl text-4xl font-semibold leading-tight md:text-5xl">
                Giới thiệu HEI Design
              </h1>
              <p className="text-base leading-relaxed text-slate-600 md:text-lg">
                  Tại{" "}
                  <span className="font-semibold text-slate-800">
                    Hei Design
                  </span>
                  , thay vì những khuôn mẫu, chúng tôi điêu khắc giá trị vô hình
                  thành nét nội thất tinh xảo — nơi thẩm mỹ và công năng giao
                  thoa tuyệt đối. Mỗi dự án là một tuyên ngôn về sự{" "}
                  <span className="italic font-semibold text-amber-600">
                    &quot;Độc bản&quot;
                  </span>
                  , nơi bản sắc cá nhân và văn hóa doanh nghiệp được tôn vinh
                  đầy kiêu hãnh.
                </p>
            </div>
            <a
              href="#profile-flipbook"
              className="inline-flex h-12 items-center gap-3 rounded-full bg-amber-400 px-6 text-sm font-bold uppercase tracking-[0.14em] text-slate-950 transition hover:bg-amber-300"
            >
              Xem profile
              <ArrowDown className="h-4 w-4" />
            </a>
          </div>

          <div className="relative">
            <div className="relative overflow-hidden bg-white shadow-[0_24px_70px_rgba(79,54,30,0.16)]">
              <iframe
                className="aspect-video w-full"
                src={INTRO_VIDEO_URL}
                title="Video giới thiệu HEI Design"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        </Container>
      </section>

      <section id="profile-flipbook">
        <PdfFlipbookLoader
          file={PROFILE_PDF_URL}
          title="Profile HEI Design"
          downloadFileName="Profile-HEI-Design.pdf"
        />
      </section>
    </main>
  );
}
