// lib/email/sendEmail.ts
import nodemailer from "nodemailer"

export async function sendEmail(params: {
  to: string | string[]
  subject: string
  html: string
  fromName?: string
}) {
  const transporter = nodemailer.createTransport({
    host: (process.env.SMTP_HOST || "smtp.gmail.com").trim(),
    port: Number(process.env.SMTP_PORT) || 465,
    secure: true,
    auth: {
      user: (process.env.SMTP_USER || "").trim(),
      pass: (process.env.SMTP_PASS || "").replace(/\s/g, ""),
    },
  })

  const fromLabel = params.fromName ? `"${params.fromName}"` : '"SEC-MUN"'
  const from = `${fromLabel} <${process.env.SMTP_USER}>`

  await transporter.sendMail({
    from,
    to: params.to,
    subject: params.subject,
    html: params.html,
  })
}
