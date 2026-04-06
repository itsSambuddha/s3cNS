'use client'

import React from 'react'
import type { OutboundConference } from './types'

interface AppUser {
  fullName: string;
  role: string;
  [key: string]: any;
}

interface PrintLayoutProps {
  title: string
  appUser: AppUser | null | any
  conference: OutboundConference | null
  children: React.ReactNode
}

export function PrintLayout({ title, appUser, conference, children }: PrintLayoutProps) {
  return (
    <div className="w-full bg-white text-black space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b-2 border-slate-800 pb-4">
        {/* Left Logo */}
        <div className="flex flex-col items-center gap-2">
          <img src="/logo/s3cnsLogo.svg" alt="s3cns Logo" className="h-16 w-auto object-contain" />
        </div>
        
        {/* Center Title & Metadata */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-black uppercase tracking-wider">{title}</h1>
          <p className="text-sm font-medium text-slate-700">
            {conference?.name}
            {conference?.venue ? ` at ${conference.venue}` : ''}
          </p>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">
            Printed by {appUser ? `${appUser.displayName || appUser.email} (${appUser.role.replace(/_/g, ' ')}${appUser.secretariatRole && appUser.secretariatRole !== 'MEMBER' && appUser.secretariatRole !== appUser.role ? ' - ' + appUser.secretariatRole.replace(/_/g, ' ') : ''})` : 'System'} • {new Date().toLocaleDateString('en-IN')}
          </p>
        </div>

        {/* Right Logo */}
        <div className="flex flex-col items-center gap-2">
          <img src="/logo/club-logo.png" alt="SECMUN Club Logo" className="h-16 w-auto object-contain" />
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-4">
        {children}
      </div>
    </div>
  )
}
