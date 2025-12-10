// components/layout/Sidebar.tsx
"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "motion/react"

import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/useAuth"

import {
  IconLayoutDashboard,
  IconCalendarTime,
  IconCurrencyRupee,
  IconFileText,
  IconNews,
  IconTrophy,
  IconUsersGroup,
  IconShield,
} from "@tabler/icons-react"

// ----- link definitions -----

const baseLinks = [
  { href: "/dashboard", label: "Overview", icon: IconLayoutDashboard },
  { href: "/timetable", label: "Timetable", icon: IconCalendarTime },
  { href: "/finance/records?tab=budgets", label: "Budget", icon: IconCurrencyRupee },
  { href: "/documents", label: "Documents", icon: IconFileText },
  { href: "/news", label: "News", icon: IconNews },
  { href: "/achievements", label: "Achievements", icon: IconTrophy },
  { href: "/directory", label: "Directory", icon: IconUsersGroup },
]

const secretariatLinks = [
  {
    href: "/secretariat/directory",
    label: "Secretariat Directory",
    requiresApprove: false,
    requiresDefaultRole: false,
  },
  {
    href: "/secretariat/usg-approvals",
    label: "USG Approvals",
    requiresApprove: true,
    requiresDefaultRole: false,
  },
  {
    href: "/secretariat/onboarding",
    label: "Set up profile",
    requiresApprove: false,
    requiresDefaultRole: true,
  },
]

const adminLinks = [{ href: "/admin", label: "Admin", icon: IconShield }]

type AnyLink = {
  href: string
  label: string
  icon?: React.ComponentType<any>
  section?: "Navigation" | "Secretariat" | "Admin"
}

// ----- main sidebar -----

export default function Sidebar() {
  const pathname = usePathname()
  const { user } = useAuth()
  const dbUser = user

  const [hovered, setHovered] = useState(false)
  const open = hovered

  // if you also store secretariatRole in the merged user, you can gate links on it:
  const hasSecretariatRole = !!dbUser?.secretariatRole

  const computedSecretariatLinks = hasSecretariatRole
    ? secretariatLinks // simple: allow all when secretariatRole exists
    : []

  const allLinks: AnyLink[] = [
    ...baseLinks.map((l) => ({ ...l, section: "Navigation" as const })),
    ...computedSecretariatLinks.map((l) => ({
      ...l,
      icon: IconUsersGroup,
      section: "Secretariat" as const,
    })),
    ...(dbUser?.role === "ADMIN"
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
          "relative flex h-full flex-col overflow-hidden border-r",
          "border-white/60 bg-white/70 shadow-[0_18px_60px_rgba(15,23,42,0.16)] backdrop-blur-xl",
          "dark:border-white/10 dark:bg-white/5 dark:shadow-[0_18px_60px_rgba(0,0,0,0.7)]",
        )}
      >
        <div className="pointer-events-none absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-slate-400/40 to-transparent dark:via-slate-500/60" />

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

          {allLinks.some((l) => l.section === "Secretariat") && (
            <Section
              title="Secretariat"
              showTitle={open}
              links={allLinks.filter((l) => l.section === "Secretariat")}
              pathname={pathname}
              open={open}
            />
          )}

          {allLinks.some((l) => l.section === "Admin") && (
            <Section
              title="Admin"
              showTitle={open}
              links={allLinks.filter((l) => l.section === "Admin")}
              pathname={pathname}
              open={open}
            />
          )}
        </div>

        {/* user pill */}
        {dbUser && (
          <div className="border-t border-slate-200/70 px-2 py-3 dark:border-slate-700/70">
            <SidebarUserPill dbUser={dbUser} open={open} />
          </div>
        )}
      </motion.div>
    </aside>
  )
}

// ----- sections & items -----

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
        "group flex items-center gap-2 rounded-xl px-2 py-1.5 text-xs transition-colors",
        active
          ? "bg-sky-500/10 text-sky-600"
          : "text-slate-500 hover:bg-slate-100/80 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/80 dark:hover:text-slate-50",
      )}
    >
      {Icon && (
        <Icon
          className={cn(
            "h-4 w-4 shrink-0",
            active ? "text-sky-600" : "text-slate-400 dark:text-slate-500",
          )}
        />
      )}
      {open && <span className="truncate">{link.label}</span>}
    </Link>
  )
}

// ----- user pill -----

function SidebarUserPill({ dbUser, open }: { dbUser: any; open: boolean }) {
  const name = dbUser.displayName || "Secretariat user"
  const initials = name
    .split(" ")
    .map((p: string) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  const avatarUrl = dbUser.photoURL
  const role = dbUser.role
  const secRole = dbUser.secretariatRole

  return (
    <Link
      href="/profile"
      className="group flex items-center gap-2 rounded-2xl bg-white/80 px-2 py-1.5 text-xs text-slate-800 shadow-sm hover:bg-white dark:bg-slate-800/90 dark:text-slate-100 dark:hover:bg-slate-700"
    >
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={name}
          className="h-7 w-7 shrink-0 rounded-full object-cover"
        />
      ) : (
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-500 text-[11px] font-semibold text-white">
          {initials}
        </div>
      )}

      {open && (
        <div className="flex flex-col">
          <span className="truncate text-[11px] font-medium">{name}</span>
          <span className="text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {role}
            {secRole ? ` • ${secRole}` : ""}
          </span>
        </div>
      )}
    </Link>
  )
}

// ----- logo -----

const Logo = () => (
  <a
    href="/dashboard"
    className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-slate-900 dark:text-slate-50"
  >
    <div className="h-6 w-7 shrink-0 rounded-tl-xl rounded-tr-sm rounded-br-xl rounded-bl-sm bg-slate-900 dark:bg-slate-50" />
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="whitespace-pre text-sm font-semibold tracking-tight"
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
    <div className="h-6 w-7 shrink-0 rounded-tl-xl rounded-tr-sm rounded-br-xl rounded-bl-sm bg-slate-900 dark:bg-slate-50" />
  </a>
)
