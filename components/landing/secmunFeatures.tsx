// app/(landing)/_components/SecmunFeatures.tsx
'use client'

import { useState, useEffect } from 'react'
import {
  animate,
  motion,
  useMotionValue,
  useTransform,
} from 'motion/react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Compare } from '@/components/ui/compare'
import { Globe2Icon, SmartphoneIcon } from 'lucide-react'

/* -------------------- Logo components -------------------- */

export const GoogleLogo = ({ className }: { className?: string }) => (
  <img src="/logo/Google-Icon.svg" alt="Google" className={cn('h-8 w-8', className)} />
)

export const GeminiLogo = ({ className }: { className?: string }) => (
  <img src="/logo/gemini-color.svg" alt="Gemini" className={cn('h-8 w-8', className)} />
)

export const GmailLogo = ({ className }: { className?: string }) => (
  <img src="/logo/Gmail_Logo.svg" alt="Gmail" className={cn('h-8 w-8', className)} />
)

export const WhatsAppLogo = ({ className }: { className?: string }) => (
  <img src="/logo/WhatsApp.svg" alt="WhatsApp" className={cn('h-8 w-8', className)} />
)

/* -------------------- Top-level section -------------------- */

export function SecmunFeatures() {
  return (
    <section className="relative bg-white py-16 dark:bg-black">
      <div className="mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.45, type: 'spring', stiffness: 160, damping: 22 }}
          className="text-center"
        >
          <h3 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white md:text-3xl">
            A Control Room for everything SECMUN does.
          </h3>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-600 dark:text-neutral-300">
            Finance, communication, archives, and execution live in one system,
            instead of scattered sheets, chats, and drives.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, type: 'spring', stiffness: 150, damping: 20 }}
          className="relative mt-10"
        >
          {/* 3 rows, 6 columns; rows auto-size */}
          <div className="grid grid-cols-1 rounded-2xl border border-neutral-200/80 bg-white/80 shadow-sm backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/80 lg:grid-cols-6 lg:grid-rows-[auto_auto_auto]">
            {/* Finance: top-left, spans 2 rows */}
            <FeatureCard
              index={0}
              className="col-span-1 lg:col-span-4 lg:row-span-2 border-b lg:border-b-0 lg:border-r border-neutral-200/80 dark:border-neutral-800"
            >
              <FeatureTitle>Finance built for conferences</FeatureTitle>
              <FeatureDescription>
                Design per‑event budgets, log expenses, and see totals in one
                view instead of juggling ten different sheets.
              </FeatureDescription>
              <motion.div
                whileHover={{ scale: 1.02, translateY: -4 }}
                transition={{ type: 'spring', stiffness: 220, damping: 20 }}
                className="relative mt-3 w-full overflow-hidden rounded-lg border border-neutral-200/80 bg-slate-100 aspect-[4/3] dark:border-neutral-800 dark:bg-neutral-900"
              >
                <Image
                  src="/landing/finance-dashboard.jpg"
                  alt="Finance dashboard"
                  fill
                  className="object-cover"
                />
              </motion.div>
            </FeatureCard>

            {/* Automation rail: right, spans all 3 rows */}
            <FeatureCard
              index={1}
              className="col-span-1 lg:col-span-2 lg:row-span-3 border-t lg:border-t-0 border-neutral-200/80 dark:border-neutral-800 flex flex-col"
            >
              <FeatureTitle>Automated, real‑time communication</FeatureTitle>
              <FeatureDescription>
                Once budgets or updates are logged, emails, WhatsApp messages, and
                device push notifications are sent automatically.
              </FeatureDescription>
              <div className="flex-1 flex items-end">
                <AutomationRail />
              </div>
            </FeatureCard>

            {/* Institutional memory: under finance */}
            <FeatureCard
              index={2}
              className="col-span-1 lg:col-span-4 lg:row-span-1 border-t lg:border-t border-neutral-200/80 dark:border-neutral-800"
            >
              <FeatureTitle>Institutional memory that persists</FeatureTitle>
              <FeatureDescription>
                Archive circulars, allotments, minutes, amenity lists, and
                vendor details so every new Secretariat starts ahead.
              </FeatureDescription>
              <motion.div
                whileHover={{ scale: 1.02, translateY: -4 }}
                transition={{ type: 'spring', stiffness: 220, damping: 20 }}
                className="mt-3 h-48 md:h-56 w-full overflow-hidden rounded-lg border border-neutral-200/80 bg-slate-100 dark:border-neutral-800 dark:bg-neutral-900"
              >
                <Image
                  src="/landing/inventory.jpg"
                  alt="Institutional memory"
                  width={1400}
                  height={800}
                  className="h-full w-full object-cover"
                />
              </motion.div>
            </FeatureCard>

            {/* Card section: bottom-left */}
            <FeatureCard
              index={3}
              className="col-span-1 lg:col-span-2 lg:row-span-1 border-t border-neutral-200/80 lg:border-r dark:border-neutral-800"
            >
              <CardTitle>One interface, web and app</CardTitle>
              <CardDescription>
                Secretariat runs SECMUN from a full web dashboard while
                on‑ground teams use a focused mobile view for quick updates.
              </CardDescription>
              <div className="mt-3">
                <CardDemo />
              </div>
            </FeatureCard>

            {/* Compare section: bottom-middle */}
            <FeatureCard
              index={4}
              className="col-span-1 lg:col-span-4 lg:row-span-1 border-t border-neutral-200/80 dark:border-neutral-800"
            >
              <FeatureTitle>From scattered tools to one control room</FeatureTitle>
              <FeatureDescription>
                Slide between the old “spreadsheets + chats + drives” setup and
                a single SEC‑MUN workspace.
              </FeatureDescription>
              <HassleFreeCompare />
            </FeatureCard>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/* -------------------- Shared primitives -------------------- */

