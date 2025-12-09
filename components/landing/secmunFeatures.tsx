// app/(landing)/_components/SecmunFeatures.tsx
'use client'

import { motion } from 'motion/react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Compare } from '@/components/ui/compare'

const featureCards = [
  {
    title: 'Finance workspace, not scattered sheets',
    description:
      'Design budgets, log expenses, and see the full picture for each SEC‑MUN event without hunting through random Excel files.',
    image: '/landing/finance-dashboard.jpg',
    className:
      'col-span-1 lg:col-span-4 border-b lg:border-r border-neutral-200/70 dark:border-neutral-800',
  },
  {
    title: 'Documents that stay organised',
    description:
      'Circulars, allotments, and internal docs live in one library with consistent naming and access for the Secretariat.',
    image: '/landing/documents.jpg',
    className:
      'col-span-1 lg:col-span-2 border-b border-neutral-200/70 dark:border-neutral-800',
  },
  {
    title: 'Finance emails & approvals, in context',
    description:
      'Turn a budget into a ready‑to‑send finance email, with line items and totals pulled directly from the system.',
    image: '/landing/finance-email.jpg',
    className:
      'col-span-1 lg:col-span-3 lg:border-r border-neutral-200/70 dark:border-neutral-800',
  },
  {
    title: 'Deploy once, reuse every conference',
    description:
      'Set up the platform once and reuse the same structure for each SEC‑MUN edition, instead of rebuilding trackers every year.',
    image: '/landing/reuse.jpg',
    className:
      'col-span-1 lg:col-span-3 border-t lg:border-none border-neutral-200/70 dark:border-neutral-800',
  },
]


export function SecmunFeatures() {
  return (
    <section className="relative z-10 bg-white py-16 dark:bg-black">
      <div className="mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <h3 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white md:text-3xl">
            Built around how a real MUN Secretariat works.
          </h3>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-600 dark:text-neutral-300">
            SEC‑MUN is not a generic admin panel. Each module is tuned for budgets, committees,
            documents, and approvals that an actual conference runs on.
          </p>
        </motion.div>

        <div className="relative mt-10">
          <div className="grid grid-cols-1 rounded-2xl border border-neutral-200/80 bg-white/80 shadow-sm backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/70 lg:grid-cols-6">
            {featureCards.map(card => (
              <FeatureCard key={card.title} className={card.className}>
                <FeatureTitle>{card.title}</FeatureTitle>
                <FeatureDescription>{card.description}</FeatureDescription>
                <div className="mt-3 h-full w-full">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 18 }}
                    className="relative h-40 w-full overflow-hidden rounded-lg border border-neutral-200/80 bg-slate-100 dark:border-neutral-800 dark:bg-neutral-900 md:h-52"
                  >
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      className="h-full w-full object-cover"
                    />
                  </motion.div>
                </div>
              </FeatureCard>
            ))}

            {/* Comparison block */}
            <FeatureCard className="col-span-1 border-t border-neutral-200/80 dark:border-neutral-800 lg:col-span-3">
              <FeatureTitle>From scattered sheets to one finance workspace</FeatureTitle>
              <FeatureDescription>
                Show finance teams why moving away from ad‑hoc Excel files makes approvals and
                audits faster, safer, and easier to explain.
              </FeatureDescription>
              <div className="mt-3">
                <Compare
                  firstImage="/landing/excel-budget.png"
                  secondImage="/landing/secmun-budget.png"
                  firstImageClassName="object-cover object-left-top"
                  secondImageClassname="object-cover object-left-top"
                  className="h-[220px] w-full md:h-[320px]"
                  slideMode="hover"
                />
              </div>
            </FeatureCard>
          </div>
        </div>
      </div>
    </section>
  )
}

function FeatureCard({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'relative overflow-hidden p-4 sm:p-6',
        className,
      )}
    >
      {children}
    </div>
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
