// app/(landing)/_components/Footer.tsx
"use client"

import Link from "next/link"
import {
  Mail,
  MapPin,
  Phone,
  Instagram,
  Linkedin,
  Twitter,
} from "lucide-react"
import { cn } from "@/lib/utils"

export function Footer({ className }: { className?: string }) {
  const year = new Date().getFullYear()

  return (
    <footer
      className={cn(
        "w-full border-t border-slate-200 bg-slate-950 text-slate-200",
        className,
      )}
    >
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        {/* top: logo + columns */}
        <div className="grid gap-10 md:grid-cols-4">
          {/* brand */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2">
              <img src="/logo/s3cnsLogo.svg" alt="s3cNS" className="h-10 w-10" />
              <span className="text-lg font-semibold tracking-tight">s3cNS</span>
            </Link>
            <p className="text-sm text-slate-400">
              The operating system for St. Edmund&apos;s MUN Secretariat:
              finance, communication, archives, and on‑ground execution in one
              workspace.
            </p>
          </div>

          {/* product */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-slate-100 uppercase tracking-[0.16em]">
              Product
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="#features" className="hover:text-slate-100">
                  Features overview
                </Link>
              </li>
              <li>
                <Link href="#finance" className="hover:text-slate-100">
                  Finance workspace
                </Link>
              </li>
              <li>
                <Link href="#communication" className="hover:text-slate-100">
                  Comms automations
                </Link>
              </li>
              <li>
                <Link href="#archives" className="hover:text-slate-100">
                  Archives &amp; inventory
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-slate-100">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* organisation */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-slate-100 uppercase tracking-[0.16em]">
              For Secretariat
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="#use-cases" className="hover:text-slate-100">
                  Conference control room
                </Link>
              </li>
              <li>
                <Link href="#use-cases" className="hover:text-slate-100">
                  Society finances
                </Link>
              </li>
              <li>
                <Link href="#use-cases" className="hover:text-slate-100">
                  Alumni handover
                </Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-slate-100">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* contact + newsletter */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-slate-100 uppercase tracking-[0.16em]">
              Contact
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-start gap-2">
                <Mail className="mt-[2px] h-4 w-4 text-sky-400" />
                <a
                  href="mailto:sidhusamsk@gmail.com"
                  className="hover:text-slate-100"
                >
                  sidhusamsk@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="mt-[2px] h-4 w-4 text-sky-400" />
                <span>Core Secretariat contact (shared)</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-[2px] h-4 w-4 text-sky-400" />
                <a
                  href="https://www.google.com/maps/place/St.+Edmund's+College,+Shillong/@25.5675881,91.8943209,17z/data=!3m1!4b1!4m6!3m5!1s0x37507ea4cc6bcba9:0x2a59aebd4a4ac759!8m2!3d25.5675833!4d91.8968958!16zL20vMGR0cHl3"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-slate-100"
                >
                  St. Edmund&apos;s College, Shillong
                </a>
              </li>
            </ul>

            <div className="space-y-2">
              <p className="text-xs font-medium text-slate-300">
                Get early access updates
              </p>
              <form
                onSubmit={(e) => e.preventDefault()}
                className="flex gap-2"
              >
                <input
                  type="email"
                  placeholder="college email"
                  className="h-9 w-full rounded-md border border-slate-600 bg-slate-900 px-3 text-xs text-slate-100 placeholder:text-slate-500 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
                />
                <button
                  type="submit"
                  className="inline-flex h-9 items-center rounded-md bg-sky-500 px-3 text-xs font-semibold text-slate-950 hover:bg-sky-400"
                >
                  Join
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* divider */}
        <div className="mt-10 border-t border-slate-800/80 pt-6 text-xs text-slate-500">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="order-2 md:order-1">© {year} Sam.</p>
            <div className="order-1 flex items-center gap-4 md:order-2">
              <Link href="/privacy" className="hover:text-slate-200">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-slate-200">
                Terms
              </Link>
              <div className="ml-2 flex items-center gap-3 text-slate-400">
                <a
                  href="https://instagram.com/secmun2024"
                  aria-label="Instagram"
                  className="hover:text-slate-100"
                >
                  <Instagram className="h-4 w-4" />
                </a>
                {/* <a
                  href="https://twitter.com"
                  aria-label="Twitter"
                  className="hover:text-slate-100"
                >
                  <Twitter className="h-4 w-4" />
                </a> */}
                {/* <a
                  href="https://linkedin.com"
                  aria-label="LinkedIn"
                  className="hover:text-slate-100"
                >
                  <Linkedin className="h-4 w-4" />
                </a> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
