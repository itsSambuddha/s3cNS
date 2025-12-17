// lib/email/sendDAInterestEmail.ts

import nodemailer from "nodemailer"

export interface SendDAInterestEmailOptions {
  to: string
  fullName: string
  eventName: string
  interestType?: "DELEGATE" | "CAMPUS_AMBASSADOR"
}

export async function sendDAInterestEmail(
  options: SendDAInterestEmailOptions,
): Promise<void> {
  const { to, fullName, eventName, interestType } = options

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  const roleText =
    interestType === "CAMPUS_AMBASSADOR" ? "Campus Ambassador" : "Delegate"

  const html = `
    <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;">
      <h1>Interest received for ${eventName}</h1>
      <p>Hi ${fullName},</p>
      <p>Thank you for showing interest in ${eventName} as a ${roleText}.</p>
      <p>We will get back to you soon with further details.</p>
      <p>Best regards,<br />SECMUN Delegate Affairs</p>
    </div>
  `

  await transporter.sendMail({
    from: `"SECMUN Delegate Affairs" <${process.env.SMTP_USER}>`,
    to,
    subject: `Your interest in ${eventName} has been received`,
    html,
  })
}
