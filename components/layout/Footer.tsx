// app/(landing)/_components/Footer.tsx
"use client"

import Link from "next/link"
import {
  Mail,
  MapPin,
  Instagram,
  Code,
} from "lucide-react"
import { Montserrat } from "next/font/google"
import { cn } from "@/lib/utils"

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["900"],
})

export function Footer({ className }: { className?: string }) {
  const year = new Date().getFullYear()

  return (
    <footer
      className={cn(
        "w-full bg-[#020617] border-t border-slate-900 relative overflow-hidden text-slate-100 print:hidden",
        className,
      )}
    >
      {/* 3-Color Gradient Background Layer */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(56,189,248,0.15),transparent_50%),radial-gradient(circle_at_100%_100%,rgba(255,255,255,0.05),transparent_40%)] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-900/20 via-sky-400/5 to-transparent pointer-events-none" />

      {/* Ghost Background Text */}
      <div className="absolute top-0 left-0 right-0 flex justify-center opacity-[0.08] select-none pointer-events-none pt-4">
        <span className={cn(
          "text-[20vw] font-black tracking-tighter leading-none text-white/20 italic",
          montserrat.className
        )}>
          S3CNS
        </span>
      </div>

      {/* Background Gradient Accents for Depth */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-sky-400/20 via-blue-900/10 to-transparent pointer-events-none -mr-48 -mt-48 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-white/10 via-sky-400/5 to-transparent pointer-events-none -ml-32 -mb-32 blur-3xl opacity-60" />

      <div className="relative mx-auto max-w-7xl px-6 py-20 md:py-28">
        {/* Branding & Socials Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-1 w-8 bg-sky-400 rounded-full shadow-[0_0_15px_rgba(56,189,248,0.6)]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-sky-400">
                The Standard for MUN Governance
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-[1.05]">
              Intelligence <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-white">in motion.</span> <br />
              Digital MUN Excellence.
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl font-medium leading-relaxed">
              Designed to optimize secretariat workflows, financial tracking, and
              strategic communication in a single, high-performance control loop.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://instagram.com/secmun2024"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="group relative flex h-12 w-12 items-center justify-center rounded-full border border-slate-800 bg-[#0f172a]/50 backdrop-blur-sm transition-all hover:bg-slate-800 hover:border-sky-400 hover:shadow-xl hover:shadow-sky-400/20"
            >
              <Instagram className="h-5 w-5 text-slate-400 transition-colors group-hover:text-sky-400" />
            </a>
            <a
              href="#"
              className="group relative flex h-12 w-12 items-center justify-center rounded-full border border-slate-800 bg-[#0f172a]/50 backdrop-blur-sm transition-all hover:bg-slate-800 hover:border-sky-400 hover:shadow-xl hover:shadow-sky-400/20"
            >
              <Mail className="h-5 w-5 text-slate-400 transition-colors group-hover:text-sky-400" />
            </a>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4 pt-16 border-t border-slate-800/50">
          {/* Logo Column */}
          <div className="space-y-6">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute -inset-3 bg-sky-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap" />
                <img src="/logo/s3cnsLogo.svg" alt="s3cNS" className="h-14 w-14 relative brightness-110 drop-shadow-[0_0_10px_rgba(56,189,248,0.3)]" />
              </div>
              <span className="text-3xl font-black tracking-[0.4em] uppercase text-white">
                s3cns
              </span>
            </Link>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-200">© {year} s3cNS Inc.</p>
              <p className="text-sm text-slate-400 leading-relaxed">
                The operating digital system for <br />
                St. Edmund&apos;s College Model United Nations Secretariat.
              </p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] pt-4">
                Designed & Engineered by Sam
              </p>
            </div>
          </div>

          {/* Product */}
          <div className="space-y-6">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white">
              Product
            </h4>
            <ul className="space-y-4 text-[13px] font-semibold text-slate-400">
              <li>
                <Link href="/" className="transition-colors hover:text-sky-400">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/archives" className="transition-colors hover:text-sky-400">
                  Archives & Inventory
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="transition-colors hover:text-sky-400">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Secretariat */}
          <div className="space-y-6">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white">
              Secretariat
            </h4>
            <ul className="space-y-4 text-[13px] font-semibold text-slate-400">
              <li>
                <Link href="/" className="transition-colors hover:text-sky-400">
                  Control Room
                </Link>
              </li>
              <li>
                <Link href="/use-cases" className="transition-colors hover:text-sky-400">
                  Alumni Handover
                </Link>
              </li>
              <li>
                <Link href="/help" className="transition-colors hover:text-sky-400">
                  Support Desk
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white">
              Contact
            </h4>
            <ul className="space-y-4 text-[13px] font-semibold text-slate-400">
              <li className="flex items-center gap-2 group cursor-pointer">
                <Code className="h-4 w-4 transition-colors group-hover:text-sky-400" />
                <a href="/developer" className="transition-colors hover:text-sky-400">
                  Developer
                </a>
              </li>
              <li className="flex items-center gap-2 group cursor-pointer">
                <Mail className="h-4 w-4 transition-colors group-hover:text-sky-400" />
                <a href="mailto:sidhusamsk@gmail.com" className="transition-colors hover:text-sky-400">
                  Email Support
                </a>
              </li>
              <li className="flex items-start gap-2 group cursor-pointer">
                <MapPin className="h-4 w-4 mt-0.5 transition-colors group-hover:text-sky-400" />
                <span className="transition-colors group-hover:text-sky-400 leading-tight">
                  St. Edmund&apos;s College, <br /> Shillong, India
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-20 border-t border-slate-800/50 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm text-slate-500 font-medium">
            © {year} s3cNS Secretariat systems. All rights reserved.
          </p>

          <div className="flex items-center gap-8">
            <Link href="/privacy" className="text-sm font-semibold text-slate-400 transition-colors hover:text-sky-400">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm font-semibold text-slate-400 transition-colors hover:text-sky-400">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
