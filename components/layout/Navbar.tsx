// components/layout/Navbar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Menu } from 'lucide-react'
import { motion, useScroll, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/events', label: 'Events' },   // placeholder
  { href: '/finance', label: 'Finance' }, // placeholder
]

export default function Navbar() {
  const pathname = usePathname()
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const unsub = scrollY.on('change', (y) => {
      setScrolled(y > 24)
    })
    return () => unsub()
  }, [scrollY])

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-3 sm:px-4">
        {/* DESKTOP */}
        <div className="hidden h-16 items-center sm:flex">
          <AnimatePresence mode="wait" initial={false}>
            {!scrolled && (
              <motion.div
                key="full-bar"
                className="flex w-full items-center justify-between"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ type: 'spring', stiffness: 360, damping: 30 }}
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
                    S3
                  </span>
                  <div className="flex flex-col leading-tight">
                    <span className="text-sm font-semibold">s3cNS</span>
                    <span className="text-[11px] text-muted-foreground">
                      SECMUN Platform
                    </span>
                  </div>
                </div>
                <nav className="flex items-center gap-4 text-sm">
                  {navLinks.map((link) => {
                    const active = pathname === link.href
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={
                          active
                            ? 'text-foreground underline-offset-4 hover:underline'
                            : 'text-muted-foreground transition hover:text-foreground'
                        }
                      >
                        {link.label}
                      </Link>
                    )
                  })}
                  <Link href="/login">
                    <Button size="sm" variant="outline">
                      Sign in
                    </Button>
                  </Link>
                </nav>
              </motion.div>
            )}

            {scrolled && (
              <motion.div
                key="pill-bar"
                className="flex w-full items-center justify-center"
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 360, damping: 30 }}
              >
                <div className="flex max-w-xl flex-1 items-center justify-between rounded-full border bg-background px-5 py-2 shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
                      S3
                    </span>
                    <div className="flex flex-col leading-tight">
                      <span className="text-sm font-semibold">s3cNS</span>
                      <span className="text-[11px] text-muted-foreground">
                        SECMUN Platform
                      </span>
                    </div>
                  </div>
                  <nav className="flex items-center gap-4 text-sm">
                    {navLinks.map((link) => {
                      const active = pathname === link.href
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          className={
                            active
                              ? 'text-foreground underline-offset-4 hover:underline'
                              : 'text-muted-foreground transition hover:text-foreground'
                          }
                        >
                          {link.label}
                        </Link>
                      )
                    })}
                    <Link href="/login">
                      <Button size="sm">
                        Sign in
                      </Button>
                    </Link>
                  </nav>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* MOBILE */}
        <div className="flex h-14 items-center justify-between sm:hidden">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
              S3
            </span>
            <span className="text-sm font-semibold">s3cNS</span>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open navigation menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <div className="mt-4 space-y-4">
                <div className="flex flex-col">
                  <span className="text-base font-semibold">s3cNS</span>
                  <span className="text-xs text-muted-foreground">
                    SECMUN Platform
                  </span>
                </div>
                <nav className="flex flex-col gap-2 text-sm">
                  {navLinks.map((link) => {
                    const active = pathname === link.href
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={
                          active
                            ? 'rounded-md bg-muted px-2 py-1.5 font-medium text-foreground'
                            : 'rounded-md px-2 py-1.5 text-muted-foreground hover:bg-muted hover:text-foreground'
                        }
                      >
                        {link.label}
                      </Link>
                    )
                  })}
                  <Link href="/login">
                    <Button className="mt-3 w-full" size="sm">
                      Sign in
                    </Button>
                  </Link>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
