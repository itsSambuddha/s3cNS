// components/layout/Sidebar.tsx
"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"
import { useAppUser } from "@/hooks/useAppUser"
import {
  IconLayoutDashboard,
  IconCalendarTime,
  IconCurrencyRupee,
  IconFileText,
  IconNews,
  IconTrophy,
  IconUsersGroup,
  IconShield,
  IconMessage,
} from "@tabler/icons-react"

const baseLinks = [
  { href: "/dashboard", label: "Overview", icon: IconLayoutDashboard },
  { href: "/timetable", label: "Timetable", icon: IconCalendarTime },
  { href: "/finance/records?tab=budgets", label: "Budget", icon: IconCurrencyRupee },

  // { href: "/documents", label: "Documents", icon: IconFileText },
  { href: "/news", label: "News", icon: IconNews },
  { href: "/chat", label: "Chat", icon: IconMessage },
  { href: "/achievements", label: "Achievements", icon: IconTrophy },
  // { href: "/directory", label: "Directory", icon: IconUsersGroup },
]

// Secretariat-only links; shown only when user has a secretariatRole
const secretariatLinks = [
  { href: "/secretariat/directory", label: "Secretariat Directory" },

  { href: "/profile", label: "Edit My profile" },
]

// Admin-only links; shown only when role === "ADMIN"
const adminLinks = [
  { href: "/admin", label: "Admin Controls", icon: IconShield },
  { href: "/secretariat/usg-approvals", label: "Secretariat Approvals", icon: IconShield },
]

type AnyLink = {
  href: string
  label: string
  icon?: React.ComponentType<any>
  section?: "Navigation" | "Secretariat" | "Admin"
}

type DbUser = {
  role?: string | null
  secretariatRole?: string | null   // must match your Mongo field name
}

// dbUser should be null when logged out
export default function Sidebar() {
  const pathname = usePathname()
  const [hovered, setHovered] = useState(false)
  const open = hovered
  const { user: appUser, loading } = useAppUser()

  const isLoggedIn = !!appUser
  const isAdmin = appUser && (
    appUser.role === "ADMIN" || 
    appUser.role === "TEACHER" || 
    ["PRESIDENT", "SECRETARY_GENERAL", "DIRECTOR_GENERAL", "TEACHER"].includes(appUser.secretariatRole)
  )
  const isSecretariat = Boolean(appUser?.secretariatRole)

  const allLinks: AnyLink[] = [
    ...baseLinks.map((l) => ({ ...l, section: "Navigation" as const })),
    ...(isLoggedIn && isSecretariat
      ? secretariatLinks.map((l) => ({
        ...l,
        icon: IconUsersGroup,
        section: "Secretariat" as const,
      }))
      : []),
    ...(isLoggedIn && isAdmin
      ? adminLinks.map((l) => ({ ...l, section: "Admin" as const }))
      : []),
  ]

  if (!allLinks.length) return null

  return (
    <aside className="hidden h-screen shrink-0 sm:block">
      <motion.div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        animate={{ width: open ? 260 : 80 }}
        className={cn(
          "relative flex h-full flex-col overflow-hidden border-r transition-all duration-500",
          "border-slate-200 bg-white/80 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl",
          "dark:border-white/5 dark:bg-[#030712]/80 dark:shadow-[0_18px_60px_rgba(0,0,0,0.5)]",
        )}
      >
        {/* Grainy Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay dark:opacity-[0.05]"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3BaseFilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/baseFilter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
        {/* logo */}
        <div className="px-3 pt-4">
          {open ? <Logo /> : <LogoIcon />}
        </div>

        {/* links */}
        <div className="mt-4 flex-1 overflow-y-auto px-2 pb-4">
          <Section
            title="Navigation"
            showTitle={open}
            links={allLinks.filter((l) => l.section === "Navigation")}
            pathname={pathname}
            open={open}
          />

          {isLoggedIn && isSecretariat && (
            <Section
              title="Secretariat"
              showTitle={open}
              links={allLinks.filter((l) => l.section === "Secretariat")}
              pathname={pathname}
              open={open}
            />
          )}

          {isLoggedIn && isAdmin && (
            <Section
              title="Admin Controls"
              showTitle={open}
              links={allLinks.filter((l) => l.section === "Admin")}
              pathname={pathname}
              open={open}
            />
          )}
        </div>

        {/* footer pill intentionally omitted for now */}
      </motion.div>
    </aside>
  )
}

function Section({
  title,
  showTitle,
  links,
  pathname,
  open,
}: {
  title: string
  showTitle: boolean
  links: AnyLink[]
  pathname: string
  open: boolean
}) {
  if (!links.length) return null

  return (
    <div className="mb-4 space-y-1 text-xs">
      {showTitle && (
        <p className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          {title}
        </p>
      )}
      <div className="flex flex-col gap-1">
        {links.map((link) => {
          const active = pathname.startsWith(link.href)
          return (
            <SidebarItem
              key={link.href}
              link={link}
              active={active}
              open={open}
            />
          )
        })}
      </div>
    </div>
  )
}

function SidebarItem({
  link,
  active,
  open,
}: {
  link: AnyLink
  active: boolean
  open: boolean
}) {
  const Icon = link.icon
  return (
    <Link
      href={link.href}
      className={cn(
        "group relative flex items-center gap-3 rounded-2xl px-3 py-2 text-[13px] font-medium transition-all duration-300",
        active
          ? "bg-sky-500/10 text-sky-600 shadow-[inset_0_0_0_1px_rgba(14,165,233,0.1)]"
          : "text-slate-500 hover:bg-slate-100/80 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-white",
      )}
    >
      {active && (
        <motion.div
          layoutId="sidebar-active"
          className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-full bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.8)]"
        />
      )}
      {Icon && (
        <Icon
          className={cn(
            "h-4 w-4 shrink-0 transition-transform group-hover:scale-110",
            active ? "text-sky-600" : "text-slate-400 dark:text-zinc-500",
          )}
        />
      )}
      {open && <span className="truncate">{link.label}</span>}
    </Link>
  )
}

const Logo = () => (
  <a
    href="/dashboard"
    className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-slate-900 dark:text-slate-50"
  >
    <img src="/logo/s3cnsLogo.svg" alt="s3cNS Logo" width={32} height={32} className="rounded-md" />

    {/* <div className="h-6 w-7 shrink-0 rounded-tl-xl rounded-tr-sm rounded-br-xl rounded-bl-sm bg-slate-900 dark:bg-slate-50" /> */}
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="whitespace-pre text-sm font-black tracking-tight text-slate-900 dark:text-white"
    >
      s3cNS
    </motion.span>
  </a>
)

const LogoIcon = () => (
  <a
    href="/dashboard"
    className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-slate-900 dark:text-slate-50"
  >
    <img src="/logo/s3cnsLogo.svg" alt="s3cNS Logo" width={32} height={32} className="rounded-md" />
    {/* <div className="h-6 w-7 shrink-0 rounded-tl-xl rounded-tr-sm rounded-br-xl rounded-bl-sm bg-slate-900 dark:bg-slate-50" /> */}
  </a>
)
