/**
 * Email notifications via Resend
 * Requires RESEND_API_KEY and RESEND_FROM env vars
 */

import { Resend } from "resend";

const getResend = () => new Resend(process.env.RESEND_API_KEY ?? "");
const FROM = process.env.RESEND_FROM || "noreply@pawsandpetals.com";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "";
const SITE_NAME = "Paws and Petals";

function baseHtml(content: string) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>
  body { font-family: 'DM Sans', sans-serif; background: #faf6f0; margin: 0; padding: 20px; }
  .card { background: white; border-radius: 16px; padding: 32px; max-width: 520px; margin: 0 auto; border: 1px solid rgba(26,58,42,0.07); }
  h1 { font-family: Georgia, serif; color: #1a3a2a; font-size: 24px; margin: 0 0 8px; }
  p { color: #1a3a2a; font-size: 15px; line-height: 1.6; margin: 0 0 16px; }
  .badge { display: inline-block; background: rgba(0,150,120,0.1); color: #009678; border-radius: 20px; padding: 4px 12px; font-size: 13px; font-weight: 600; }
  .footer { margin-top: 24px; font-size: 12px; color: rgba(26,58,42,0.4); text-align: center; }
  a { color: #009678; }
</style></head>
<body>
  <div class="card">
    ${content}
    <div class="footer">${SITE_NAME} · Sent automatically</div>
  </div>
</body>
</html>`;
}

/** New booking inquiry → admin */
export async function sendBookingInquiryAdmin(booking: {
  clientName: string;
  clientEmail: string;
  petName: string;
  service: string;
  startDate: string;
  endDate: string | null;
  notes: string | null;
}) {
  if (!process.env.RESEND_API_KEY) return;
  await getResend().emails.send({
    from: FROM,
    to: ADMIN_EMAIL,
    subject: `New booking inquiry from ${booking.clientName}`,
    html: baseHtml(`
      <h1>New Booking Inquiry</h1>
      <p><strong>${booking.clientName}</strong> (<a href="mailto:${booking.clientEmail}">${booking.clientEmail}</a>) has submitted a booking request.</p>
      <p>
        <span class="badge">${booking.service}</span>
      </p>
      <p><strong>Pet:</strong> ${booking.petName}<br>
         <strong>Dates:</strong> ${booking.startDate}${booking.endDate ? ` – ${booking.endDate}` : ""}</p>
      ${booking.notes ? `<p><strong>Notes:</strong> ${booking.notes}</p>` : ""}
      <p><a href="${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/admin/bookings">Review in Admin →</a></p>
    `),
  });
}

/** Booking confirmed → client */
export async function sendBookingConfirmedClient(booking: {
  clientEmail: string;
  clientName: string;
  petName: string;
  service: string;
  startDate: string;
  endDate: string | null;
}) {
  if (!process.env.RESEND_API_KEY) return;
  await getResend().emails.send({
    from: FROM,
    to: booking.clientEmail,
    subject: `Your booking is confirmed! 🐾`,
    html: baseHtml(`
      <h1>Booking Confirmed!</h1>
      <p>Hi ${booking.clientName},</p>
      <p>Great news — your booking has been confirmed. We&apos;re looking forward to welcoming ${booking.petName}!</p>
      <p>
        <span class="badge">${booking.service}</span>
      </p>
      <p><strong>Dates:</strong> ${booking.startDate}${booking.endDate ? ` – ${booking.endDate}` : ""}</p>
      <p>If you have any questions, just reply to this email.</p>
    `),
  });
}

/** Booking cancelled → client */
export async function sendBookingCancelledClient(booking: {
  clientEmail: string;
  clientName: string;
  petName: string;
  service: string;
  startDate: string;
}) {
  if (!process.env.RESEND_API_KEY) return;
  await getResend().emails.send({
    from: FROM,
    to: booking.clientEmail,
    subject: `Booking update for ${booking.petName}`,
    html: baseHtml(`
      <h1>Booking Update</h1>
      <p>Hi ${booking.clientName},</p>
      <p>Unfortunately, your booking for <strong>${booking.petName}</strong> (${booking.service} on ${booking.startDate}) has been cancelled.</p>
      <p>Please <a href="${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/account/bookings">visit your account</a> to submit a new request, or contact us with any questions.</p>
    `),
  });
}

/** Day-before reminder → client */
export async function sendDayBeforeReminder(booking: {
  clientEmail: string;
  clientName: string;
  petName: string;
  service: string;
  startDate: string;
  dropoffTime: string | null;
}) {
  if (!process.env.RESEND_API_KEY) return;
  await getResend().emails.send({
    from: FROM,
    to: booking.clientEmail,
    subject: `Reminder: ${booking.petName}'s stay starts tomorrow 🐾`,
    html: baseHtml(`
      <h1>See You Tomorrow!</h1>
      <p>Hi ${booking.clientName},</p>
      <p>Just a reminder that <strong>${booking.petName}</strong>'s ${booking.service} starts tomorrow (${booking.startDate}).</p>
      ${booking.dropoffTime ? `<p><strong>Preferred drop-off:</strong> ${booking.dropoffTime}</p>` : ""}
      <p>Please make sure vaccinations are up to date and bring any medications or special food.</p>
      <p>We can't wait to see ${booking.petName}! 🐾</p>
    `),
  });
}

/** Payment link → client */
export async function sendPaymentLink(params: {
  clientEmail:  string;
  clientName:   string;
  petName:      string;
  description:  string;
  amountCents:  number;
  paymentUrl:   string;
}) {
  if (!process.env.RESEND_API_KEY) return;
  const amount = `$${(params.amountCents / 100).toFixed(2)}`;
  await getResend().emails.send({
    from: FROM,
    to: params.clientEmail,
    subject: `Your invoice is ready — ${amount}`,
    html: baseHtml(`
      <h1>Payment Request</h1>
      <p>Hi ${params.clientName},</p>
      <p>Your invoice for <strong>${params.description}</strong> is ready.</p>
      <p style="font-size:28px;font-weight:bold;color:#1a3a2a;margin:16px 0">${amount}</p>
      <p>
        <a href="${params.paymentUrl}"
          style="display:inline-block;background:#009678;color:white;text-decoration:none;
                 padding:14px 28px;border-radius:12px;font-weight:600;font-size:15px">
          Pay Now →
        </a>
      </p>
      <p style="font-size:12px;color:rgba(26,58,42,0.4);margin-top:16px">
        Secure payment powered by Stripe. This link expires in 24 hours.
      </p>
    `),
  });
}
