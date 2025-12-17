// app/(public)/register/page.tsx

import { RegisterForm } from "@/components/public/RegisterForm"

type EventType = "INTRA_SECMUN" | "INTER_SECMUN" | "WORKSHOP" | "EDBLAZON_TIMES"

function normalizeEventType(raw?: string): EventType {
  if (
    raw === "INTRA_SECMUN" ||
    raw === "INTER_SECMUN" ||
    raw === "WORKSHOP" ||
    raw === "EDBLAZON_TIMES"
  ) {
    return raw
  }
  return "INTRA_SECMUN"
}

export default async function RegisterPage(props: {
  searchParams: Promise<{ eventType?: string; eventId?: string }>
}) {
  const params = await props.searchParams
  const eventType = normalizeEventType(params.eventType)
  const eventId = params.eventId

  return <RegisterForm eventType={eventType} eventId={eventId} />
}
