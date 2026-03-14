"use client"

import { useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { FlipWords } from "@/components/ui/flip-words"
import Image from "next/image"
import Link from "next/link"
import { Cpu, Wifi, FileSpreadsheet } from "lucide-react"
import gsap from "gsap"
import ScrollTrigger from "gsap/dist/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

const FLIP_WORDS = ["smoother", "smarter", "faster", "easier"]

// Noise pattern constant to avoid parsing issues with complex data URIs in template literals
const NOISE_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`

export function CinematicHero() {
  const router = useRouter()
  const { user, loading } = useAuth()

  const sectionRef = useRef<HTMLElement>(null)
  const badgeRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const flipRef = useRef<HTMLSpanElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const bulletsRef = useRef<HTMLDivElement>(null)
  const scrollIndRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } })

      // 1. Badge
      tl.fromTo(
        badgeRef.current,
        { opacity: 0, y: 20, filter: "blur(8px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.6 },
        0.3
      )

      // 2. Heading block
      tl.fromTo(
        headingRef.current,
        { opacity: 0, y: 50, filter: "blur(8px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.9 },
        0.5
      )

      // 3. FlipWords pop
      tl.fromTo(
        flipRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.7)" },
        1.0
      )

      // 4. Subtitle
      tl.fromTo(
        subRef.current,
        { opacity: 0, y: 30, filter: "blur(6px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.7 },
        1.1
      )

      // 5. CTA buttons with elastic bounce
      tl.fromTo(
        ".cinematic-cta-btn",
        { opacity: 0, y: 40, scale: 0.85 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          stagger: 0.15,
          ease: "elastic.out(1, 0.4)",
        },
        1.3
      )

      // 6. Feature bullets
      tl.fromTo(
        ".cinematic-bullet",
        { opacity: 0, x: -15 },
        { opacity: 1, x: 0, duration: 0.5, stagger: 0.08 },
        1.5
      )

      // 7. Scroll indicator
      tl.fromTo(
        scrollIndRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5 },
        1.8
      )

      // Scroll-driven: fade out hero (DELAYED — starts at 40% scroll)
      gsap.to(sectionRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "40% top",
          end: "bottom top",
          scrub: 1,
        },
        opacity: 0,
        y: -60,
        scale: 0.98,
        filter: "blur(8px)",
      })

      // CLUB LOGO: 3-phase Tesseract-style behavior
      // Phase 1: Reveal boldly as hero blurs
      // Phase 2: Minimize to bottom-right corner
      // Phase 3: Stay as floating widget

      // Responsive: smaller widget position on mobile
      const isMobile = window.innerWidth < 768
      const widgetSize = isMobile ? "56px" : "100px"
      const widgetBottom = isMobile ? "1rem" : "2rem"
      const widgetRight = isMobile ? "1rem" : "2rem"

      const logoTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "30% top",
          end: "200% top",
          scrub: 1,
        },
      })

      // Phase 1: Logo appears center stage
      logoTl.fromTo(
        logoRef.current,
        { opacity: 0.06, scale: 1, filter: "grayscale(1)" },
        { opacity: 0.45, scale: 1.1, filter: "grayscale(0)", duration: 0.3 }
      )

      // Phase 2: Logo shrinks and flies to bottom-right corner using transforms
      // We start from center (0,0 with standard translation) and move to viewport bottom right
      logoTl.to(logoRef.current, {
        x: () => window.innerWidth / 2 - (isMobile ? 28 : 50) - (isMobile ? 16 : 32),
        y: () => window.innerHeight / 2 - (isMobile ? 28 : 50) - (isMobile ? 16 : 32),
        scale: isMobile ? 0.2 : 0.2, // Match the target size (e.g. 56px / 280px = 0.2)
        opacity: 0.85,
        filter: "grayscale(0) drop-shadow(0 4px 24px rgba(59,130,246,0.35))",
        duration: 0.6,
        ease: "power3.inOut",
      })

      // Phase 3: Hold as widget
      logoTl.to(logoRef.current, {
        opacity: 0.85,
        duration: 0.5,
      })

      // Marquee
      gsap.to(".cinematic-marquee-track", {
        xPercent: -50,
        ease: "none",
        duration: 30,
        repeat: -1,
      })
    })

    return () => ctx.revert()
  }, [])

  const handlePrimaryClick = () => {
    if (loading) return
    router.push(user ? "/dashboard" : "/login")
  }

  return (
    <>
      {/* Club logo — FIXED on screen, becomes floating widget */}
      <div
        ref={logoRef}
        className="fixed flex items-center justify-center pointer-events-none z-30"
        style={{
          opacity: 0.06,
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        {/* Responsive: smaller on mobile */}
        <div className="relative w-[280px] h-[280px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px]">
          <Image
            src="/logo/club-logo.png"
            alt=""
            fill
            className="object-contain"
            sizes="(max-width: 640px) 280px, (max-width: 768px) 400px, 500px"
            priority
          />
        </div>
      </div>

      <section
        ref={sectionRef}
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-white px-6 py-20"
      >
        {/* ---- BACKGROUND LAYERS ---- */}

        {/* Radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.08)_0%,transparent_60%)] pointer-events-none" />

        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, #94a3b8 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Noise overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay"
          style={{
            backgroundImage: NOISE_SVG,
          }}
        />

        {/* ---- CONTENT ---- */}
        <div className="relative z-10 text-center max-w-5xl mx-auto flex flex-col items-center gap-8">
          {/* Badge */}
          <div
            ref={badgeRef}
            className="inline-flex items-center gap-2.5 rounded-full border border-slate-200 bg-white/80 backdrop-blur-lg px-5 py-2 text-xs font-semibold text-slate-500 tracking-widest uppercase shadow-sm"
            style={{ opacity: 0 }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            Secretariat OS · SECMUN · 2025–26
          </div>

          {/* Heading */}
          <div ref={headingRef} style={{ opacity: 0 }}>
            <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl leading-[1.1] text-slate-900">
              Run{" "}
              <span className="bg-gradient-to-r from-blue-600 via-sky-500 to-blue-600 bg-clip-text text-transparent">
                SECMUN
              </span>{" "}
              <span
                ref={flipRef}
                className="relative inline-block whitespace-nowrap"
                style={{ opacity: 0 }}
              >
                <span className="absolute inset-x-0 bottom-2 h-[30%] rounded-full bg-blue-500/20 blur-md -rotate-1" />
                <FlipWords
                  words={FLIP_WORDS}
                  className="relative inline-block text-primary italic"
                />
              </span>{" "}
              from one workspace.
            </h1>
          </div>

          {/* Subtitle */}
          <p
            ref={subRef}
            className="max-w-lg text-lg text-muted-foreground/90 leading-relaxed sm:text-xl"
            style={{ opacity: 0 }}
          >
            s3cNS is the refined operating system for St. Edmund&apos;s MUN
            Secretariat: unifying conferences, finances, and archives into a
            single, high-performance workspace.
          </p>

          {/* CTA Buttons */}
          <div ref={ctaRef} className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={handlePrimaryClick}
              disabled={loading}
              className="cinematic-cta-btn group relative h-14 px-10 rounded-full bg-slate-900 text-white font-semibold text-base shadow-xl shadow-slate-900/20 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20 hover:bg-slate-800 active:scale-[0.97] overflow-hidden"
              style={{ opacity: 0 }}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700 ease-in-out" />
              <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-[inset_0_0_20px_rgba(59,130,246,0.3)]" />
              <span className="relative z-10">
                {loading
                  ? "Checking session\u2026"
                  : user
                    ? "Enter Secretariat Workspace"
                    : "Sign in to Secretariat Workspace"}
              </span>
            </button>

            <Link
              href="https://sec.edu.in"
              target="_blank"
              className="cinematic-cta-btn group h-14 px-10 rounded-full border border-slate-200 text-slate-600 font-semibold text-base flex items-center justify-center transition-all duration-300 hover:border-slate-400 hover:bg-slate-50 hover:text-slate-900 active:scale-[0.97] overflow-hidden relative"
              style={{ opacity: 0 }}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-200/50 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700 ease-in-out" />
              <span className="relative z-10">
                Visit St. Edmund&apos;s College Website
              </span>
            </Link>
          </div>

          {/* Feature Bullets */}
          <div
            ref={bulletsRef}
            className="flex flex-wrap items-center gap-x-8 gap-y-3 text-[11px] uppercase tracking-widest text-muted-foreground/60 font-bold pt-6 border-t border-slate-100 mt-2"
          >
            <div className="cinematic-bullet flex items-center gap-2 group cursor-default" style={{ opacity: 0 }}>
              <Cpu className="w-4 h-4 text-cyan-500/50 group-hover:text-cyan-400 transition-colors" />
              <span className="group-hover:text-muted-foreground transition-colors">OS Integration</span>
            </div>
            <div className="cinematic-bullet flex items-center gap-2 group cursor-default" style={{ opacity: 0 }}>
              <Wifi className="w-4 h-4 text-cyan-500/50 group-hover:text-cyan-400 transition-colors" />
              <span className="group-hover:text-muted-foreground transition-colors">Campus Optimized</span>
            </div>
            <div className="cinematic-bullet flex items-center gap-2 group cursor-default" style={{ opacity: 0 }}>
              <FileSpreadsheet className="w-4 h-4 text-cyan-500/50 group-hover:text-cyan-400 transition-colors" />
              <span className="group-hover:text-muted-foreground transition-colors">Zero Fragmentation</span>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div
          ref={scrollIndRef}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ opacity: 0 }}
        >
          <span className="text-[10px] tracking-[0.3em] uppercase text-slate-400 font-bold">
            Scroll
          </span>
          <div className="w-5 h-8 rounded-full border-2 border-slate-300 flex items-start justify-center p-1">
            <div className="w-1 h-2 rounded-full bg-slate-400 animate-bounce" />
          </div>
        </div>
      </section>

      {/* ===== VELOCITY MARQUEE BRIDGE ===== */}
      <div className="w-full py-6 bg-slate-900 overflow-hidden relative select-none">
        <div className="cinematic-marquee-track flex gap-16 whitespace-nowrap text-sm font-bold tracking-[0.15em] uppercase text-slate-400">
          {[0, 1].map((i) => (
            <div key={i} className="flex gap-16 shrink-0">
              <span>SECMUN 2025–26</span>
              <span className="text-blue-500">•</span>
              <span>Conferences</span>
              <span className="text-blue-500">•</span>
              <span>Finance</span>
              <span className="text-blue-500">•</span>
              <span>Archives</span>
              <span className="text-blue-500">•</span>
              <span>Gazette</span>
              <span className="text-blue-500">•</span>
              <span>Logistics</span>
              <span className="text-blue-500">•</span>
              <span>Unified Workspace</span>
              <span className="text-blue-500">•</span>
              <span>St. Edmund&apos;s College</span>
              <span className="text-blue-500">•</span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
