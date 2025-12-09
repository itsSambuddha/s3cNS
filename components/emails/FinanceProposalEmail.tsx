// components/emails/FinanceProposalEmail.tsx
import * as React from 'react'
import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from '@react-email/components'
import { /* ... */ Img, Link } from '@react-email/components'

interface LineItem {
  label: string
  category?: string
  units?: number
  pricePerUnit?: number | string
  amount: number
}

interface FinanceProposalEmailProps {
  eventName: string
  title: string
  sections: { heading: string; body: string }[]
  lineItems: LineItem[]
}

export function FinanceProposalEmail({
  eventName,
  title,
  sections,
  lineItems,
}: FinanceProposalEmailProps) {
  const total = lineItems.reduce((sum, item) => sum + (item.amount || 0), 0)

  const formatCurrency = (value: number | string | undefined) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(Number(value || 0))

      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return (
    <Html>
      <Head />
      <Preview>{`Finance proposal for ${eventName}`}</Preview>

      <Tailwind>
        <Body className="mx-auto my-0 bg-slate-50 font-sans">
          <Container className="mx-auto my-8 max-w-xl rounded-2xl bg-white px-6 py-6 shadow-sm">
            {/* Header */}
            <Section className="mb-4">
              <Row>
                <Column>
                  <Text className="text-3xl font-bold uppercase tracking-[0.18em] text-slate-500">
                    secmun secretariat
                  </Text>
                  <Heading className="mt-1 text-xl font-semibold text-slate-900">
                    Office of the USG Finance
                  </Heading>
                  <Text className="mt-1 text-xs text-slate-500">
                    Finance Proposal for <span className="font-medium font-extrabold">{eventName}</span>
                  </Text>
                </Column>
              </Row>
            </Section>

            <Hr className="my-4 border-slate-200" />

            {/* Title */}
            <Section className="mb-4">
              <Heading as="h2" className="text-[15px] font-semibold text-slate-900">
                {title}
              </Heading>
            </Section>

            {/* Narrative sections */}
            {sections && sections.length > 0 && (
              <Section className="mb-5 space-y-3">
                {sections.map((s, idx) => (
                  <div key={idx}>
                    <Text className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      {s.heading}
                    </Text>
                    <Text className="whitespace-pre-line text-[13px] leading-relaxed text-slate-800">
                      {s.body}
                    </Text>
                  </div>
                ))}
              </Section>
            )}

            <Hr className="my-4 border-slate-200" />

            {/* Budget table */}
            <Section className="mb-4">
              <Heading
                as="h3"
                className="mb-2 text-[13px] font-semibold uppercase tracking-wide text-slate-600"
              >
                Budget breakdown
                
              </Heading>

              <table className="w-full border-collapse text-[11px]">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="border border-slate-200 px-2 py-1 text-left font-semibold text-slate-600">
                      Item
                    </th>
                    <th className="border border-slate-200 px-2 py-1 text-left font-semibold text-slate-600">
                      Category
                    </th>
                    <th className="border border-slate-200 px-2 py-1 text-right font-semibold text-slate-600">
                      Units
                    </th>
                    <th className="border border-slate-200 px-2 py-1 text-right font-semibold text-slate-600">
                      Price / unit
                    </th>
                    <th className="border border-slate-200 px-2 py-1 text-right font-semibold text-slate-600">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {lineItems.map((item, index) => (
                    <tr key={index}>
                      <td className="border border-slate-200 px-2 py-1 text-slate-800">
                        {item.label}
                      </td>
                      <td className="border border-slate-200 px-2 py-1 text-slate-700">
                        {item.category || '—'}
                      </td>
                      <td className="border border-slate-200 px-2 py-1 text-right text-slate-700">
                        {item.units ?? '—'}
                      </td>
                      <td className="border border-slate-200 px-2 py-1 text-right text-slate-700">
                        {item.pricePerUnit != null
                          ? formatCurrency(item.pricePerUnit)
                          : '—'}
                      </td>
                      <td className="border border-slate-200 px-2 py-1 text-right text-slate-900">
                        {formatCurrency(item.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-50 font-semibold">
                    <td
                      colSpan={4}
                      className="border border-slate-200 px-2 py-1 text-right text-slate-700"
                    >
                      Total
                    </td>
                    <td className="border border-slate-200 px-2 py-1 text-right text-slate-900">
                      {formatCurrency(total)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </Section>

<Hr className="my-4 border-slate-200" />

<Section>
  <Row className="mb-2">
    <Column>
      <Text className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
        Contact
      </Text>
      <Text className="mt-1 text-[12px] text-slate-700">
        Email:{' '}
        <Link
          href="mailto:sidhusamsk@gmail.com"
          className="text-slate-900 underline"
        >
          sidhusamsk@gmail.com
        </Link>
      </Text>
      {/* <Text className="text-[12px] text-slate-700">
        Phone: <span className="font-medium">+91-8837405788</span>
      </Text> */}
      <Text className="text-[12px] text-slate-700">
        Instagram:{' '}
        <Link
          href="https://instagram.com/secmun2024"
          className="text-slate-900 underline"
        >
          @secmun2024
        </Link>
      </Text>
      <Text className="mt-1 text-[11px] text-slate-500">
        Address: SECMUN Secretariat, St. Edmund's College Shillong, Meghalaya, India
      </Text>
    </Column>

    <Column align="right" className="pt-2">
      <Row>
        <Column className="pr-[6px]">
          <Link href="mailto:sidhusamsk@gmail.com">
            <Img
              alt="Email"
              width="24"
              height="24"
              src={`${baseUrl}/logo/mail.svg`}
            />
          </Link>
        </Column>
        <Column className="pr-[6px]">
          <Link href="https://instagram.com/secmun2024">
            <Img
              alt="Instagram"
              width="24"
              height="24"
              src="https://react.email/static/instagram-logo.png"
            />
          </Link>
        </Column>
      </Row>
    </Column>
  </Row>

  <Text className="mt-3 text-[11px] leading-snug text-slate-500">
    This email was generated by the SECMUN Finance workspace. Please review the
    proposal and respond to the Secretariat with any questions or clarifications.
  </Text>
  <Text className="mt-1 text-[11px] text-slate-400">
    Office of the USG Finance · SECMUN Secretariat
  </Text>
</Section>

            
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
