"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

type EventType =
  | "INTRA_SECMUN"
  | "INTER_SECMUN"
  | "WORKSHOP"
  | "EDBLAZON_TIMES"

type InterestType = "DELEGATE" | "CAMPUS_AMBASSADOR"

function eventTypeToName(type: EventType): string {
  switch (type) {
    case "INTRA_SECMUN":
      return "Intra SECMUN"
    case "INTER_SECMUN":
      return "Inter SECMUN"
    case "WORKSHOP":
      return "Workshop"
    case "EDBLAZON_TIMES":
      return "EdBlazon Times"
  }
}

export function RegisterForm({ eventType }: { eventType: EventType }) {
  const router = useRouter()

  const [interestType, setInterestType] =
    useState<InterestType>("DELEGATE")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  async function submit() {
    if (!fullName || !email || !phone) return

    setLoading(true)

    const res = await fetch("/api/registrations/interest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventType,
        interestType,
        fullName,
        email,
        whatsAppNumber: phone,
      }),
    })

    setLoading(false)

    if (res.ok) setSubmitted(true)
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white px-4">
      {/* ===== Animated gradient background ===== */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <motion.div
          className="absolute -top-32 -left-32 h-[28rem] w-[28rem] rounded-full bg-blue-500/20 blur-3xl"
          animate={{ x: [0, 120, 0], y: [0, 60, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[-6rem] right-[-6rem] h-[24rem] w-[24rem] rounded-full bg-sky-400/15 blur-3xl"
          animate={{ x: [0, -100, 0], y: [0, -80, 0] }}
          transition={{ duration: 45, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute left-1/2 top-1/3 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-white/60 blur-3xl" />
      </div>

      {/* ===== Form card ===== */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative w-full max-w-lg rounded-2xl border border-border/60 bg-white p-8 shadow-[0_12px_40px_rgba(0,0,0,0.08)]"
      >
        {!submitted ? (
          <>
            <h1 className="text-xl font-semibold">
              Register for {eventTypeToName(eventType)}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Submit your interest. Delegate Affairs will contact you shortly.
            </p>

            <div className="mt-6 space-y-5">
              {/* Interest type */}
              <div>
                <p className="mb-2 text-sm font-medium">
                  Registering as
                </p>
                <RadioGroup
                  value={interestType}
                  onValueChange={(v) =>
                    setInterestType(v as InterestType)
                  }
                  className="flex gap-6"
                >
                  <label className="flex items-center gap-2 text-sm">
                    <RadioGroupItem value="DELEGATE" />
                    Delegate
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <RadioGroupItem value="CAMPUS_AMBASSADOR" />
                    Campus Ambassador
                  </label>
                </RadioGroup>
              </div>

              {/* Inputs */}
              <div className="space-y-4">
                <Input
                  placeholder="Full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
                <Input
                  placeholder="Email address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  placeholder="Phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <Button
                onClick={submit}
                disabled={loading}
                className="w-full rounded-full"
              >
                {loading ? "Submitting..." : "Submit interest"}
              </Button>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-xl font-semibold">
              Interest submitted
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              s3cNS will reach out within 48 hours.
            </p>
            <Button
              className="mt-6 w-full rounded-full"
              onClick={() => router.push("/")}
            >
              Back to home
            </Button>
          </>
        )}
      </motion.div>
    </main>
  )
}
