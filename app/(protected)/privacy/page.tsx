// app/privacy/page.tsx
export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-3xl px-4 pb-20 pt-16 space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold">Privacy Policy</h1>
          <p className="text-sm text-slate-300">
            This page explains how the SEC‑MUN Control Room handles information about you
            and your Secretariat. It is a general informational template and does not
            replace legal advice.
          </p>
        </header>

        <section className="space-y-3 text-sm text-slate-200">
          <h2 className="text-base font-semibold">1. Information collected</h2>
          <p>
            SEC‑MUN Control Room stores only the data needed to run conferences and
            internal Secretariat work, such as user accounts, role assignments, event
            details, and financial records that you enter into the system.
          </p>
        </section>

        <section className="space-y-3 text-sm text-slate-200">
          <h2 className="text-base font-semibold">2. How information is used</h2>
          <p>
            Data is used solely to provide features like dashboards, notifications,
            archives, and analytics for your Secretariat. It is not sold or shared with
            third‑party advertisers.
          </p>
        </section>

        <section className="space-y-3 text-sm text-slate-200">
          <h2 className="text-base font-semibold">3. Data access and retention</h2>
          <p>
            Access to the workspace is limited to Secretariat members and other roles you
            explicitly grant. Records are retained for institutional memory unless the
            Secretariat or college administration requests removal.
          </p>
        </section>

        <section className="space-y-3 text-sm text-slate-200">
          <h2 className="text-base font-semibold">4. Contact</h2>
          <p>
            For any questions about this policy or data requests, contact:
            <br />
            <span className="font-medium">secretariat@secmun.in</span>
          </p>
        </section>
      </div>
    </main>
  )
}
