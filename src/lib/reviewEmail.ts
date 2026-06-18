import { CLINIC_NAME } from "@/lib/constants";

interface ReviewEmailData {
  name: string;
  location?: string;
  problem?: string;
  rating: number;
  text: string;
  clinicEmail: string;
}

const stars = (n: number) => "⭐".repeat(n);

export async function sendEmail(data: ReviewEmailData): Promise<void> {
  const subject = `New Patient Review — ${stars(data.rating)} from ${data.name}`;
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #dcfce7;">
      <div style="background:linear-gradient(135deg,#166534,#16a34a);padding:20px 24px;">
        <h2 style="color:#fff;margin:0;font-size:18px;">🌿 New Patient Review</h2>
        <p style="color:#bbf7d0;margin:4px 0 0;font-size:13px;">${CLINIC_NAME}</p>
      </div>
      <div style="padding:24px;">
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="color:#6b7280;font-size:13px;padding:5px 0;width:120px;">Patient</td><td style="color:#111;font-weight:600;">${data.name}</td></tr>
          ${data.location ? `<tr><td style="color:#6b7280;font-size:13px;padding:5px 0;">Location</td><td style="color:#374151;">${data.location}</td></tr>` : ""}
          ${data.problem ? `<tr><td style="color:#6b7280;font-size:13px;padding:5px 0;">Condition</td><td style="color:#374151;">${data.problem}</td></tr>` : ""}
          <tr><td style="color:#6b7280;font-size:13px;padding:5px 0;">Rating</td><td style="color:#374151;">${stars(data.rating)} (${data.rating}/5)</td></tr>
        </table>
        <div style="background:#f0faf4;border-radius:10px;padding:14px 16px;margin-top:16px;border-left:4px solid #16a34a;">
          <p style="color:#166534;font-style:italic;margin:0;font-size:14px;line-height:1.6;">"${data.text}"</p>
        </div>
      </div>
      <div style="background:#f9fafb;padding:12px 24px;border-top:1px solid #e5e7eb;text-align:center;">
        <p style="color:#9ca3af;font-size:12px;margin:0;">This review was submitted via the clinic website.</p>
      </div>
    </div>
  `;

  // Use nodemailer (SMTP) or Resend
  const hasSmtp = !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

  if (hasSmtp) {
    const nodemailer = await import("nodemailer");
    const transporter = nodemailer.default.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: false,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      tls: { rejectUnauthorized: false },
    });
    await transporter.sendMail({
      from: `"${CLINIC_NAME}" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: data.clinicEmail,
      subject,
      html,
    });
  } else if (process.env.RESEND_API_KEY) {
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "noreply@varshneyhomoeopathy.com",
      to: data.clinicEmail,
      subject,
      html,
    });
  }
}
