'use client'

import React from 'react'
import type { OutboundConference } from './types'

export function PrintOverview({ conference }: { conference: OutboundConference }) {
  if (!conference) return null;
  const approved = conference.delegates.filter(d => d.status === 'APPROVED')

  return (
    <div className="space-y-8">
      {/* Conference Details */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-xs font-black uppercase text-slate-500 mb-1">Conference</h3>
          <p className="text-lg font-bold">{conference.name}</p>
        </div>
        <div>
          <h3 className="text-xs font-black uppercase text-slate-500 mb-1">Venue</h3>
          <p className="text-lg font-bold">{conference.venue || 'N/A'}</p>
        </div>
        <div className="col-span-2">
          <h3 className="text-xs font-black uppercase text-slate-500 mb-1">Dates</h3>
          <p className="font-medium text-sm">
            {conference.dates?.length 
              ? conference.dates.map(d => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })).join(' · ') 
              : 'No dates set'}
          </p>
        </div>
      </div>

      {/* Member Roster */}
      <div>
        <h3 className="text-lg font-black mb-3 pb-1 border-b border-slate-200">
          Official Delegation Roster ({approved.length} approved members)
        </h3>
        <table className="w-full text-left border-collapse border border-slate-300">
          <thead>
            <tr className="bg-slate-100">
              <th className="border border-slate-300 p-2 text-xs font-black uppercase">Name</th>
              <th className="border border-slate-300 p-2 text-xs font-black uppercase">Dept / Sem</th>
              <th className="border border-slate-300 p-2 text-xs font-black uppercase">Allotted Committee</th>
              <th className="border border-slate-300 p-2 text-xs font-black uppercase">Allotted Portfolio</th>
            </tr>
          </thead>
          <tbody>
            {approved.map((d) => (
              <tr key={d._id}>
                <td className="border border-slate-300 p-2 text-sm font-bold">{d.fullName}</td>
                <td className="border border-slate-300 p-2 text-sm">{[d.dept, d.semester].filter(Boolean).join(' - ')}</td>
                <td className="border border-slate-300 p-2 text-sm">{d.committeeReceived || '-'}</td>
                <td className="border border-slate-300 p-2 text-sm">{d.portfolioReceived || '-'}</td>
              </tr>
            ))}
            {approved.length === 0 && (
              <tr>
                <td colSpan={4} className="border border-slate-300 p-4 text-center text-sm italic text-slate-500">
                  No approved members yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function PrintAttendance({ conference }: { conference: OutboundConference }) {
  if (!conference) return null;
  const approved = conference.delegates.filter(d => d.status === 'APPROVED')
  const dates = conference.dates ?? [];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-black pb-1 border-b border-slate-200">
        Attendance Sheet
      </h3>
      <table className="w-full text-left border-collapse border border-slate-300 text-sm">
        <thead>
          <tr className="bg-slate-100">
            <th className="border border-slate-300 p-2 text-xs font-black uppercase whitespace-nowrap">Delegate</th>
            {dates.map((date) => (
              <th key={date} className="border border-slate-300 p-2 text-center text-xs font-black uppercase whitespace-nowrap">
                {new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {approved.map((d) => (
            <tr key={d._id}>
              <td className="border border-slate-300 p-2">
                <div className="font-bold">{d.fullName}</div>
                <div className="text-[10px] text-slate-500">{[d.dept, d.semester].filter(Boolean).join(' - ')}</div>
              </td>
              {dates.map(date => {
                const val = d.attendanceDays?.[date]
                return (
                  <td key={date} className="border border-slate-300 p-2 text-center font-bold">
                    {val === 'PRESENT' ? 'P' : val === 'ABSENT' ? 'A' : ''}
                  </td>
                )
              })}
            </tr>
          ))}
          {approved.length === 0 && (
            <tr>
              <td colSpan={dates.length + 1} className="border border-slate-300 p-4 text-center italic text-slate-500">
                No approved members yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
