import nodemailer from "nodemailer"
import { render } from "@react-email/render"
import { InterestEmail } from "@/components/emails/InterestEmail"

export interface SendDAInterestEmailOptions {
  to: string
  fullName: string
  eventName: string
  interestType?: "DELEGATE" | "CAMPUS_AMBASSADOR"
  email: string
  phone: string
}

export async function sendDAInterestEmail(
  options: SendDAInterestEmailOptions,
): Promise<void> {
  const { to, fullName, eventName, interestType, email, phone } = options

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  const html = await render(
    InterestEmail({
      fullName,
      eventName,
      interestType,
      email,
      phone,
    }),
  )

  await transporter.sendMail({
    from: `"SECMUN Delegate Affairs" <${process.env.SMTP_USER}>`,
    to,
    subject: `Interest received for ${eventName}`,
    html,
  })
}
