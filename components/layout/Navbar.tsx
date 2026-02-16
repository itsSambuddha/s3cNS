// components/layout/Navbar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion, useScroll, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { signOut } from 'firebase/auth'
import { firebaseAuth } from '@/lib/auth/firebase'
import MobileNav from './MobileNav'
import { NotificationBell } from '@/components/notifications/NotificationBell'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/gazette', label: 'Gazette' },   // placeholder
  { href: '/secretariat', label: 'Secretariat' }, // placeholder
  { href: '/help', label: 'Help' }, // placeholder
]

export default function Navbar() {
  const pathname = usePathname()
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const { user, loading } = useAuth()

  useEffect(() => {
    const unsub = scrollY.on('change', (y) => {
      setScrolled(y > 24)
    })
    return () => unsub()
  }, [scrollY])

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
    <header className={cn(
      "sticky top-0 z-40 transition-all duration-300",
      scrolled
        ? "bg-transparent border-none py-2" // py-2 to give pill some breathing room
        : "bg-white/80 dark:bg-[#030712]/80 backdrop-blur-md border-b border-slate-200/60 dark:border-white/5"
    )}>
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
                <div className="mt-2 flex items-center gap-2">
                  {/* <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
                    S3
                    
                  </span> */}
                  <img src="/logo/s3cnsLogo.svg" alt="s3cNS Logo" className="mt-2 h-15 w-25 rounded-lg" />
                  <div className="flex flex-col leading-tight">
                    <span className="text-m font-semibold">s3cNS</span>
                    <span className="text-[12px] text-muted-foreground">
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

                  {!loading && (
                    user ? (
                      <>
                        <NotificationBell />
                        <Button size="sm" variant="outline" onClick={handleLogout}>
                          Logout
                        </Button>
                      </>
                    ) : (
                      <Link href="/login">
                        <Button size="sm" variant="outline">
                          Sign in
                        </Button>
                      </Link>
                    )
                  )}
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
                <div className="flex max-w-xl flex-1 items-center justify-between rounded-full border border-blue-200/60 bg-white/90 px-5 py-2.5 shadow-xl shadow-blue-500/5 dark:bg-zinc-900/90 dark:border-white/10">
                  <div className="flex items-center gap-3">
                    <img src="/logo/s3cnsLogo.svg" alt="s3cNS Logo" className="h-8 w-8 rounded-lg shadow-sm font-black" />
                    <div className="flex flex-col leading-tight">
                      <span className="text-xs font-black tracking-tight text-slate-900 dark:text-white"></span>
                    </div>
                  </div>
                  <nav className="flex items-center gap-6 text-[13px] font-bold">
                    {navLinks.map((link) => {
                      const active = pathname === link.href
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          className={cn(
                            "transition-colors",
                            active
                              ? 'text-blue-600 dark:text-blue-400'
                              : 'text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-200'
                          )}
                        >
                          {link.label}
                        </Link>
                      )
                    })}

                    {!loading && (
                      user ? (
                        <>
                          <NotificationBell />
                          <Button size="sm" onClick={handleLogout}>
                            Logout
                          </Button>
                        </>
                      ) : (
                        <Link href="/login">
                          <Button size="sm">
                            Sign in
                          </Button>
                        </Link>
                      )
                    )}
                  </nav>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* MOBILE */}
        <div className={cn(
          "flex h-14 items-center justify-between sm:hidden px-2 transition-all duration-300",
          scrolled && "bg-white/80 dark:bg-[#030712]/80 backdrop-blur-md border-b border-slate-200/60 dark:border-white/5"
        )}>
          <div className="flex items-center gap-3">
            <img src="/logo/s3cnsLogo.svg" alt="s3cNS Logo" className="h-8 w-8 rounded-lg shadow-sm" />
            <span className="text-sm font-black tracking-tight text-slate-900 dark:text-white">s3cNS</span>
          </div>
          <MobileNav />
        </div>
      </div>
    </header>
  )
}
