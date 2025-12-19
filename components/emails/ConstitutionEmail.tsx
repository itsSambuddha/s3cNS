// components/emails/ConstitutionEmail.tsx
import * as React from "react"
import {
  Body,
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
  Link,
  Column,
} from "@react-email/components"

interface ConstitutionEmailProps {
  recipientEmail?: string
}

export function ConstitutionEmail({ recipientEmail }: ConstitutionEmailProps) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

  return (
    <Html>
      <Head />
      <Preview>SECMUN Secretariat Mandate & Constitution (2025–26)</Preview>

      <Tailwind>
        <Body className="mx-auto my-0 bg-slate-50 font-sans">
          <Container className="mx-auto my-8 max-w-xl rounded-2xl bg-white px-6 py-6 shadow-sm">
            {/* Header */}
            <Section className="mb-4">
              <Row>
                <Column>
                  <Text className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                    SECMUN SECRETARIAT
                  </Text>
                  <Heading className="mt-1 text-xl font-semibold text-slate-900">
                    Secretariat Mandate & Constitution
                  </Heading>
                  {recipientEmail && (
                    <Text className="mt-1 text-xs text-slate-500">
                      Sent to <span className="font-medium">{recipientEmail}</span>
                    </Text>
                  )}
                </Column>
              </Row>
            </Section>

            <Hr className="my-4 border-slate-200" />

            {/* Intro */}
            <Section className="mb-4">
              <Heading
                as="h2"
                className="mb-2 text-[13px] font-semibold uppercase tracking-wide text-slate-600"
              >
                Overview
              </Heading>
              <Text className="text-[13px] leading-relaxed text-slate-800">
                This email contains the current governance framework for SECMUN
                (Secretarial Year 2025–26), combining the Secretariat Mandate
                and the formal Constitution (Articles 1–13).
              </Text>
            </Section>

            {/* What’s inside */}
            <Section className="mb-4">
              <Heading
                as="h3"
                className="mb-2 text-[13px] font-semibold uppercase tracking-wide text-slate-600"
              >
                What this covers
              </Heading>
              <ul className="list-disc space-y-1 pl-4 text-[13px] leading-relaxed text-slate-800">
                <li>
                  <span className="font-medium">Secretariat in brief</span> – structure,
                  Senior Secretariat roles, and departmental responsibilities.
                </li>
                <li>
                  <span className="font-medium">Conference playbook</span> – timelines,
                  checklists, and best practices from preparation to closing.
                </li>
                <li>
                  <span className="font-medium">Constitution Articles 1–13</span> – name
                  & purpose, membership, hierarchy, finance, code of conduct,
                  certification, and dissolution.
                </li>
              </ul>
            </Section>

            {/* Link back to site */}
            <Section className="mb-4">
              <Heading
                as="h3"
                className="mb-2 text-[13px] font-semibold uppercase tracking-wide text-slate-600"
              >
                Read the latest version online
              </Heading>
              <Text className="text-[13px] leading-relaxed text-slate-800">
                The live, most up-to-date version of this document is always
                available at:
              </Text>
              <Text className="mt-1 text-[13px]">
                <Link
                  href={`${baseUrl}/constitution`}
                  className="text-blue-600 underline"
                >
                  {baseUrl}/constitution
                </Link>
              </Text>
              <Text className="mt-2 text-[11px] text-slate-500">
                Any future amendments approved by the Teacher-in-Charge and
                Senior Secretariat will be reflected on this page.
              </Text>
            </Section>

            <Hr className="my-4 border-slate-200" />

            {/* Contact / footer */}
            <Section>
              <Row className="mb-2">
                <Column>
                  <Text className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Contact
                  </Text>
                  <Text className="mt-1 text-[12px] text-slate-700">
                    Email:{" "}
                    <Link
                      href="mailto:sidhusamsk@gmail.com"
                      className="text-slate-900 underline"
                    >
                      sidhusamsk@gmail.com
                    </Link>
                  </Text>
                  <Text className="text-[12px] text-slate-700">
                    Instagram:{" "}
                    <Link
                      href="https://instagram.com/secmun2024"
                      className="text-slate-900 underline"
                    >
                      @secmun2024
                    </Link>
                  </Text>
                  <Text className="mt-1 text-[11px] text-slate-500">
                    Address: SECMUN Secretariat, St. Edmund&apos;s College,
                    Shillong, Meghalaya, India
                  </Text>
                </Column>
              </Row>

              <Text className="mt-3 text-[11px] leading-snug text-slate-500">
                This email was generated by the SECMUN Secretariat workspace.
                If you did not request it, you can safely ignore this message.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
