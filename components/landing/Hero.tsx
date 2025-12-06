// components/landing/Hero.tsx
'use client'

import { useRouter } from 'next/navigation'
import { motion, easeOut } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { FlipWords } from '@/components/ui/flip-words'
const words = ['smoother', 'smarter', 'faster', 'easier']


const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const fadeInUp = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: easeOut },
  },
}

export function Hero() {
  const router = useRouter()
  const { user, loading } = useAuth()

  const handlePrimaryClick = () => {
    if (loading) return
    if (user) {
      router.push('/dashboard')
    } else {
      router.push('/login')
    }
  }

  return (
    <section className="mx-auto flex max-w-6xl flex-col gap-10 px-3 pt-10 sm:px-4 sm:pt-16 lg:flex-row lg:items-center">
      <motion.div
        className="flex-1 space-y-5"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <motion.div
          className="inline-flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1 text-[11px] text-muted-foreground sm:text-xs"
          variants={fadeInUp}
        >
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Mobile‑first · PWA‑ready · Built for SECMUN
        </motion.div>

<motion.div className="space-y-4" variants={fadeInUp}>
  <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
    Your one‑stop platform for{' '}
    <FlipWords
      words={words}
      className="inline-block text-primary"
    />{' '}
    SECMUN operation.
  </h1>
  <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
    s3cNS centralizes events, finances, documents, and secretariat
    workflows into a single, secure dashboard that works beautifully on
    phones and desktops.
  </p>
</motion.div>


        <motion.div className="flex flex-wrap gap-3" variants={fadeInUp}>
          <Button
            size="lg"
            className="w-full sm:w-auto"
            onClick={handlePrimaryClick}
            disabled={loading}
          >
            {loading
              ? 'Checking session…'
              : user
              ? 'Go to dashboard'
              : 'Sign in to dashboard'}
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="w-full sm:w-auto"
            disabled
          >
            Explore public modules (soon)
          </Button>
        </motion.div>

        <motion.div
          className="flex flex-wrap gap-4 text-xs text-muted-foreground sm:text-sm"
          variants={fadeInUp}
        >
          <span>• Fast on low‑end devices</span>
          <span>• Works great as a PWA</span>
          <span>• Designed for non‑technical users</span>
        </motion.div>
      </motion.div>

      <motion.div
        className="flex-1"
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="mx-auto w-full max-w-md rounded-2xl border bg-card/80 p-4 shadow-sm sm:p-6">
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Today&apos;s snapshot
          </p>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between rounded-lg bg-muted px-3 py-2">
              <span>Budgets on track</span>
              <span className="font-semibold text-emerald-500">12 / 14</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-muted px-3 py-2">
              <span>Active events</span>
              <span className="font-semibold">3</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-muted px-3 py-2">
              <span>Pending approvals</span>
              <span className="font-semibold text-amber-500">5</span>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