function FeatureCard({
  children,
  className,
  index,
}: {
  children: React.ReactNode
  className?: string
  index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{
        delay: 0.05 * index,
        type: 'spring',
        stiffness: 200,
        damping: 22,
      }}
      className={cn('relative overflow-hidden p-4 sm:p-6', className)}
    >
      {children}
    </motion.div>
  )
}

function FeatureTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-left text-base font-semibold tracking-tight text-slate-900 dark:text-white md:text-lg">
      {children}
    </p>
  )
}

function FeatureDescription({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-1 max-w-sm text-left text-xs text-slate-600 dark:text-neutral-300 md:text-sm">
      {children}
    </p>
  )
}

/* -------------------- Automation rail (timeline) -------------------- */

type ChannelId = 'gmail' | 'whatsapp' | 'notify'

const channelMeta: Record<
  ChannelId,
  { name: string; description: string; icon: string; color: string }
> = {
  gmail: {
    name: 'Gmail',
    description: 'Finance and update emails drafted with the latest numbers.',
    icon: '/logo/Gmail_Logo.svg',
    color: 'from-rose-500/50 to-rose-500/0',
  },
  whatsapp: {
    name: 'WhatsApp',
    description: 'Heads‑ups and reminders sent to your core groups.',
    icon: '/logo/WhatsApp.svg',
    color: 'from-emerald-500/50 to-emerald-500/0',
  },
  notify: {
    name: 'In‑app alerts',
    description: 'Dashboards and cards refresh instantly for Secretariat.',
    icon: '/logo/alert.svg',
    color: 'from-sky-500/60 to-sky-500/0',
  },
}

