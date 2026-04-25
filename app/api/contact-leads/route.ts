import { z } from "zod";
import { siteConfig } from "@/lib/constants";
import { sendContactLeadMail } from "@/lib/contact-mail";

const contactLeadSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(8).max(32),
  need: z.string().trim().min(5).max(1000),
  pageUrl: z.string().trim().max(500).optional().default(""),
  source: z.string().trim().max(120).optional().default("Homepage"),
});

function getSmtpSettings() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || "465");
  const username = process.env.SMTP_USER;
  const password = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || siteConfig.email;
  const to = process.env.CONTACT_EMAIL_TO || "23521593@gm.uit.edu.vn";

  if (!host || !Number.isFinite(port) || !from || !to) {
    return null;
  }

  return {
    host,
    port,
    secure: process.env.SMTP_SECURE
      ? process.env.SMTP_SECURE === "true"
      : port === 465,
    username,
    password,
    from,
    to,
  };
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const result = contactLeadSchema.safeParse(payload);

    if (!result.success) {
      return Response.json(
        { ok: false, error: "Dữ liệu form không hợp lệ." },
        { status: 400 },
      );
    }

    const smtpSettings = getSmtpSettings();
    if (!smtpSettings) {
      return Response.json(
        {
          ok: false,
          error:
            "Thiếu cấu hình SMTP. Vui lòng thiết lập SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM.",
        },
        { status: 500 },
      );
    }

    const { fullName, phone, need, pageUrl, source } = result.data;
    const subject = `Lead mới từ ${source}`;
    const text = [
      `Nguồn: ${source}`,
      `Họ và tên: ${fullName}`,
      `Số điện thoại: ${phone}`,
      `Nhu cầu: ${need}`,
      `Trang gửi: ${pageUrl || siteConfig.url}`,
      `Thời gian: ${new Date().toLocaleString("vi-VN")}`,
    ].join("\n");

    await sendContactLeadMail({
      ...smtpSettings,
      subject,
      text,
    });

    return Response.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Không thể gửi thông tin.";
    return Response.json({ ok: false, error: message }, { status: 500 });
  }
}
