//lib/email/sendDARegistrationEmail.ts
import nodemailer from "nodemailer"
import { render } from "@react-email/render"
import { RegistrationEmail } from "@/components/emails/RegistrationEmail"

export async function sendDARegistrationEmail(params: {
  to: string
  fullName: string
  eventName: string
  role: "DELEGATE" | "CAMPUS_AMBASSADOR"
  email: string
  phone: string
  formLink: string
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

    const html = await render(

      RegistrationEmail({

        fullName: params.fullName,

        eventName: params.eventName,

        role: params.role,

        email: params.email, // ✅ FIX

        phone: params.phone, // ✅ FIX

        formLink: params.formLink, // ✅ FIX

      }),

    )

  await transporter.sendMail({
    from: `"SECMUN Delegate Affairs" <${process.env.SMTP_USER}>`,
    to: params.to,
    subject: `Complete your registration for ${params.eventName}`,
    html,
  })
}
