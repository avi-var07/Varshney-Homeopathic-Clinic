/**
 * Email utility — supports SMTP (primary) and Resend (fallback).
 *
 * SMTP setup (recommended — free with Gmail):
 *   SMTP_HOST=smtp.gmail.com
 *   SMTP_PORT=587
 *   SMTP_USER=your@gmail.com
 *   SMTP_PASS=your-16-char-app-password   ← NOT your Gmail password
 *   SMTP_FROM=your@gmail.com
 *
 * How to get a Gmail App Password:
 *   1. Go to https://myaccount.google.com/security
 *   2. Enable 2-Step Verification (if not already on)
 *   3. Search "App passwords" → Create → Name it "Clinic Website"
 *   4. Copy the 16-character password → paste as SMTP_PASS
 *
 * Resend fallback (optional):
 *   RESEND_API_KEY=re_xxxx
 */

import nodemailer from "nodemailer";
import { CLINIC_NAME, PHONE } from "@/lib/constants";

// ─── Shared HTML wrapper ─────────────────────────────────────────────────────

function wrapHtml(body: string, title: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#f0faf4;font-family:Arial,sans-serif;">
<div style="max-width:600px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
  <div style="background:linear-gradient(135deg,#166534 0%,#16a34a 100%);padding:28px 32px;text-align:center;">
    <h1 style="color:#fff;margin:0;font-size:22px;font-weight:700;">🌿 ${CLINIC_NAME}</h1>
    <p style="color:#bbf7d0;margin:4px 0 0;font-size:13px;">Family Homeopathic Practice Since 1992</p>
  </div>
  <div style="padding:28px 32px;">${body}</div>
  <div style="background:#f0faf4;padding:16px 32px;text-align:center;border-top:1px solid #dcfce7;">
    <p style="color:#16a34a;margin:0;font-size:12px;">
      ${CLINIC_NAME} · ${PHONE}<br/>
      Mughalsarai (Pt. DDU Nagar), Chandauli, UP
    </p>
  </div>
</div>
</body>
</html>`;
}

// ─── Transport factory ───────────────────────────────────────────────────────

function createSmtpTransport() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) return null;

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    tls: { rejectUnauthorized: false }, // allow self-signed certs
  });
}

const FROM_NAME = CLINIC_NAME;
const FROM_ADDR =
  process.env.SMTP_FROM ||
  process.env.RESEND_FROM_EMAIL ||
  "noreply@varshneyhomoeopathy.com";
const CLINIC_EMAIL =
  process.env.CLINIC_EMAIL || process.env.SMTP_USER || "";

// ─── Core send function ──────────────────────────────────────────────────────

async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
}): Promise<void> {
  const from = `"${FROM_NAME}" <${FROM_ADDR}>`;

  // 1️⃣ Try SMTP first
  const smtpTransport = createSmtpTransport();
  if (smtpTransport) {
    await smtpTransport.sendMail({ from, to: opts.to, subject: opts.subject, html: opts.html });
    return;
  }

  // 2️⃣ Fallback to Resend
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    const { Resend } = await import("resend");
    const resend = new Resend(resendKey);
    await resend.emails.send({ from: FROM_ADDR, to: opts.to, subject: opts.subject, html: opts.html });
    return;
  }

  // 3️⃣ Dev fallback — log to console
  console.log(`\n📧 [EMAIL - no transport configured]`);
  console.log(`   To:      ${opts.to}`);
  console.log(`   Subject: ${opts.subject}`);
  console.log(`   (Configure SMTP_HOST/USER/PASS or RESEND_API_KEY to send real emails)\n`);
}

// ─── OTP Email ───────────────────────────────────────────────────────────────

export async function sendOtpEmail(
  email: string,
  otp: string,
  name?: string
): Promise<void> {
  const body = `
    <h2 style="color:#166534;margin:0 0 8px;">Your Login OTP</h2>
    <p style="color:#374151;margin:0 0 20px;">Hello ${name || "there"},</p>
    <p style="color:#374151;margin:0 0 20px;">Use this OTP to log in to your patient account.</p>
    <div style="background:#f0faf4;border:2px dashed #16a34a;border-radius:12px;padding:20px;text-align:center;margin:20px 0;">
      <p style="font-size:36px;font-weight:700;color:#166534;margin:0;letter-spacing:8px;">${otp}</p>
      <p style="color:#16a34a;font-size:12px;margin:8px 0 0;">Valid for 10 minutes · Do not share</p>
    </div>
    <p style="color:#6b7280;font-size:13px;margin:16px 0 0;">If you did not request this, please ignore this email.</p>`;
  await sendEmail({
    to: email,
    subject: `${otp} — Your Login OTP for ${CLINIC_NAME}`,
    html: wrapHtml(body, "Login OTP"),
  });
}

// ─── Appointment Confirmation ─────────────────────────────────────────────────

export async function sendAppointmentConfirmation(data: {
  name: string;
  email: string;
  tokenNumber: string;
  type: string;
  date: string;
  time: string;
  meetLink?: string;
}): Promise<void> {
  const typeLabel = data.type === "online" ? "Online Consultation" : "Offline Visit";
  const body = `
    <h2 style="color:#166534;margin:0 0 8px;">Appointment Confirmed ✅</h2>
    <p style="color:#374151;margin:0 0 20px;">Dear ${data.name}, your appointment is confirmed.</p>
    <div style="background:#f0faf4;border-radius:12px;padding:20px;margin:20px 0;">
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="color:#6b7280;font-size:13px;padding:6px 0;width:130px;">Token Number</td><td style="color:#166534;font-weight:700;font-size:16px;">${data.tokenNumber}</td></tr>
        <tr><td style="color:#6b7280;font-size:13px;padding:6px 0;">Type</td><td style="color:#374151;font-weight:600;">${typeLabel}</td></tr>
        <tr><td style="color:#6b7280;font-size:13px;padding:6px 0;">Date</td><td style="color:#374151;font-weight:600;">${data.date}</td></tr>
        <tr><td style="color:#6b7280;font-size:13px;padding:6px 0;">Time</td><td style="color:#374151;font-weight:600;">${data.time}</td></tr>
        ${data.meetLink ? `<tr><td style="color:#6b7280;font-size:13px;padding:6px 0;">Meeting</td><td><a href="${data.meetLink}" style="color:#16a34a;font-weight:600;">Join Google Meet →</a></td></tr>` : ""}
      </table>
    </div>
    ${data.type === "offline" ? `<p style="color:#374151;font-size:14px;">Please bring your token number when visiting the clinic.</p>` : ""}
    <p style="color:#374151;font-size:14px;">For any queries, call/WhatsApp: <strong>${PHONE}</strong></p>`;
  await sendEmail({
    to: data.email,
    subject: `Appointment Confirmed – Token ${data.tokenNumber} | ${CLINIC_NAME}`,
    html: wrapHtml(body, "Appointment Confirmed"),
  });
}

// ─── Meet Link Email ──────────────────────────────────────────────────────────

export async function sendMeetLinkEmail(data: {
  name: string;
  email: string;
  tokenNumber: string;
  date: string;
  time: string;
  meetLink: string;
}): Promise<void> {
  const body = `
    <h2 style="color:#166534;margin:0 0 8px;">Your Google Meet Link is Ready 🎥</h2>
    <p style="color:#374151;margin:0 0 20px;">Dear ${data.name}, your online consultation details are below.</p>
    <div style="background:#f0faf4;border-radius:12px;padding:20px;margin:20px 0;text-align:center;">
      <p style="color:#6b7280;font-size:13px;margin:0 0 4px;">Token: <strong style="color:#166534;">${data.tokenNumber}</strong></p>
      <p style="color:#374151;font-weight:600;margin:0 0 4px;">${data.date} at ${data.time}</p>
      <a href="${data.meetLink}" style="display:inline-block;margin-top:16px;background:linear-gradient(135deg,#166534,#16a34a);color:#fff;text-decoration:none;padding:14px 28px;border-radius:10px;font-weight:700;font-size:16px;">Join Google Meet</a>
    </div>
    <p style="color:#6b7280;font-size:13px;">If the button doesn't work:<br/><a href="${data.meetLink}" style="color:#16a34a;">${data.meetLink}</a></p>`;
  await sendEmail({
    to: data.email,
    subject: `Online Consultation Link – ${data.date} | Token ${data.tokenNumber}`,
    html: wrapHtml(body, "Meeting Link"),
  });
}

