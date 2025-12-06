// components/ui/sidebar.tsx
'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '@/lib/utils'

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}

export const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <aside
      ref={ref}
      className={cn(
        'flex h-screen w-56 flex-col bg-card text-card-foreground',
        className
      )}
      {...props}
    />
  )
})
Sidebar.displayName = 'Sidebar'

export const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { label?: string }
>(({ className, label, children, ...props }, ref) => {
  return (
    <div ref={ref} className={cn('flex flex-col gap-y-1 p-2', className)} {...props}>
      {label && (
        <h3 className="mb-1 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">
          {label}
        </h3>
      )}
      <div className="space-y-1">{children}</div>
    </div>
  )
})
SidebarGroup.displayName = 'SidebarGroup'

export const SidebarItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'div'
  return <Comp ref={ref} className={cn('rounded-md', className)} {...props} />
})
SidebarItem.displayName = 'SidebarItem'