function AutomationRail() {
  const [looping, setLooping] = useState(true)
  const [active, setActive] = useState<ChannelId>('gmail')

  const stops: { id: ChannelId; pos: number }[] = [
    { id: 'gmail', pos: -1 },
    { id: 'whatsapp', pos: 0 },
    { id: 'notify', pos: 1 },
  ]

  const y = useMotionValue(-1)

  // loop top<->bottom unless user is interacting
  useEffect(() => {
    if (!looping) return
    const controls = animate(y, 1, {
      duration: 4,
      repeat: Infinity,
      repeatType: 'reverse',
      ease: 'easeInOut',
    })
    return () => controls.stop()
  }, [looping, y])

  // travel within rail; avoid clipping
  const markerY = useTransform(y, [-1, 1], ['10%', '90%'])

  const [closest, setClosest] = useState<ChannelId>('gmail')
  useEffect(() => {
    const unsub = y.on('change', (val) => {
      let best: ChannelId = 'gmail'
      let bestDist = Infinity
      for (const s of stops) {
        const d = Math.abs(s.pos - val)
        if (d < bestDist) {
          best = s.id
          bestDist = d
        }
      }
      setClosest(best)
    })
    return () => unsub()
  }, [y])

  const snapTo = (id: ChannelId) => {
    setLooping(false)
    const stop = stops.find((s) => s.id === id)
    if (!stop) return
    animate(y, stop.pos, {
      type: 'spring',
      stiffness: 260,
      damping: 28,
    })
    setActive(id)
  }

  const resumeLoop = () => setLooping(true)

  return (
    <div className="mt-3 h-full" onMouseLeave={resumeLoop}>
      <div className="flex h-full items-stretch gap-3 rounded-xl border border-neutral-200/80 bg-neutral-50/90 p-3 text-[11px] shadow-[0_12px_40px_rgba(15,23,42,0.12)] dark:border-neutral-800 dark:bg-neutral-900/95">
        {/* Rail */}
        <div className="relative flex w-10 items-center justify-center">
          <div className="h-full w-[2px] rounded-full bg-gradient-to-b from-slate-200 via-slate-400 to-slate-200 dark:from-neutral-800 dark:via-neutral-500 dark:to-neutral-800" />
          {stops.map((s) => (
            <div
              key={s.id}
              className="pointer-events-none absolute left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-slate-300 dark:bg-neutral-600"
              style={{ top: `${((s.pos + 1) / 2) * 100}%`, marginTop: -3 }}
            />
          ))}

          {/* upgraded marker */}
          <motion.div
            style={{ top: markerY }}
            className="pointer-events-none absolute left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{
                scale: [1, 1.04, 1],
                boxShadow: [
                  '0 0 0 rgba(56,189,248,0)',
                  '0 0 24px rgba(56,189,248,0.9)',
                  '0 0 0 rgba(56,189,248,0)',
                ],
              }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
              className="relative flex items-center justify-center"
            >
              <div className="h-8 w-3 rounded-full bg-gradient-to-b from-sky-400 via-sky-500 to-sky-400" />
              <span className="absolute h-7 w-7 rounded-full border border-sky-300/60 bg-sky-400/15 blur-[1px]" />
            </motion.div>
          </motion.div>
        </div>

        {/* Channels */}
        <div className="flex flex-1 flex-col justify-between space-y-3">
          {stops.map((s) => {
            const meta = channelMeta[s.id]
            const isClosest = closest === s.id
            const isActive = active === s.id
            const shouldWiggle = isClosest || isActive

            return (
              <motion.button
                key={s.id}
                type="button"
                onMouseEnter={() => snapTo(s.id)}
                whileHover={{ scale: 1.02, x: 2 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                className={cn(
                  'flex w-full items-center justify-between rounded-xl px-4 py-3 text-left transition-colors',
                  isClosest
                    ? 'bg-white shadow-sm ring-1 ring-sky-200 dark:bg-neutral-950 dark:ring-sky-500/60'
                    : 'bg-white/80 ring-1 ring-transparent hover:ring-slate-200/80 dark:bg-neutral-950/70 dark:hover:ring-neutral-700/70',
                )}
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={
                      shouldWiggle
                        ? { rotate: [-4, 4, -3, 3, 0], scale: [1, 1.04, 1] }
                        : { rotate: 0, scale: 1 }
                    }
                    transition={
                      shouldWiggle
                        ? { duration: 0.5, ease: 'easeInOut' }
                        : { duration: 0.2 }
                    }
                    className="relative h-9 w-9 overflow-hidden rounded-full bg-neutral-100 shadow-[0_0_0_1px_rgba(148,163,184,0.3)] dark:bg-neutral-800"
                  >
                    <Image
                      src={meta.icon}
                      alt={meta.name}
                      width={36}
                      height={36}
                      className="h-full w-full object-contain"
                    />
                    {isClosest && (
                      <span
                        className={cn(
                          'pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b opacity-80',
                          meta.color,
                        )}
                      />
                    )}
                  </motion.div>
                  <div className="space-y-0.5">
                    <p className="text-[12px] md:text-sm font-semibold text-slate-900 dark:text-neutral-50">
                      {meta.name}
                    </p>
                    <p className="text-[11px] md:text-[12px] text-slate-500 dark:text-neutral-400">
                      {meta.description}
                    </p>
                  </div>
                </div>
                {/* Live pill removed */}
              </motion.button>
            )
          })}
          <p className="mt-1 text-[10px] text-slate-500 dark:text-neutral-400">
            One change in SEC‑MUN runs down this rail and reaches every channel in under a second.
          </p>
        </div>
      </div>
    </div>
  )
}

/* -------------------- Card section (Aceternity-style) -------------------- */

export function CardDemo() {
  return (
    <Card>
      <CardSkeletonContainer>
        <Skeleton />
      </CardSkeletonContainer>
      <CardTitle>
        Powered By{' '}
        <span style={{ fontWeight: 'bold' }}>
          <span style={{ color: '#4285F4' }}>G</span>
          <span style={{ color: '#EA4335' }}>O</span>
          <span style={{ color: '#FBBC05' }}>O</span>
          <span style={{ color: '#4285F4' }}>G</span>
          <span style={{ color: '#34A853' }}>L</span>
          <span style={{ color: '#EA4335' }}>E</span>
        </span>{' '}
        and{' '}
        <span
          style={{
            fontWeight: 'bold',
            backgroundImage:
              'linear-gradient(to right, #9168C0, #5684D1, #1BA1E3)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          GEMINI
        </span>
      </CardTitle>
      <CardDescription>
        The first platform of St. Edmund&apos;s College Powered by Google & Gemini to function across all devices.
      </CardDescription>
    </Card>
  )
}

const Skeleton = () => {
  const scale = [1, 1.1, 1]
  const transform = ['translateY(0px)', 'translateY(-4px)', 'translateY(0px)']

  const sequence: any = [
    ['.circle-1', { scale, transform }, { duration: 0.8 }],
    ['.circle-2', { scale, transform }, { duration: 0.8 }],
    ['.circle-3', { scale, transform }, { duration: 0.8 }],
    ['.circle-4', { scale, transform }, { duration: 0.8 }],
    ['.circle-5', { scale, transform }, { duration: 0.8 }],
  ]

  useEffect(() => {
    // @ts-ignore
    animate(sequence, { repeat: Infinity, repeatDelay: 1 })
  }, [])

  return (
    <div className="relative flex h-full items-center justify-center overflow-hidden p-8">
      <div className="flex shrink-0 flex-row items-center justify-center gap-2">
        <Container className="h-8 w-8 circle-1">
          <Globe2Icon className="h-4 w-4 text-slate-900 dark:text-white" />
        </Container>
        <Container className="h-12 w-12 circle-2">
          <GeminiLogo />
        </Container>
        <Container className="circle-3">
          <GoogleLogo className="h-5 w-5" />
        </Container>
        <Container className="h-12 w-12 circle-4">
          <SmartphoneIcon className="h-5 w-5 text-slate-900 dark:text-white" />
        </Container>
      </div>
    </div>
  )
}

const Sparkles = () => {
  const randomMove = () => Math.random() * 2 - 1
  const randomOpacity = () => Math.random()
  const random = () => Math.random()

  return (
    <div className="absolute inset-0">
      {[...Array(12)].map((_, i) => (
        <motion.span
          key={`star-${i}`}
          animate={{
            top: `calc(${random() * 100}% + ${randomMove()}px)`,
            left: `calc(${random() * 100}% + ${randomMove()}px)`,
            opacity: randomOpacity(),
            scale: [1, 1.2, 0],
          }}
          transition={{
            duration: random() * 2 + 4,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            position: 'absolute',
            top: `${random() * 100}%`,
            left: `${random() * 100}%`,
            width: '2px',
            height: '2px',
            borderRadius: '50%',
            zIndex: 1,
          }}
          className="inline-block bg-black dark:bg-white"
        />
      ))}
    </div>
  )
}

/* Card primitives */

export const Card = ({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) => (
  <div
    className={cn(
      'mx-auto w-full max-w-sm rounded-xl border border-[rgba(255,255,255,0.10)] bg-gray-100 p-8 shadow-[2px_4px_16px_0px_rgba(248,248,248,0.06)_inset] group dark:bg-[rgba(40,40,40,0.70)]',
      className,
    )}
  >
    {children}
  </div>
)

export const CardTitle = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => (
  <h3
    className={cn(
      'py-2 text-lg font-semibold text-gray-800 dark:text-white',
      className,
    )}
  >
    {children}
  </h3>
)

export const CardDescription = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => (
  <p
    className={cn(
      'max-w-sm text-sm font-normal text-neutral-600 dark:text-neutral-400',
      className,
    )}
  >
    {children}
  </p>
)

export const CardSkeletonContainer = ({
  className,
  children,
  showGradient = true,
}: {
  className?: string
  children: React.ReactNode
  showGradient?: boolean
}) => (
  <div
    className={cn(
      'z-40 h-[15rem] rounded-xl md:h-[20rem]',
      className,
      showGradient &&
        'bg-neutral-300 dark:bg-[rgba(40,40,40,0.70)] [mask-image:radial-gradient(50%_50%_at_50%_50%,white_0%,transparent_100%)]',
    )}
  >
    {children}
  </div>
)

const Container = ({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) => (
  <div
    className={cn(
      'flex h-16 w-16 items-center justify-center rounded-full bg-white/80 dark:bg-[rgba(40,40,40,0.9)] shadow-[0px_0px_8px_0px_rgba(15,23,42,0.12),0px_24px_32px_-16px_rgba(0,0,0,0.40)]',
      className,
    )}
  >
    {children}
  </div>
)

/* -------------------- Compare card -------------------- */

function HassleFreeCompare() {
  return (
    <div className="mt-20 flex items-center justify-center mb-0 md:mb-10">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ type: 'spring', stiffness: 210, damping: 22 }}
        className="flex h-[240px] w-full items-center justify-center px-1 md:h-[350px] md:w-4/5 md:px-4 [perspective:750px] [transform-style:preserve-3d]"
      >
        <div
          style={{ transform: 'rotateX(12deg) translateZ(60px)' }}
          className="h-full w-full rounded-3xl border border-neutral-200 bg-neutral-50 p-1 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 md:p-3"
        >
          <Compare
            firstImage="/landing/before-secmun.png"
            secondImage="/landing/after-secmun.png"
            firstImageClassName="object-cover object-left-top w-full"
            secondImageClassname="object-cover object-left-top w-full"
            className="h-full w-full rounded-2xl"
            slideMode="hover"
            autoplay
          />
        </div>
      </motion.div>
    </div>
  )
}
