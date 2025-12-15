import { render } from "@react-email/render"
import { InterestConfirmationEmail } from "@/components/emails/InterestConfirmationEmail"

export async function renderInterestEmail(props: {
  fullName: string
  eventName: string
}) {
  return render(
    InterestConfirmationEmail({
      fullName: props.fullName,
      eventName: props.eventName,
    }),
  )
}
