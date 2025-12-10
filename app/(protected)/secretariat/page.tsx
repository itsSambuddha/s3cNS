// app/(protected)/secretariat/page.tsx
import { SeniorSecretariatCarousel } from '@/components/secretariat/SeniorSecretariatCarousel'
import { SecretariatMembersShowcase } from '@/components/secretariat/SecretariatMembersShowcase'

export default function SecretariatPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold sm:text-3xl">
          Secretariat
        </h1>
        <p className="text-sm text-muted-foreground">
          Overview of the core leadership and departments for this SEC‑MUN
          cycle.
        </p>
            <SeniorSecretariatCarousel />
    <SecretariatMembersShowcase /> 
      </div>


    </div>
  )
}
