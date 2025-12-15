import {
  Html,
  Head,
  Body,
  Container,
  Text,
} from "@react-email/components"

export function InterestConfirmationEmail({
  fullName,
  eventName,
}: {
  fullName: string
  eventName: string
}) {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: "#f9fafb", padding: "24px" }}>
        <Container style={{ background: "#ffffff", padding: "24px" }}>
          <Text>Hello {fullName},</Text>
          <Text>
            Your interest has been successfully registered for{" "}
            <strong>{eventName}</strong>.
          </Text>
          <Text>
            Delegate Affairs will reach out to you shortly with the next steps.
          </Text>
          <Text>— SECMUN Team</Text>
        </Container>
      </Body>
    </Html>
  )
}
