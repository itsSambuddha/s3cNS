// components/landing/LampSection.tsx
'use client'

import Lamp from '@/components/ui/lamp'

export function LampSection() {
  return (
    <section className="relative -mt-40 flex justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl">
        <Lamp>
          <div className="space-y-3 text-center sm:space-y-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-500">
              Why this platform
            </p>
            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Turn scattered secretariat work into a single command centre
            </h2>
            <p className="mx-auto max-w-2xl text-xs text-slate-400 sm:text-sm">
              SECMUN&apos;s leadership gets one place to see events, finances,
              members, and approvals. No more hunting through spreadsheets,
              chats, and emails when the conference is two weeks away.
            </p>
          </div>
        </Lamp>
      </div>
    </section>
  )
}
