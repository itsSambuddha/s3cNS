// app/api/finance/proposals/[id]/send/route.ts
import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { render } from '@react-email/render'
import { connectToDatabase } from '@/lib/db/connect'
import { FinanceProposal } from '@/lib/db/models/FinanceProposal'
import { FinanceProposalEmail } from '@/components/emails/FinanceProposalEmail'

type RouteParams = { params: Promise<{ id: string }> }

export async function POST(_req: Request, { params }: RouteParams) {
  try {
    const { id } = await params

    await connectToDatabase()

    const proposal = await FinanceProposal.findById(id).lean()

    if (!proposal) {
      return NextResponse.json(
        { error: 'Proposal not found' },
        { status: 404 },
      )
    }

    if (!proposal.toEmails || proposal.toEmails.length === 0) {
      return NextResponse.json(
        { error: 'No recipient emails set for this proposal' },
        { status: 400 },
      )
    }

    const fromName =
      process.env.FINANCE_FROM_NAME || 'SEC MUN FINANCE'
    const fromEmail =
      process.env.FINANCE_FROM_EMAIL || 'sidhusamsk@gmail.com'

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    const html = await render(
      FinanceProposalEmail({
        eventName: proposal.eventName || 'SEC-MUN event',
        title: proposal.title,
        sections: (proposal.sections || []).map((s: any) => `${s.heading}: ${s.body}`),
        lineItems: proposal.lineItems.map((li: any) => ({
          label: li.label,
          category: li.category,
          units: li.units,
          pricePerUnit: li.pricePerUnit,
          amount: li.amount,
        })),
      }),
    )

    const subject =
      proposal.title ||
      `Finance proposal for ${proposal.eventName || 'SEC-MUN event'}`

    console.log('Sending email to:', proposal.toEmails, 'subject:', subject)

    try {
      const info = await transporter.sendMail({
        from: `"${fromName}" <${fromEmail}>`,
        to: proposal.toEmails,
        subject,
        html,
      })
      console.log('Email sent successfully:', info.messageId)
    } catch (emailErr: any) {
      console.error('Email sending failed:', emailErr?.message ?? emailErr)
      throw emailErr
    }

    await FinanceProposal.findByIdAndUpdate(id, { status: 'SENT' })

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error('proposal send error', err?.message ?? err)
    return NextResponse.json(
      { error: 'Failed to send proposal' },
      { status: 500 },
    )
  }
}
