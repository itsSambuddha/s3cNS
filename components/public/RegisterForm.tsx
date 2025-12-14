"use client"

import { useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"

type EventType = "INTRA_SECMUN" | "INTER_SECMUN" | "WORKSHOP" | "EDBLAZON_TIMES"
type FromSec = "INSIDE_SEC" | "OUTSIDE_SEC"
type InstituteType = "COLLEGE" | "SCHOOL"

const schema = z.object({
  eventType: z.enum(["INTRA_SECMUN", "INTER_SECMUN", "WORKSHOP", "EDBLAZON_TIMES"]),
  fullName: z.string().min(2),
  email: z.string().email(),
  whatsAppNumber: z.string().min(8),
  fromSec: z.enum(["INSIDE_SEC", "OUTSIDE_SEC"]),
  pastExperience: z.string().min(1),
  instituteType: z.enum(["COLLEGE", "SCHOOL"]).optional(),
  collegeName: z.string().optional(),
  schoolName: z.string().optional(),
  semester: z.string().optional(),
  class: z.string().optional(),
  idDocumentUrl: z.string().url().optional(),
  insideSemester: z.string().optional(),
  classRollNo: z.string().optional(),
  department: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export function RegisterForm(props: {
  initialEventType: EventType | null
  isRegistrationsOpen: boolean
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [submitted, setSubmitted] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      eventType: props.initialEventType ?? "INTRA_SECMUN",
      fromSec: "INSIDE_SEC",
    } as Partial<FormValues>,
  })

  const fromSec = form.watch("fromSec")
  const eventType = form.watch("eventType")

  async function onSubmit(values: FormValues) {
    setServerError(null)
    const res = await fetch("/api/delegates/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setServerError(data.error ?? "Something went wrong. Please try again.")
      return
    }
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4">
        <div className="max-w-md rounded-2xl border border-border/60 bg-card/80 p-8 text-center backdrop-blur-xl shadow-lg">
          <h1 className="text-2xl font-semibold mb-2">Registration submitted</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Thank you for applying. Delegate Affairs will review your application and contact you via email or WhatsApp.
          </p>
          <Button
            onClick={() => router.push("/")}
            className="rounded-full px-6"
          >
            Back to home
          </Button>
        </div>
      </main>
    )
  }

  const registrationsClosed =
    (eventType === "INTRA_SECMUN" || eventType === "INTER_SECMUN") &&
    !props.isRegistrationsOpen

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-3xl rounded-2xl border border-border/60 bg-card/80 p-6 sm:p-8 backdrop-blur-xl shadow-lg">
        <h1 className="text-2xl font-semibold mb-1">Register for SECMUN</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Fill in your details carefully. You will receive confirmation and allotment details later from Delegate Affairs.
        </p>

        {serverError && (
          <p className="mb-4 text-sm text-destructive">{serverError}</p>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Event type */}
            <FormField
              control={form.control}
              name="eventType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event type</FormLabel>
                  <FormControl>
                    <div className="inline-flex flex-wrap gap-2">
                      {(
                        ["INTRA_SECMUN", "INTER_SECMUN", "WORKSHOP", "EDBLAZON_TIMES"] as EventType[]
                      ).map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => field.onChange(t)}
                          className={cn(
                            "rounded-full border px-3 py-1 text-xs",
                            field.value === t
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-background text-muted-foreground"
                          )}
                        >
                          {t.replace("_", " ")}
                        </button>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {registrationsClosed && (
              <p className="text-sm text-destructive">
                Registrations are currently closed for this category.
              </p>
            )}

            {/* Basic info */}
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="whatsAppNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>WhatsApp number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fromSec"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Are you from SEC or outside?</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex gap-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="INSIDE_SEC" id="inside" />
                          <label htmlFor="inside" className="text-sm">
                            Inside SEC
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="OUTSIDE_SEC" id="outside" />
                          <label htmlFor="outside" className="text-sm">
                            Outside SEC
                          </label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Conditional blocks */}
            {fromSec === "OUTSIDE_SEC" && (
              <>
                <FormField
                  control={form.control}
                  name="instituteType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Institute type</FormLabel>
                      <FormControl>
                        <select
                          className="w-full rounded-md border bg-background px-2 py-2 text-sm"
                          value={field.value ?? ""}
                          onChange={(e) => field.onChange(e.target.value as InstituteType)}
                        >
                          <option value="">Select</option>
                          <option value="COLLEGE">College</option>
                          <option value="SCHOOL">School</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Simple text fields; you can refine validation later */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="collegeName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>College name (if applicable)</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="schoolName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>School name (if applicable)</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="semester"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Semester</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="class"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Class</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </>
            )}

            {fromSec === "INSIDE_SEC" && (
              <div className="grid gap-4 sm:grid-cols-3">
                <FormField
                  control={form.control}
                  name="insideSemester"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Semester</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="classRollNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Class roll no.</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <FormField
              control={form.control}
              name="idDocumentUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID document URL (upload link)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pastExperience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Past experience</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Past MUN / workshop experience with rewards, or write NIL if none."
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="rounded-full px-6"
              disabled={registrationsClosed || form.formState.isSubmitting}
            >
              {registrationsClosed ? "Registrations closed" : "Submit registration"}
            </Button>
          </form>
        </Form>
      </div>
    </main>
  )
}
