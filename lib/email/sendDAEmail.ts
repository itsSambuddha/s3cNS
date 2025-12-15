import nodemailer from "nodemailer"
import { renderInterestEmail } from "./daEmailTemplates"

export async function sendDAInterestEmail(params: {
  to: string
  fullName: string
  eventName: string
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

  const html = await renderInterestEmail({
    fullName: params.fullName,
    eventName: params.eventName,
  })

  await transporter.sendMail({
    from: `"SECMUN Delegate Affairs" <${process.env.SMTP_USER}>`,
    to: params.to,
    subject: `Interest registered for ${params.eventName}`,
    html,
  })
}