// ─── Payment Rejection ────────────────────────────────────────────────────────

export async function sendPaymentRejectionEmail(data: {
  name: string;
  email: string;
  reason?: string;
}): Promise<void> {
  const body = `
    <h2 style="color:#dc2626;margin:0 0 8px;">Payment Verification Issue</h2>
    <p style="color:#374151;margin:0 0 20px;">Dear ${data.name},</p>
    <p style="color:#374151;margin:0 0 20px;">We were unable to verify your payment.${data.reason ? ` Reason: <strong>${data.reason}</strong>` : ""}</p>
    <p style="color:#374151;margin:0 0 20px;">Please resubmit a clear screenshot. Need help? Contact: <strong>${PHONE}</strong></p>`;
  await sendEmail({
    to: data.email,
    subject: `Payment Issue – Please Resubmit | ${CLINIC_NAME}`,
    html: wrapHtml(body, "Payment Issue"),
  });
}

// ─── Notify clinic on new appointment ────────────────────────────────────────

export async function notifyClinicNewAppointment(data: {
  name: string;
  mobile: string;
  type: string;
  date: string;
  time: string;
  symptoms: string;
}): Promise<void> {
  if (!CLINIC_EMAIL) return; // skip if not configured
  const body = `
    <h2 style="color:#166534;">New Appointment Request</h2>
    <table style="width:100%;border-collapse:collapse;">
      <tr><td style="color:#6b7280;font-size:13px;padding:5px 0;width:100px;">Patient</td><td style="color:#374151;font-weight:600;">${data.name}</td></tr>
      <tr><td style="color:#6b7280;font-size:13px;padding:5px 0;">Mobile</td><td style="color:#374151;font-weight:600;">${data.mobile}</td></tr>
      <tr><td style="color:#6b7280;font-size:13px;padding:5px 0;">Type</td><td style="color:#374151;font-weight:600;">${data.type}</td></tr>
      <tr><td style="color:#6b7280;font-size:13px;padding:5px 0;">Date/Time</td><td style="color:#374151;font-weight:600;">${data.date} at ${data.time}</td></tr>
      <tr><td style="color:#6b7280;font-size:13px;padding:5px 0;">Symptoms</td><td style="color:#374151;">${data.symptoms}</td></tr>
    </table>`;
  await sendEmail({
    to: CLINIC_EMAIL,
    subject: `New Appointment – ${data.name} (${data.type}) on ${data.date}`,
    html: wrapHtml(body, "New Appointment"),
  });
}
