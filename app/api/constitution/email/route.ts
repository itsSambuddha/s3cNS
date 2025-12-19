// app/api/constitution/email/route.ts
import { NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { render } from "@react-email/render"
import { ConstitutionEmail } from "@/components/emails/ConstitutionEmail"

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "No email provided" },
        { status: 400 },
      )
    }

    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    if (!isValid) {
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400 },
      )
    }

    const fromName =
      process.env.CONSTITUTION_FROM_NAME || "SECMUN SECRETARIAT"
    const fromEmail =
      process.env.CONSTITUTION_FROM_EMAIL || process.env.SMTP_USER || "no-reply@example.com"

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
      ConstitutionEmail({
        recipientEmail: email,
      }),
    )

    const subject =
      "SECMUN Secretariat Mandate & Constitution (2025–26)"

    console.log("Sending constitution email to:", email, "subject:", subject)

    try {
      const info = await transporter.sendMail({
        from: `"${fromName}" <${fromEmail}>`,
        to: email,
        subject,
        html,
      })
      console.log("Constitution email sent successfully:", info.messageId)
    } catch (emailErr: any) {
      console.error(
        "Constitution email sending failed:",
        emailErr?.message ?? emailErr,
      )
      throw emailErr
    }

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error("constitution send error", err?.message ?? err)
    return NextResponse.json(
      { error: "Failed to send constitution email" },
      { status: 500 },
    )
  }
}
