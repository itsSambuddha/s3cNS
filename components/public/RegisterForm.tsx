// components/public/RegisterForm.tsx

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { AlertCircle, CheckCircle, Loader2, User, Mail, Phone, ArrowRight } from "lucide-react"
import clsx from "clsx"

type EventType = "INTRA_SECMUN" | "INTER_SECMUN" | "WORKSHOP" | "EDBLAZON_TIMES"
type InterestType = "DELEGATE" | "CAMPUS_AMBASSADOR" | "JOURNALIST" | "VIDEO_JOURNALIST" | "PARTICIPANT"

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
  const [interestType, setInterestType] = useState<InterestType>(() => {
    if (eventType === "EDBLAZON_TIMES") return "JOURNALIST"
    if (eventType === "WORKSHOP") return "PARTICIPANT"
    return "DELEGATE"
  })
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
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-8">
      {/* ===== Animated gradient background ===== */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>
      <div className="pointer-events-none absolute inset-0 -z-10">
        <motion.div
          className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-primary/20 blur-[100px]"
          animate={{
            x: [0, 50, -50, 0],
            y: [0, -30, 30, 0],
            scale: [1, 1.1, 0.9, 1]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-purple-500/10 blur-[80px]"
          animate={{
            x: [0, -40, 40, 0],
            y: [0, 40, -40, 0],
            scale: [1, 0.9, 1.1, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* ===== Form card ===== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative w-full max-w-lg glass-card rounded-3xl p-8 sm:p-10"
      >
        {!submitted ? (
          <>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center mb-8"
            >
              <h1 className="text-3xl font-bold font-heading bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Register Interest
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Join us for <span className="font-semibold text-foreground">{eventTypeToName(eventType)}</span>
              </p>
            </motion.div>

            {/* General error message display */}
            {validationErrors.general && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mb-6 flex items-start gap-3 rounded-xl bg-destructive/10 p-4 border border-destructive/20"
              >
                <AlertCircle className="h-5 w-5 mt-0.5 text-destructive flex-shrink-0" />
                <p className="text-sm text-destructive font-medium">{validationErrors.general}</p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Interest type */}
              <div className="space-y-3">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
                  I am registering as a
                </label>
                <RadioGroup
                  value={interestType}
                  onValueChange={(v) => setInterestType(v as InterestType)}
                  className="grid grid-cols-1 gap-2 sm:grid-cols-2"
                >
                  {/* Helper for rendering card radios */}
                  {((eventType === "EDBLAZON_TIMES" ? ["JOURNALIST", "VIDEO_JOURNALIST"] :
                    eventType === "WORKSHOP" ? ["PARTICIPANT"] :
                      ["DELEGATE", "CAMPUS_AMBASSADOR"]) as InterestType[]).map((type) => (
                        <label
                          key={type}
                          className={clsx(
                            "relative flex cursor-pointer flex-col rounded-xl border p-4 transition-all hover:bg-muted/50",
                            interestType === type
                              ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary/20"
                              : "border-border/50 bg-background/50 hover:border-primary/50"
                          )}
                        >
                          <RadioGroupItem value={type} id={type} className="sr-only" />
                          <span className="text-sm font-medium font-heading">
                            {type.replace("_", " ")}
                          </span>
                          {interestType === type && (
                            <motion.div
                              layoutId="active-check"
                              className="absolute right-3 top-3 text-primary"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </motion.div>
                          )}
                        </label>
                      ))}
                </RadioGroup>
              </div>

              {/* Form inputs */}
              <div className="space-y-4">
                <div className="relative group">
                  <div className="absolute left-3 top-3 text-muted-foreground/50 group-focus-within:text-primary transition-colors">
                    <User className="h-5 w-5" />
                  </div>
                  <Input
                    id="fullName"
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => handleFieldChange("fullName", e.target.value)}
                    onBlur={() => handleBlur("fullName")}
                    className={clsx(
                      "pl-10 h-11 bg-background/50 border-input/50 focus:bg-background transition-all",
                      touched.fullName && validationErrors.fullName && "border-destructive focus:ring-destructive/30"
                    )}
                    disabled={loading}
                  />
                  {touched.fullName && validationErrors.fullName && (
                    <p className="mt-1 text-xs text-destructive font-medium ml-1">
                      {validationErrors.fullName}
                    </p>
                  )}
                </div>

                <div className="relative group">
                  <div className="absolute left-3 top-3 text-muted-foreground/50 group-focus-within:text-primary transition-colors">
                    <Mail className="h-5 w-5" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => handleFieldChange("email", e.target.value)}
                    onBlur={() => handleBlur("email")}
                    className={clsx(
                      "pl-10 h-11 bg-background/50 border-input/50 focus:bg-background transition-all",
                      touched.email && validationErrors.email && "border-destructive focus:ring-destructive/30"
                    )}
                    disabled={loading}
                  />
                  {touched.email && validationErrors.email && (
                    <p className="mt-1 text-xs text-destructive font-medium ml-1">
                      {validationErrors.email}
                    </p>
                  )}
                </div>

                <div className="relative group">
                  <div className="absolute left-3 top-3 text-muted-foreground/50 group-focus-within:text-primary transition-colors">
                    <Phone className="h-5 w-5" />
                  </div>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="WhatsApp Number"
                    value={phone}
                    onChange={(e) => handleFieldChange("phone", e.target.value)}
                    onBlur={() => handleBlur("phone")}
                    className={clsx(
                      "pl-10 h-11 bg-background/50 border-input/50 focus:bg-background transition-all",
                      touched.phone && validationErrors.phone && "border-destructive focus:ring-destructive/30"
                    )}
                    disabled={loading}
                  />
                  {touched.phone && validationErrors.phone && (
                    <p className="mt-1 text-xs text-destructive font-medium ml-1">
                      {validationErrors.phone}
                    </p>
                  )}
                </div>
              </div>

              {/* Submit button */}
              <Button
                type="submit"
                disabled={loading || !fullName.trim() || !email.trim() || !phone.trim()}
                className="w-full h-12 rounded-xl text-base font-medium shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 hover:scale-[1.02]"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    Submit Interest
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>

              <p className="text-[10px] text-muted-foreground text-center">
                By submitting, you agree to receive updates via email and WhatsApp.
              </p>
            </form>
          </>
        ) : (
          // Success state
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col items-center justify-center py-6"
          >
            {/* Success icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="relative mb-6"
            >
              <div className="absolute inset-0 animate-pulse bg-emerald-500/30 rounded-full blur-xl" />
              <div className="relative h-20 w-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
              </div>
            </motion.div>

            {/* Success message */}
            <div className="text-center space-y-2 mb-8">
              <h2 className="text-2xl font-bold font-heading">
                Interest Registered!
              </h2>
              <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                We've received your details for {eventTypeToName(eventType)}. Check your inbox for confirmation.
              </p>
            </div>

            {/* Next steps card */}
            <div className="w-full bg-muted/40 rounded-xl p-5 mb-8 border border-border/50">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Next Steps</h3>
              <div className="space-y-4">
                <div className="flex gap-3 text-sm">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">1</div>
                  <p>Application review (approx. 48h)</p>
                </div>
                <div className="flex gap-3 text-sm">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">2</div>
                  <p>Allotment confirmation via email</p>
                </div>
                <div className="flex gap-3 text-sm">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">3</div>
                  <p>Final registration & payment</p>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full rounded-xl h-11"
              onClick={() => window.location.href = "/"}
            >
              Back to Home
            </Button>
          </motion.div>
        )}
      </motion.div>
    </main>
  )
}
