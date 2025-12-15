import { RegisterForm } from "@/components/public/RegisterForm"

type EventType =
  | "INTRA_SECMUN"
  | "INTER_SECMUN"
  | "WORKSHOP"
  | "EDBLAZON_TIMES"

function normalizeEventType(
  raw: string | string[] | undefined,
): EventType {
  if (!raw) return "INTRA_SECMUN" // safe fallback
  const value = Array.isArray(raw) ? raw[0] : raw
  if (
    value === "INTRA_SECMUN" ||
    value === "INTER_SECMUN" ||
    value === "WORKSHOP" ||
    value === "EDBLAZON_TIMES"
  ) {
    return value
  }
  return "INTRA_SECMUN" // safe fallback
}

export default function RegisterPage({
  searchParams,
}: {
  searchParams?: { eventType?: string }
}) {
  const eventType = normalizeEventType(searchParams?.eventType)

  return (
    <RegisterForm eventType={eventType} />
  )
}
