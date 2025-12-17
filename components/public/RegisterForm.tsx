// components/public/RegisterForm.tsx

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react"

type EventType = "INTRA_SECMUN" | "INTER_SECMUN" | "WORKSHOP" | "EDBLAZON_TIMES"
type InterestType = "DELEGATE" | "CAMPUS_AMBASSADOR"

interface APIErrorResponse {
  error: string
  code?: string
  details?: unknown
}

interface ValidationErrors {
  fullName?: string
  email?: string
  phone?: string
  general?: string
}

function eventTypeToName(type: EventType): string {
  const names: Record<EventType, string> = {
    INTRA_SECMUN: "Intra SECMUN",
    INTER_SECMUN: "Inter SECMUN",
    WORKSHOP: "Workshop",
    EDBLAZON_TIMES: "EdBlazon Times",
  }
  return names[type]
}

export function RegisterForm({ eventType, eventId }: { eventType: EventType; eventId?: string }) {
  const router = useRouter()

  // Form state
  const [interestType, setInterestType] = useState<InterestType>("DELEGATE")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")

  // UI state
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})
  const [touched, setTouched] = useState({
    fullName: false,
    email: false,
    phone: false,
  })

  // Client-side validation
  function validateForm(): boolean {
    const errors: ValidationErrors = {}

    // Full name validation
    if (!fullName.trim()) {
      errors.fullName = "Full name is required"
    } else if (fullName.trim().length < 2) {
      errors.fullName = "Full name must be at least 2 characters"
    } else if (fullName.trim().length > 100) {
      errors.fullName = "Full name must be less than 100 characters"
    }

    // Email validation
    if (!email.trim()) {
      errors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = "Please enter a valid email address"
    }

    // Phone validation
    if (!phone.trim()) {
      errors.phone = "Phone number is required"
    } else {
      const phoneDigitsOnly = phone.replace(/\D/g, "")
      if (phoneDigitsOnly.length < 10) {
        errors.phone = "Phone must be at least 10 digits"
      } else if (phoneDigitsOnly.length > 15) {
        errors.phone = "Phone number is too long"
      }
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Handle field blur to show validation
  function handleBlur(field: keyof typeof touched) {
    setTouched((prev) => ({ ...prev, [field]: true }))
    validateForm()
  }

  // Handle field change with real-time validation
  function handleFieldChange(field: string, value: string) {
    if (field === "fullName") {
      setFullName(value)
      if (touched.fullName) {
        const newErrors = { ...validationErrors }
        if (!value.trim()) {
          newErrors.fullName = "Full name is required"
        } else if (value.trim().length < 2) {
          newErrors.fullName = "Full name must be at least 2 characters"
        } else {
          delete newErrors.fullName
        }
        setValidationErrors(newErrors)
      }
    } else if (field === "email") {
      setEmail(value)
      if (touched.email) {
        const newErrors = { ...validationErrors }
        if (!value.trim()) {
          newErrors.email = "Email is required"
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          newErrors.email = "Please enter a valid email address"
        } else {
          delete newErrors.email
        }
        setValidationErrors(newErrors)
      }
    } else if (field === "phone") {
      setPhone(value)
      if (touched.phone) {
        const newErrors = { ...validationErrors }
        const phoneDigitsOnly = value.replace(/\D/g, "")
        if (!value.trim()) {
          newErrors.phone = "Phone number is required"
        } else if (phoneDigitsOnly.length < 10) {
          newErrors.phone = "Phone must be at least 10 digits"
        } else if (phoneDigitsOnly.length > 15) {
          newErrors.phone = "Phone number is too long"
        } else {
          delete newErrors.phone
        }
        setValidationErrors(newErrors)
      }
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    // Clear previous errors
    setValidationErrors({})

    // Validate all fields
    if (!validateForm()) {
      return
    }

    setLoading(true)

  try {
      const payload = {
        eventType,
        eventId: eventId ?? null,
        interestType,
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        whatsAppNumber: phone.trim(),
      }

      console.log("📤 Sending registration payload:", payload)

      const res = await fetch("/api/registrations/interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = (await res.json()) as APIErrorResponse & {
        success?: boolean
        id?: string
        message?: string
      }

      if (!res.ok) {
        console.error("❌ API Error:", { status: res.status, data })

        // Handle specific error codes
        if (data.code === "ALREADY_REGISTERED") {
          setValidationErrors({
            general:
              "You have already registered for this event. If you need to update your information, please contact us.",
          })
        } else if (data.code === "EVENT_NOT_FOUND") {
          setValidationErrors({
            general:
              "Event not found or registrations are currently closed. Please try again later.",
          })
        } else if (data.code === "INVALID_EMAIL") {
          setValidationErrors({ email: data.error || "Invalid email format" })
        } else if (data.code === "INVALID_PHONE") {
          setValidationErrors({ phone: data.error || "Invalid phone number" })
        } else {
          setValidationErrors({
            general: data.error || `Request failed with status ${res.status}`,
          })
        }

        return
      }

      // Success
      if (data.success) {
        console.log("✅ Registration successful:", data.id)
        setSubmitted(true)
      } else {
        setValidationErrors({
          general: "Unexpected response from server. Please try again.",
        })
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Network error occurred"
      console.error("❌ Submit error:", err)
      setValidationErrors({
        general: `Error: ${errorMessage}. Please check your connection and try again.`,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white px-4 py-8">
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
            <h1 className="text-2xl font-semibold text-gray-900">
              Register for {eventTypeToName(eventType)}
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Submit your interest. Delegate Affairs will contact you shortly.
            </p>

            {/* General error message display */}
            {validationErrors.general && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 flex items-start gap-3 rounded-lg bg-red-50 p-4 border border-red-200"
              >
                <AlertCircle className="h-5 w-5 mt-0.5 text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-700">{validationErrors.general}</p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              {/* Interest type */}
              <div>
                <p className="mb-3 text-sm font-semibold text-gray-900">
                  Registering as
                </p>
                <RadioGroup
                  value={interestType}
                  onValueChange={(v) => setInterestType(v as InterestType)}
                  className="flex gap-6"
                >
                  <label className="flex items-center gap-2 text-sm cursor-pointer hover:text-blue-600 transition-colors">
                    <RadioGroupItem value="DELEGATE" id="delegate-radio" />
                    <span>Delegate</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer hover:text-blue-600 transition-colors">
                    <RadioGroupItem value="CAMPUS_AMBASSADOR" id="ambassador-radio" />
                    <span>Campus Ambassador</span>
                  </label>
                </RadioGroup>
              </div>

              {/* Form inputs */}
              <div className="space-y-4">
                {/* Full name input */}
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-900 mb-2">
                    Full Name
                  </label>
                  <Input
                    id="fullName"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => handleFieldChange("fullName", e.target.value)}
                    onBlur={() => handleBlur("fullName")}
                    className={`${
                      touched.fullName && validationErrors.fullName
                        ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                        : "border-gray-300"
                    } transition-colors`}
                    disabled={loading}
                  />
                  {touched.fullName && validationErrors.fullName && (
                    <motion.p
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-1 text-xs text-red-600 flex items-center gap-1"
                    >
                      <AlertCircle className="h-3 w-3" />
                      {validationErrors.fullName}
                    </motion.p>
                  )}
                </div>

                {/* Email input */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => handleFieldChange("email", e.target.value)}
                    onBlur={() => handleBlur("email")}
                    className={`${
                      touched.email && validationErrors.email
                        ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                        : "border-gray-300"
                    } transition-colors`}
                    disabled={loading}
                  />
                  {touched.email && validationErrors.email && (
                    <motion.p
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-1 text-xs text-red-600 flex items-center gap-1"
                    >
                      <AlertCircle className="h-3 w-3" />
                      {validationErrors.email}
                    </motion.p>
                  )}
                </div>

                {/* Phone input */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-900 mb-2">
                    WhatsApp Number
                  </label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={phone}
                    onChange={(e) => handleFieldChange("phone", e.target.value)}
                    onBlur={() => handleBlur("phone")}
                    className={`${
                      touched.phone && validationErrors.phone
                        ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                        : "border-gray-300"
                    } transition-colors`}
                    disabled={loading}
                  />
                  {touched.phone && validationErrors.phone && (
                    <motion.p
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                                           className="mt-1 text-xs text-red-600 flex items-center gap-1"
                    >
                      <AlertCircle className="h-3 w-3" />
                      {validationErrors.phone}
                    </motion.p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    We'll use this for event updates and communication
                  </p>
                </div>
              </div>

              {/* Submit button */}
              <Button
                type="submit"
                disabled={loading || !fullName.trim() || !email.trim() || !phone.trim()}
                className="w-full rounded-full h-11 font-medium transition-all duration-200 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Interest"
                )}
              </Button>

              {/* Additional info */}
              <p className="text-xs text-gray-500 text-center mt-4">
                By submitting, you agree to our terms and will receive updates via email and WhatsApp.
              </p>
            </form>
          </>
        ) : (
          // Success state
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col items-center justify-center py-12"
          >
            {/* Success icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 animate-pulse bg-green-400/20 rounded-full blur-2xl" />
                <CheckCircle className="h-16 w-16 text-green-600 relative" />
              </div>
            </motion.div>

            {/* Success message */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 text-center"
            >
              <h2 className="text-2xl font-semibold text-gray-900">
                Interest Submitted!
              </h2>
              <p className="mt-2 text-gray-600 text-sm leading-relaxed">
                Thank you for registering your interest in{" "}
                <span className="font-semibold">{eventTypeToName(eventType)}</span>. We'll review your
                application and contact you within <span className="font-semibold">48 hours</span> via
                email and WhatsApp.
              </p>
            </motion.div>

            {/* Success details */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-6 w-full rounded-lg bg-green-50 p-4 border border-green-200"
            >
              <h3 className="text-sm font-semibold text-green-900 mb-2">
                What happens next?
              </h3>
              <ul className="space-y-2 text-sm text-green-800">
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 h-5 w-5 flex items-center justify-center bg-green-600 text-white rounded-full text-xs font-bold">
                    1
                  </span>
                  <span>We'll review your application</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 h-5 w-5 flex items-center justify-center bg-green-600 text-white rounded-full text-xs font-bold">
                    2
                  </span>
                  <span>You'll receive an allotment confirmation via email</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 h-5 w-5 flex items-center justify-center bg-green-600 text-white rounded-full text-xs font-bold">
                    3
                  </span>
                  <span>Complete your registration and join us!</span>
                </li>
              </ul>
            </motion.div>

            {/* Support info */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-6 text-center text-xs text-gray-500"
            >
              <p>
                Have questions? Contact us at{" "}
                <a
                  href="mailto:support@secmun.org"
                  className="text-blue-600 hover:underline font-medium"
                >
                  support@secmun.org
                </a>
              </p>
            </motion.div>

            {/* Action buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-8 flex gap-3 w-full"
            >
              <Button
                variant="outline"
                className="flex-1 rounded-full"
                onClick={() => window.location.href = "/"}
              >
                Back to Home
              </Button>
              <Button
                className="flex-1 rounded-full"
                onClick={() => router.push("/events")}
              >
                View Events
              </Button>
            </motion.div>

            {/* Footer note */}
            <p className="mt-6 text-xs text-gray-400 text-center">
              Registration ID saved to your browser
            </p>
          </motion.div>
        )}
      </motion.div>
    </main>
  )
}

