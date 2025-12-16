import nodemailer from "nodemailer"
import { renderInterestConfirmationEmail } from "./daEmailTemplates"

export async function sendDAInterestEmail(params: {
  to: string
  fullName: string
  eventName: string
  interestType: "DELEGATE" | "CAMPUS_AMBASSADOR"
  email: string
  phone: string
  submittedAt?: Date
}) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  // 🔴 THIS WAS THE BUG — YOU MUST AWAIT
  const html = await renderInterestConfirmationEmail({
    fullName: params.fullName,
    eventName: params.eventName,
    interestType: params.interestType,
    email: params.email,
    phone: params.phone,
    submittedAt: params.submittedAt,
  })

  await transporter.sendMail({
    from: `"SECMUN Delegate Affairs" <${process.env.SMTP_USER}>`,
    to: params.to,
    subject: `Interest registered for ${params.eventName}`,
    html, // now string ✅
  })
}
