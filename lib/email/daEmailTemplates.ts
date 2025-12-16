import { render } from "@react-email/render"
import { InterestConfirmationEmail } from "@/components/emails/InterestConfirmationEmail"

export async function renderInterestConfirmationEmail(input: {
  fullName: string
  eventName: string
  interestType: "DELEGATE" | "CAMPUS_AMBASSADOR"
  email: string
  phone: string
  submittedAt?: Date
}) {
  return render(
    InterestConfirmationEmail({
      fullName: input.fullName,
      eventName: input.eventName,
      interestType: input.interestType,
      email: input.email,
      phone: input.phone,
      submittedAt: input.submittedAt ?? new Date(),
    }),
  )
}
