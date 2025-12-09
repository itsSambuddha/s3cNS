// app/(protected)/finance/records/page.tsx
import { Suspense } from 'react'
import { FinanceRecordsPage } from './FinanceRecordsPage'

export default function Page() {
  return (
    <Suspense fallback={<div className="space-y-2">
      <div className="h-6 w-40 animate-pulse rounded bg-muted" />
      <div className="h-4 w-64 animate-pulse rounded bg-muted" />
    </div>}>
      <FinanceRecordsPage />
    </Suspense>
  )
}
