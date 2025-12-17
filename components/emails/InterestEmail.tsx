// components/emails/InterestEmail.tsx

import * as React from "react"
import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components"

interface InterestEmailProps {
  fullName: string
  eventName: string
  interestType?: "DELEGATE" | "CAMPUS_AMBASSADOR"
  email: string
  phone: string
}

export function InterestEmail({
  fullName,
  eventName,
  interestType,
  email,
  phone,
}: InterestEmailProps) {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

  const roleText =
    interestType === "CAMPUS_AMBASSADOR" ? "Campus Ambassador" : "Delegate"

  return (
    <Html>
      <Head />
      <Preview>{`Interest received for ${eventName}`}</Preview>

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
                    Office of Delegation Affairs
                  </Heading>
                  <Text className="mt-1 text-xs text-slate-500">
                    Interest Acknowledgement
                  </Text>
                </Column>
              </Row>
            </Section>

            <Hr className="my-4 border-slate-200" />

            {/* Greeting */}
            <Section className="mb-4">
              <Text className="text-[14px] text-slate-800">
                Dear <span className="font-semibold">{fullName}</span>,
              </Text>

              <Text className="mt-2 text-[13px] leading-relaxed text-slate-700">
                Thank you for submitting your interest in{" "}
                <span className="font-semibold">{eventName}</span> as a{" "}
                {roleText}.
              </Text>
            </Section>

            {/* Summary */}
            <Section className="mb-4 rounded-xl bg-slate-50 px-4 py-3">
              <Text className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Interest Details
              </Text>

              <Text className="text-[12px] text-slate-800">
                <strong>Event:</strong> {eventName}
              </Text>

              <Text className="text-[12px] text-slate-800">
                <strong>Role of interest:</strong> {roleText}
              </Text>

              <Text className="text-[12px] text-slate-800">
                <strong>Email:</strong> {email}
              </Text>

              <Text className="text-[12px] text-slate-800">
                <strong>WhatsApp:</strong> {phone}
              </Text>

              <Text className="mt-2 text-[12px] text-slate-700">
                The Secretariat will review all submissions and begin allotment
                shortly. If shortlisted, you will receive a separate email with
                the official registration form.
              </Text>
            </Section>

            <Hr className="my-4 border-slate-200" />

            {/* Contact */}
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
                    SECMUN Secretariat, St. Edmund&apos;s College, Shillong,
                    Meghalaya, India
                  </Text>
                </Column>

                <Column align="right" className="pt-2">
                  <Row>
                    <Column className="pr-[6px]">
                      <Link href="mailto:sidhusamsk@gmail.com">
                        <img
                          alt="Email"
                          width={24}
                          height={24}
                          src={`${baseUrl}/logo/mail.svg`}
                        />
                      </Link>
                    </Column>

                    <Column className="pr-[6px]">
                      <Link href="https://instagram.com/secmun2024">
                        <img
                          alt="Instagram"
                          width={24}
                          height={24}
                          src="https://react.email/static/instagram-logo.png"
                        />
                      </Link>
                    </Column>
                  </Row>
                </Column>
              </Row>

              <Text className="mt-3 text-[11px] leading-snug text-slate-500">
                This is an automated message generated by the SECMUN Delegation
                Affairs system. Please do not reply directly to this email.
              </Text>

              <Text className="mt-1 text-[11px] text-slate-400">
                Office of Delegation Affairs · SECMUN Secretariat
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
