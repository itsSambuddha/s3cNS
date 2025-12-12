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

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/events', label: 'Events' },   // placeholder
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
                <div className="mt-2 flex items-center gap-2">
                  {/* <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
                    S3
                    
                  </span> */}
                  <img src="/logo/s3cnsLogo.svg" alt="s3cNS Logo" className="mt-2 h-15 w-25 rounded-lg"/>
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
                <div className="flex max-w-xl flex-1 items-center justify-between rounded-full border bg-background px-5 py-2 shadow-sm">
                  <div className="flex items-center gap-2">
<img src="/logo/s3cnsLogo.svg" alt="s3cNS Logo" className="mt-2 h-10 w-25 rounded-lg"/>
                    <div className="flex flex-col leading-tight">
                      {/* <span className="text-sm font-semibold">s3cNS</span>
                      <span className="text-[10px] text-muted-foreground">
                        SECMUN Platform
                      </span> */}
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
        <div className="flex h-14 items-center justify-between sm:hidden">
          <div className="flex items-center gap-2">
<img src="/logo/s3cnsLogo.svg" alt="s3cNS Logo" className="mt-2 h-10 w-25 rounded-lg"/>
            <span className="text-sm font-semibold">s3cNS</span>
          </div>
          <MobileNav />
        </div>
      </div>
    </header>
  )
}
