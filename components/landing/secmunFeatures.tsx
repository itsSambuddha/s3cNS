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
    <section className="relative bg-white py-16 dark:bg-[#030712] overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
        <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[100px]" />
        <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/5 blur-[100px]" />
      </div>

      <div className="mx-auto max-w-7xl px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <div className="inline-block px-4 py-1.5 mb-6 rounded-full border border-primary/10 bg-primary/5 text-[10px] font-black tracking-[0.2em] text-primary uppercase">
            Operational Intelligence
          </div>
          <h3 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white md:text-5xl lg:text-6xl max-w-4xl mx-auto leading-[1.1]">
            A Control Room for everything SECMUN does.
          </h3>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-zinc-400 leading-relaxed">
            Automation, Finance, Communication and execution live in one system,
            eliminating fragmented workflows and spreadsheets.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-[2.5rem] border border-neutral-200/80 bg-neutral-200/50 dark:border-white/5 dark:bg-white/5 lg:grid-cols-6 lg:grid-rows-[auto_auto_auto]">
            {/* Automation Card: top-left, spans 2 rows */}
            <FeatureCard
              index={0}
              className="col-span-1 lg:col-span-4 lg:row-span-2 bg-white dark:bg-[#030712] p-8 sm:p-10"
            >
              <div className="flex flex-col h-full">
                <div className="space-y-4 mb-8">
                  <FeatureTitle><strong>AUTOMATION</strong> For Conferences</FeatureTitle>
                  <FeatureDescription>
                    The definitive solution to manage and automate finances, communication, archives and on-ground execution for high-stakes SECMUN events.
                  </FeatureDescription>
                </div>
                <motion.div
                  whileHover={{ scale: 1.01, translateY: -4 }}
                  transition={{ type: 'spring', stiffness: 150, damping: 20 }}
                  className="relative mt-auto w-full overflow-hidden rounded-2xl border border-neutral-200 dark:border-white/5 bg-slate-100 aspect-[16/9] dark:bg-zinc-900 shadow-2xl"
                >
                  <Image
                    src="/landing/finance-dashboard.jpg"
                    alt="Finance dashboard"
                    fill
                    className="object-cover opacity-90 transition-opacity hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                </motion.div>
              </div>
            </FeatureCard>

            {/* Automation rail: right, spans all 3 rows */}
            <FeatureCard
              index={1}
              className="col-span-1 lg:col-span-2 lg:row-span-3 bg-white/95 dark:bg-[#060b18] p-8 sm:p-10 flex flex-col"
            >
              <div className="space-y-4 mb-8">
                <FeatureTitle>Automated, real-time communication</FeatureTitle>
                <FeatureDescription>
                  Updates, reminders, allotments, and alerts sent automatically
                  via integrated channels — all triggered by core s3cNS actions.
                </FeatureDescription>
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <AutomationRail />
              </div>
            </FeatureCard>

            {/* Institutional memory: under finance */}
            <FeatureCard
              index={2}
              className="col-span-1 lg:col-span-4 lg:row-span-1 bg-white/90 dark:bg-[#070d1d] p-8 sm:p-10"
            >
              <div className="flex flex-col md:flex-row gap-10 items-center">
                <div className="flex-1 space-y-4">
                  <FeatureTitle>Institutional memory that persists</FeatureTitle>
                  <FeatureDescription>
                    Archive circulars, allotments, minutes, and vendor details so every new Secretariat starts with a complete operational history.
                  </FeatureDescription>
                </div>
                <motion.div
                  whileHover={{ scale: 1.02, x: 10 }}
                  transition={{ type: 'spring', stiffness: 150, damping: 20 }}
                  className="flex-1 h-48 w-full overflow-hidden rounded-2xl border border-neutral-200 dark:border-white/5 bg-slate-100 dark:bg-zinc-900 shadow-xl"
                >
                  <Image
                    src="/landing/inventory.jpg"
                    alt="Institutional memory"
                    width={1400}
                    height={800}
                    className="h-full w-full object-cover opacity-80"
                  />
                </motion.div>
              </div>
            </FeatureCard>

            {/* Platform card: bottom-left */}
            <FeatureCard
              index={3}
              className="col-span-1 lg:col-span-2 lg:row-span-1 bg-white dark:bg-[#040916] p-8 border-t border-neutral-200 dark:border-white/5"
            >
              <div className="space-y-4">
                <CardTitle className="text-xl">One interface, web and app</CardTitle>
                <CardDescription className="text-zinc-400">
                  A comprehensive web dashboard for administration, paired with a focused mobile view for on-ground execution.
                </CardDescription>
                <div className="pt-4">
                  <CardDemo />
                </div>
              </div>
            </FeatureCard>

            {/* Compare section: bottom-middle */}
            <FeatureCard
              index={4}
              className="col-span-1 lg:col-span-4 lg:row-span-1 bg-white dark:bg-[#050a1b] p-8 border-t border-neutral-200 dark:border-white/5"
            >
              <div className="flex flex-col items-center text-center">
                <div className="space-y-4 max-w-2xl mb-8">
                  <FeatureTitle>From scattered tools to one control room</FeatureTitle>
                  <FeatureDescription className="mx-auto">
                    Seamlessly transition from the friction of spreadsheets and fragmented chats to a unified, professional workspace.
                  </FeatureDescription>
                </div>
                <div className="w-full">
                  <HassleFreeCompare />
                </div>
              </div>
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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{
        delay: 0.1 * index,
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={cn('relative overflow-hidden group/card', className)}
    >
      {/* Subtle hover overlay */}
      <div className="absolute inset-0 bg-primary/0 group-hover/card:bg-primary/[0.01] transition-colors duration-500 pointer-events-none" />
      {children}
    </motion.div>
  )
}

function FeatureTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-left text-2xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
      {children}
    </p>
  )
}

function FeatureDescription({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <p className={cn("max-w-md text-left text-sm text-slate-500 dark:text-zinc-400 leading-relaxed font-medium transition-colors group-hover/card:text-slate-600 dark:group-hover/card:text-zinc-300", className)}>
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
    <div className="mt-6 h-full" onMouseLeave={resumeLoop}>
      <div className="flex h-full items-stretch gap-4 rounded-3xl border border-neutral-200/50 bg-white/50 p-4 text-[11px] shadow-2xl shadow-slate-200/50 backdrop-blur-sm dark:border-white/5 dark:bg-zinc-900/50 dark:shadow-none">
        {/* Rail */}
        <div className="relative flex w-12 items-center justify-center">
          <div className="h-full w-[1px] rounded-full bg-slate-200 dark:bg-white/10" />
          {stops.map((s) => (
            <div
              key={s.id}
              className="pointer-events-none absolute left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-slate-300 dark:bg-white/20"
              style={{ top: `${((s.pos + 1) / 2) * 100}%`, marginTop: -2 }}
            />
          ))}

          {/* upgraded marker */}
          <motion.div
            style={{ top: markerY }}
            className="pointer-events-none absolute left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                boxShadow: [
                  '0 0 0 rgba(56,189,248,0)',
                  '0 0 20px rgba(56,189,248,0.6)',
                  '0 0 0 rgba(56,189,248,0)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="relative flex items-center justify-center"
            >
              <div className="h-10 w-1.5 rounded-full bg-sky-500 shadow-[0_0_15px_rgba(14,165,233,0.5)]" />
              <div className="absolute h-6 w-6 rounded-full border-[0.5px] border-sky-400/40 bg-sky-400/10 blur-[2px]" />
            </motion.div>
          </motion.div>
        </div>

        {/* Channels */}
        <div className="flex flex-1 flex-col justify-between space-y-4">
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
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className={cn(
                  'flex w-full items-center justify-between rounded-2xl px-5 py-4 text-left transition-all duration-300',
                  isClosest
                    ? 'bg-white shadow-xl shadow-slate-200/50 ring-[0.5px] ring-sky-500/20 dark:bg-zinc-800 dark:shadow-none dark:ring-white/10'
                    : 'bg-transparent hover:bg-slate-50 dark:hover:bg-white/5',
                )}
              >
                <div className="flex items-center gap-4">
                  <motion.div
                    animate={
                      shouldWiggle
                        ? { rotate: [-2, 2, -1, 1, 0], scale: [1, 1.05, 1] }
                        : { rotate: 0, scale: 1 }
                    }
                    transition={
                      shouldWiggle
                        ? { duration: 0.6, ease: 'easeInOut' }
                        : { duration: 0.2 }
                    }
                    className="relative h-11 w-11 overflow-hidden rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200/50 dark:border-white/5 p-1.5 shadow-sm"
                  >
                    <Image
                      src={meta.icon}
                      alt={meta.name}
                      width={44}
                      height={44}
                      className="h-full w-full object-contain"
                    />
                    {isClosest && (
                      <span
                        className={cn(
                          'pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-b opacity-10',
                          meta.color,
                        )}
                      />
                    )}
                  </motion.div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {meta.name}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-zinc-400 font-medium leading-tight">
                      {meta.description}
                    </p>
                  </div>
                </div>
              </motion.button>
            )
          })}
          <p className="mt-2 text-[10px] text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-widest text-center">
            One update · Instant propagation
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
