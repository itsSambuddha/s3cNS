// app/(root)/page.tsx
'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { signOut } from 'firebase/auth'
import { firebaseAuth } from '@/lib/auth/firebase'
import { LandingNavbar } from '@/components/layout/LandingNavbar'
import dynamic from 'next/dynamic'
import { X, Check } from 'lucide-react'

import { Hero } from '@/components/landing/Hero'
import { PwaInstallButton } from '@/components/ui/PwaInstallButton'

// Lazy load heavy components
const ConstitutionPreview = dynamic(() => import('@/components/landing/constitution-preview').then(mod => mod.ConstitutionPreview), {
  loading: () => <div className="h-96 w-full animate-pulse bg-muted/20" />
})
const SeniorSecretariatCarousel = dynamic(() => import('@/components/secretariat/SeniorSecretariatCarousel').then(mod => mod.SeniorSecretariatCarousel), {
  loading: () => <div className="h-96 w-full animate-pulse bg-muted/20" />
})
const SecmunFeatures = dynamic(() => import('@/components/landing/secmunFeatures').then(mod => mod.SecmunFeatures), {
  loading: () => <div className="h-[800px] w-full animate-pulse bg-muted/20" />
})
const SecmunGlobe = dynamic(() => import('@/components/landing/secmunGlobe').then(mod => mod.SecmunGlobe), {
  ssr: false,
  loading: () => <div className="h-96 w-full animate-pulse bg-muted/20" />
})
const ParticipationSection = dynamic(() => import('@/components/public/ParticipationSection').then(mod => mod.ParticipationSection))

const fadeInUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
}

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
}

export default function LandingPage() {
  const { user, loading } = useAuth()

  const handleLogout = async () => {
    await signOut(firebaseAuth)
    await fetch('/api/auth/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid: '' }),
    })
    window.location.href = '/'
  }

  return (

    <div className="space-y-16 pb-16 sm:space-y-24 sm:pb-24">
      <Hero />

      {/* BEFORE / AFTER SECTION */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.03)_0%,transparent_70%)] pointer-events-none" />

        <ConstitutionPreview />

        <motion.section
          className="relative py-24 sm:py-32"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          <div className="mx-auto max-w-6xl px-6">
            <motion.div variants={fadeInUp} className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
                The evolution of Secretariat operations
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Scaling SECMUN from manual coordination to a high-performance organization.
              </p>
            </motion.div>

            <div className="grid gap-8 md:grid-cols-2">
              <motion.div
                variants={fadeInUp}
                className="group relative overflow-hidden rounded-3xl border border-red-500/10 bg-white dark:bg-zinc-900/50 p-8 shadow-sm transition-all hover:shadow-xl hover:shadow-red-500/5"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <div className="w-24 h-24 rounded-full bg-red-500 blur-3xl" />
                </div>

                <h3 className="text-2xl font-bold text-red-600 dark:text-red-500 mb-4 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-600">
                    <X className="w-6 h-6 stroke-[3px]" />
                  </span>
                  Before s3cNS
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Fragmentation led to lost institutional memory and inefficient horizontal coordination.
                </p>
                <ul className="space-y-4">
                  {[
                    "Isolated spreadsheets for budgets and logistics",
                    "Scattered forms and manual email threads",
                    "No unified record of member performance",
                    "High friction during secretariat handovers"
                  ].map((item, i) => (
                    <li key={i} className="flex gap-3 text-sm text-muted-foreground/80">
                      <span className="text-red-500 mt-1 flex-shrink-0">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                className="group relative overflow-hidden rounded-3xl border border-emerald-500/10 bg-white dark:bg-zinc-900/50 p-8 shadow-sm transition-all hover:shadow-xl hover:shadow-emerald-500/5"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <div className="w-24 h-24 rounded-full bg-emerald-500 blur-3xl" />
                </div>

                <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-500 mb-4 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                    <Check className="w-6 h-6 stroke-[3px]" />
                  </span>
                  After s3cNS
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  A high-integrity system providing a single source of truth for the entire organization.
                </p>
                <ul className="space-y-4">
                  {[
                    "Unified command for events and finance",
                    "Automated approval workflows and reporting",
                    "Scalable archive of secretariat insights",
                    "Mobile-ready interface for on-ground teams"
                  ].map((item, i) => (
                    <li key={i} className="flex gap-3 text-sm text-muted-foreground/80">
                      <span className="text-emerald-500 mt-1 flex-shrink-0">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </motion.section>
      </div>

      {/* LEADERSHIP CAROUSEL */}
      <section className="mt-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mx-auto max-w-5xl"
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        >
          <SeniorSecretariatCarousel />
        </motion.div>
        <div className="mt-12 flex justify-center">
          <Link href="/secretariat">
            <Button variant="outline" size="lg" className="rounded-full px-8 hover:bg-muted/10 transition-colors">
              View Complete Secretariat
            </Button>
          </Link>
        </div>
      </section>

      <ParticipationSection />
      <SecmunFeatures />
      <SecmunGlobe />

      {/* FINAL CTA */}
      <motion.section
        className="mx-auto max-w-6xl px-6 py-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInUp}
      >
        <div className="relative overflow-hidden rounded-[2.5rem] border border-blue-200/60 bg-gradient-to-b from-blue-50/50 via-white to-blue-50/30 p-8 sm:p-12 lg:p-16 text-center shadow-xl shadow-blue-500/5 dark:bg-[#030712] dark:from-transparent dark:to-transparent dark:border-white/5">
          {/* Immersive Background Elements */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-400/10 blur-[100px]" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-emerald-400/10 blur-[100px]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03] dark:opacity-20"
              style={{ backgroundImage: 'radial-gradient(circle at center, rgba(34,211,238,0.4) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          </div>

          <div className="relative z-10 max-w-3xl mx-auto space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tight sm:text-5xl text-slate-900 dark:text-white">
                Ready to run SECMUN like a real organization?
              </h2>
              <p className="text-lg text-slate-600 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed">
                Sign in with your verified SECMUN account and explore the consolidated workspace.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              {!loading && (
                user ? (
                  <Button size="lg" onClick={handleLogout} className="w-full sm:w-auto px-10 h-14 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold transition-all hover:scale-[1.05] shadow-lg shadow-primary/20">
                    Logout from Session
                  </Button>
                ) : (
                  <>
                    <Link href="/login" className="w-full sm:w-auto">
                      <Button size="lg" className="w-full px-10 h-14 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold shadow-xl shadow-primary/20 transition-all hover:scale-[1.05]">
                        Sign In to Workspace
                      </Button>
                    </Link>
                    <PwaInstallButton />
                  </>
                )
              )}
            </div>

            <p className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-400 dark:text-white/20">
              Authorized access only · Secure Environment
            </p>
          </div>
        </div>
      </motion.section>

    </div>
  )
}
