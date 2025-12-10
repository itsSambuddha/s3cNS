// app/terms/page.tsx
export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-3xl px-4 pb-20 pt-16 space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold">Terms &amp; Conditions</h1>
          <p className="text-sm text-slate-300">
            These terms describe how the SEC‑MUN Control Room may be used by the
            Secretariat and other users. They are a general template and should be
            reviewed by your college administration or legal advisor.
          </p>
        </header>

        <section className="space-y-3 text-sm text-slate-200">
          <h2 className="text-base font-semibold">1. Use of the platform</h2>
          <p>
            The platform is intended for internal use by the SEC‑MUN Secretariat and
            related college bodies. You agree not to misuse the system, attempt to break
            security, or use it for unlawful activities.
          </p>
        </section>

        <section className="space-y-3 text-sm text-slate-200">
          <h2 className="text-base font-semibold">2. Accounts and access</h2>
          <p>
            Secretariat members are responsible for keeping their accounts secure and for
            actions taken under their logins. Access can be revoked by the Secretariat or
            college administration at any time.
          </p>
        </section>

        <section className="space-y-3 text-sm text-slate-200">
          <h2 className="text-base font-semibold">3. Data ownership</h2>
          <p>
            Conference and financial data entered into the platform remain the property of
            St. Edmund&apos;s College and the SEC‑MUN Secretariat. The developer may use
            anonymised, aggregated data to improve the system.
          </p>
        </section>

        <section className="space-y-3 text-sm text-slate-200">
          <h2 className="text-base font-semibold">4. Limitation of liability</h2>
          <p>
            The platform is provided on a best‑effort basis. There is no guarantee of
            uninterrupted availability, and the developer is not liable for indirect or
            consequential losses arising from its use.
          </p>
        </section>

        <section className="space-y-3 text-sm text-slate-200">
          <h2 className="text-base font-semibold">5. Changes to these terms</h2>
          <p>
            These terms may be updated when the platform changes or college requirements
            evolve. Continued use of the platform after updates means you accept the new
            terms.
          </p>
        </section>
      </div>
    </main>
  )
}
