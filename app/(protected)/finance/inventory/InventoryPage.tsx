'use client'

import { useEffect, useMemo, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { useAppUser } from '@/hooks/useAppUser'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

// ─── Types ─────────────────────────────────────────────────────────────────

type AssetCondition = 'GOOD' | 'FAIR' | 'DAMAGED' | 'LOST'
type CheckoutStatus = 'OUT' | 'RETURNED' | 'LOST' | 'DAMAGED'

interface Asset {
    _id: string
    name: string
    category: string
    totalQuantity: number
    availableQuantity: number
    condition: AssetCondition
    location?: string | null
    notes?: string | null
    createdAt: string
}

interface Checkout {
    _id: string
    assetId: string
    memberUid: string
    eventName?: string | null
    quantity: number
    checkedOutAt: string
    dueBackAt?: string | null
    returnedAt?: string | null
    status: CheckoutStatus
    notes?: string | null
}

// ─── Constants ─────────────────────────────────────────────────────────────

const ASSET_CATEGORIES = [
    'GENERAL', 'ELECTRONICS', 'STATIONERY', 'FURNITURE',
    'AV_EQUIPMENT', 'COSTUME', 'SPORT', 'OTHER',
]

const CONDITIONS: AssetCondition[] = ['GOOD', 'FAIR', 'DAMAGED', 'LOST']
const CHECKOUT_STATUSES: CheckoutStatus[] = ['OUT', 'RETURNED', 'LOST', 'DAMAGED']

// ─── Motion variants (same as finance ledger) ──────────────────────────────

const pageStagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
}

const fadeInUp = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0 },
}

const scaleIn = {
    hidden: { opacity: 0, scale: 0.96 },
    visible: { opacity: 1, scale: 1 },
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function fmtDate(d: string | null | undefined) {
    if (!d) return '–'
    return new Date(d).toLocaleDateString('en-IN')
}

function ConditionPill({ condition }: { condition: AssetCondition }) {
    const colors: Record<AssetCondition, string> = {
        GOOD: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        FAIR: 'bg-amber-50 text-amber-800 border-amber-200',
        DAMAGED: 'bg-rose-50 text-rose-800 border-rose-200',
        LOST: 'bg-slate-100 text-slate-700 border-slate-200',
    }
    return (
        <span className={cn('inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide', colors[condition])}>
            {condition}
        </span>
    )
}

function StatusPill({ status }: { status: CheckoutStatus }) {
    const colors: Record<CheckoutStatus, string> = {
        OUT: 'bg-sky-50 text-sky-800 border-sky-200',
        RETURNED: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        LOST: 'bg-rose-50 text-rose-800 border-rose-200',
        DAMAGED: 'bg-amber-50 text-amber-800 border-amber-200',
    }
    return (
        <span className={cn('inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide', colors[status])}>
            {status}
        </span>
    )
}

// ─── Main Component ─────────────────────────────────────────────────────────

export function InventoryPage() {
    const router = useRouter()
    const { user: fbUser, loading: authLoading } = useAuth()
    const { user: appUser, loading: appLoading } = useAppUser()

    const [assets, setAssets] = useState<Asset[]>([])
    const [checkouts, setCheckouts] = useState<Checkout[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Tab state
    const [activeTab, setActiveTab] = useState<'assets' | 'checkouts'>('assets')

    // Filter state
    const [search, setSearch] = useState('')
    const [conditionFilter, setConditionFilter] = useState('ALL')
    const [statusFilter, setStatusFilter] = useState('ALL')

    // Drawer state
    const [drawerMode, setDrawerMode] = useState<'addAsset' | 'editAsset' | 'checkout' | null>(null)
    const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)
    const [saving, setSaving] = useState(false)
    const [formError, setFormError] = useState<string | null>(null)
    const [deleteConfirm, setDeleteConfirm] = useState<Asset | null>(null)
    const [deleting, setDeleting] = useState(false)

    // Form state – asset
    const [fName, setFName] = useState('')
    const [fCategory, setFCategory] = useState('GENERAL')
    const [fTotalQty, setFTotalQty] = useState('1')
    const [fAvailQty, setFAvailQty] = useState('1')
    const [fCondition, setFCondition] = useState<AssetCondition>('GOOD')
    const [fLocation, setFLocation] = useState('')
    const [fNotes, setFNotes] = useState('')

    // Form state – checkout
    const [fMemberUid, setFMemberUid] = useState('')
    const [fEventName, setFEventName] = useState('')
    const [fQty, setFQty] = useState('1')
    const [fDueBack, setFDueBack] = useState('')
    const [fCheckoutNotes, setFCheckoutNotes] = useState('')

    // Permission
    const isAllowed = useMemo(() => {
        if (!appUser) return false
        const leadership = ['PRESIDENT', 'SECRETARY_GENERAL', 'DIRECTOR_GENERAL']
        return (
            leadership.includes(appUser.secretariatRole) ||
            appUser.role === 'ADMIN' ||
            appUser.office === 'LOGISTICS' ||
            appUser.office === 'FINANCE'
        )
    }, [appUser])

    // ── Data fetching ──────────────────────────────────────────────────────────

    const loadData = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)
            const [aRes, cRes] = await Promise.all([
                fetch('/api/inventory').then(r => r.json()),
                fetch('/api/inventory/checkouts').then(r => r.json()),
            ])
            setAssets(aRes.assets ?? [])
            setCheckouts(cRes.checkouts ?? [])
        } catch (e: any) {
            setError(e?.message || 'Could not load inventory')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        if (authLoading || appLoading) return
        if (!fbUser || !appUser) {
            router.replace('/login?from=/finance/inventory')
            return
        }
        if (!isAllowed) {
            setError('You do not have permission to access Inventory.')
            setLoading(false)
            return
        }
        loadData()
    }, [authLoading, appLoading, fbUser, appUser, isAllowed, router, loadData])

    // ── Derived data ───────────────────────────────────────────────────────────

    const filteredAssets = useMemo(() => assets.filter(a => {
        const matchSearch = !search || a.name.toLowerCase().includes(search.toLowerCase()) || a.category.toLowerCase().includes(search.toLowerCase()) || (a.location ?? '').toLowerCase().includes(search.toLowerCase())
        const matchCond = conditionFilter === 'ALL' || a.condition === conditionFilter
        return matchSearch && matchCond
    }), [assets, search, conditionFilter])

    const filteredCheckouts = useMemo(() => checkouts.filter(c => {
        const matchSearch = !search || c.memberUid.toLowerCase().includes(search.toLowerCase()) || (c.eventName ?? '').toLowerCase().includes(search.toLowerCase())
        const matchStatus = statusFilter === 'ALL' || c.status === statusFilter
        return matchSearch && matchStatus
    }), [checkouts, search, statusFilter])

    // ── Stats ──────────────────────────────────────────────────────────────────

    const totalItems = assets.reduce((s, a) => s + a.totalQuantity, 0)
    const availItems = assets.reduce((s, a) => s + a.availableQuantity, 0)
    const outCount = checkouts.filter(c => c.status === 'OUT').length

    // ── Drawer helpers ─────────────────────────────────────────────────────────

    function openAddAsset() {
        setFName(''); setFCategory('GENERAL'); setFTotalQty('1'); setFAvailQty('1')
        setFCondition('GOOD'); setFLocation(''); setFNotes(''); setFormError(null)
        setSelectedAsset(null); setDrawerMode('addAsset')
    }

    function openEditAsset(a: Asset) {
        setFName(a.name); setFCategory(a.category); setFTotalQty(String(a.totalQuantity))
        setFAvailQty(String(a.availableQuantity)); setFCondition(a.condition)
        setFLocation(a.location ?? ''); setFNotes(a.notes ?? ''); setFormError(null)
        setSelectedAsset(a); setDrawerMode('editAsset')
    }

    function openCheckout(a: Asset) {
        setFMemberUid(''); setFEventName(''); setFQty('1'); setFDueBack(''); setFCheckoutNotes('')
        setFormError(null); setSelectedAsset(a); setDrawerMode('checkout')
    }

    function closeDrawer() { if (!saving) setDrawerMode(null) }

    // ── Save handlers ──────────────────────────────────────────────────────────

    async function handleSaveAsset() {
        if (!fName.trim()) { setFormError('Name is required.'); return }
        setSaving(true); setFormError(null)
        try {
            const body = {
                name: fName.trim(), category: fCategory,
                totalQuantity: Number(fTotalQty), availableQuantity: Number(fAvailQty),
                condition: fCondition, location: fLocation || null, notes: fNotes || null,
            }
            const url = drawerMode === 'editAsset' ? `/api/inventory/${selectedAsset!._id}` : '/api/inventory'
            const method = drawerMode === 'editAsset' ? 'PATCH' : 'POST'
            const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
            const json = await res.json()
            if (!res.ok) throw new Error(json.error)
            setDrawerMode(null)
            loadData()
        } catch (e: any) {
            setFormError(e?.message || 'Could not save asset.')
        } finally { setSaving(false) }
    }

    async function handleCreateCheckout() {
        if (!fMemberUid.trim()) { setFormError('Member UID is required.'); return }
        if (Number(fQty) > (selectedAsset?.availableQuantity ?? 0)) {
            setFormError(`Only ${selectedAsset?.availableQuantity} unit(s) available.`); return
        }
        setSaving(true); setFormError(null)
        try {
            const res = await fetch('/api/inventory/checkouts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    assetId: selectedAsset!._id, memberUid: fMemberUid.trim(),
                    eventName: fEventName || null, quantity: Number(fQty),
                    dueBackAt: fDueBack || null, notes: fCheckoutNotes || null,
                }),
            })
            const json = await res.json()
            if (!res.ok) throw new Error(json.error)
            setDrawerMode(null)
            loadData()
        } catch (e: any) {
            setFormError(e?.message || 'Could not create checkout.')
        } finally { setSaving(false) }
    }

    async function handleReturn(c: Checkout) {
        await fetch(`/api/inventory/checkouts/${c._id}`, {
            method: 'PATCH', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'RETURNED' }),
        })
        loadData()
    }

    async function handleDeleteAsset() {
        if (!deleteConfirm) return
        setDeleting(true)
        await fetch(`/api/inventory/${deleteConfirm._id}`, { method: 'DELETE' })
        setDeleteConfirm(null)
        setDeleting(false)
        loadData()
    }

    // ── Loading / auth guards ──────────────────────────────────────────────────

    if (authLoading || appLoading || loading) {
        return (
            <div className="space-y-2">
                <div className="h-6 w-40 animate-pulse rounded bg-muted" />
                <div className="h-4 w-64 animate-pulse rounded bg-muted" />
            </div>
        )
    }

    if (!fbUser || !appUser) {
        return (
            <div className="space-y-2">
                <h1 className="text-xl font-semibold">You are not signed in</h1>
                <p className="text-sm text-muted-foreground">Sign in to access Inventory.</p>
            </div>
        )
    }

    if (!isAllowed) {
        return (
            <div className="space-y-2">
                <h1 className="text-xl font-semibold">Access restricted</h1>
                <p className="text-sm text-muted-foreground">Inventory is only available to Logistics, Finance, and Senior Secretariat.</p>
            </div>
        )
    }

    // ── Main render ────────────────────────────────────────────────────────────

    return (
        <motion.div className="space-y-5" initial="hidden" animate="visible" variants={pageStagger}>

            {/* Header */}
            <motion.div
                variants={scaleIn}
                className="flex flex-col gap-3 rounded-2xl border bg-gradient-to-r from-slate-50 via-background to-sky-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-5 dark:from-slate-900/40 dark:to-sky-900/10"
            >
                <div className="space-y-1.5">
                    <p className="text-xs font-medium uppercase tracking-wide text-sky-700/80 dark:text-sky-400/80">
                        Finance · Inventory
                    </p>
                    <h1 className="text-xl font-semibold sm:text-2xl">Asset & Equipment Registry</h1>
                    <p className="text-xs text-muted-foreground sm:text-sm">
                        Track physical assets, manage checkouts, and monitor availability.
                    </p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" onClick={loadData}>Refresh</Button>
                    <Button size="sm" onClick={openAddAsset}>Add asset</Button>
                </div>
            </motion.div>

            {/* Stats */}
            <motion.div variants={fadeInUp} className="grid grid-cols-3 gap-3">
                {[
                    { label: 'Asset Types', value: assets.length },
                    { label: 'Total Items', value: totalItems },
                    { label: 'Checked Out', value: outCount },
                ].map(s => (
                    <Card key={s.label} className="rounded-2xl border bg-card/80 px-4 py-3 shadow-sm">
                        <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{s.label}</p>
                        <p className="mt-1 text-2xl font-semibold">{s.value}</p>
                    </Card>
                ))}
            </motion.div>

            {/* Tabs */}
            <motion.div
                variants={fadeInUp}
                className="flex flex-wrap gap-2 rounded-full border bg-muted/60 px-1.5 py-1.5 text-xs w-fit"
            >
                {([
                    { id: 'assets', label: 'Assets' },
                    { id: 'checkouts', label: 'Checkout Log' },
                ] as const).map(tab => {
                    const active = activeTab === tab.id
                    return (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => { setActiveTab(tab.id); setSearch('') }}
                            className={cn(
                                'rounded-full px-3 py-1.5 transition-colors',
                                active ? 'bg-slate-900 text-slate-50 dark:bg-slate-100 dark:text-slate-900' : 'text-muted-foreground hover:text-foreground',
                            )}
                        >
                            {tab.label}
                        </button>
                    )
                })}
            </motion.div>

            {/* Filters */}
            <motion.div variants={fadeInUp}>
                <Card className="rounded-2xl border bg-card/80 p-4 shadow-sm sm:p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-wrap items-center gap-2">
                            <div className="relative">
                                <Input
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder={activeTab === 'assets' ? 'Search by name, category, location…' : 'Search by member or event…'}
                                    className="h-8 w-52 pr-8 text-xs sm:w-64"
                                />
                                <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-[11px] text-muted-foreground">⌘K</span>
                            </div>

                            {activeTab === 'assets' ? (
                                <select
                                    value={conditionFilter}
                                    onChange={e => setConditionFilter(e.target.value)}
                                    className="h-8 rounded-full border bg-background px-2 text-[11px]"
                                >
                                    <option value="ALL">All conditions</option>
                                    {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            ) : (
                                <select
                                    value={statusFilter}
                                    onChange={e => setStatusFilter(e.target.value)}
                                    className="h-8 rounded-full border bg-background px-2 text-[11px]"
                                >
                                    <option value="ALL">All statuses</option>
                                    {CHECKOUT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            )}
                        </div>
                    </div>

                    {/* ── Assets table ── */}
                    {activeTab === 'assets' && (
                        <div className="mt-4 overflow-hidden rounded-xl border bg-background">
                            <div className="max-h-[480px] overflow-auto">
                                <table className="min-w-full border-collapse text-xs">
                                    <thead className="bg-muted/60 text-[11px] uppercase tracking-wide text-muted-foreground">
                                        <tr>
                                            <th className="border-b px-3 py-2 text-left">Name</th>
                                            <th className="border-b px-3 py-2 text-left">Category</th>
                                            <th className="border-b px-3 py-2 text-left">Location</th>
                                            <th className="border-b px-3 py-2 text-center">Total</th>
                                            <th className="border-b px-3 py-2 text-center">Available</th>
                                            <th className="border-b px-3 py-2 text-left">Condition</th>
                                            <th className="border-b px-3 py-2 text-left">Notes</th>
                                            <th className="border-b px-3 py-2 text-left">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredAssets.length === 0 && (
                                            <tr>
                                                <td colSpan={8} className="px-3 py-4 text-center text-[11px] text-muted-foreground">
                                                    No assets match your filters yet.
                                                </td>
                                            </tr>
                                        )}
                                        {filteredAssets.map(a => (
                                            <tr key={a._id} className="border-t text-[11px] hover:bg-muted/40">
                                                <td className="px-3 py-2 font-medium">{a.name}</td>
                                                <td className="px-3 py-2">{a.category.replace('_', ' ')}</td>
                                                <td className="px-3 py-2">{a.location || <span className="text-muted-foreground">–</span>}</td>
                                                <td className="px-3 py-2 text-center">{a.totalQuantity}</td>
                                                <td className="px-3 py-2 text-center">
                                                    <span className={cn('font-semibold', a.availableQuantity === 0 ? 'text-rose-600' : 'text-emerald-700')}>
                                                        {a.availableQuantity}
                                                    </span>
                                                </td>
                                                <td className="px-3 py-2"><ConditionPill condition={a.condition} /></td>
                                                <td className="px-3 py-2 max-w-[140px] truncate">{a.notes || <span className="text-muted-foreground">–</span>}</td>
                                                <td className="px-3 py-2">
                                                    <div className="flex items-center gap-1">
                                                        <button
                                                            onClick={() => openCheckout(a)}
                                                            disabled={a.availableQuantity === 0}
                                                            className="rounded border border-sky-200 bg-sky-50 px-2 py-0.5 text-[10px] font-semibold text-sky-700 hover:bg-sky-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                                        >
                                                            Checkout
                                                        </button>
                                                        <button
                                                            onClick={() => openEditAsset(a)}
                                                            className="rounded border border-slate-200 px-2 py-0.5 text-[10px] font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => setDeleteConfirm(a)}
                                                            className="rounded border border-rose-200 px-2 py-0.5 text-[10px] font-medium text-rose-600 hover:bg-rose-50 transition-colors"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* ── Checkouts table ── */}
                    {activeTab === 'checkouts' && (
                        <div className="mt-4 overflow-hidden rounded-xl border bg-background">
                            <div className="max-h-[480px] overflow-auto">
                                <table className="min-w-full border-collapse text-xs">
                                    <thead className="bg-muted/60 text-[11px] uppercase tracking-wide text-muted-foreground">
                                        <tr>
                                            <th className="border-b px-3 py-2 text-left">Asset</th>
                                            <th className="border-b px-3 py-2 text-left">Member UID</th>
                                            <th className="border-b px-3 py-2 text-center">Qty</th>
                                            <th className="border-b px-3 py-2 text-left">Event</th>
                                            <th className="border-b px-3 py-2 text-left">Checked Out</th>
                                            <th className="border-b px-3 py-2 text-left">Due Back</th>
                                            <th className="border-b px-3 py-2 text-left">Status</th>
                                            <th className="border-b px-3 py-2 text-left">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredCheckouts.length === 0 && (
                                            <tr>
                                                <td colSpan={8} className="px-3 py-4 text-center text-[11px] text-muted-foreground">
                                                    No checkout records match your filters.
                                                </td>
                                            </tr>
                                        )}
                                        {filteredCheckouts.map(c => {
                                            const asset = assets.find(a => a._id === c.assetId)
                                            return (
                                                <tr key={c._id} className="border-t text-[11px] hover:bg-muted/40">
                                                    <td className="px-3 py-2 font-medium">{asset?.name ?? '—'}</td>
                                                    <td className="px-3 py-2 font-mono">{c.memberUid.slice(0, 14)}…</td>
                                                    <td className="px-3 py-2 text-center font-semibold">{c.quantity}</td>
                                                    <td className="px-3 py-2">{c.eventName || <span className="text-muted-foreground">–</span>}</td>
                                                    <td className="px-3 py-2">{fmtDate(c.checkedOutAt)}</td>
                                                    <td className="px-3 py-2">{fmtDate(c.dueBackAt)}</td>
                                                    <td className="px-3 py-2"><StatusPill status={c.status} /></td>
                                                    <td className="px-3 py-2">
                                                        {c.status === 'OUT' && (
                                                            <button
                                                                onClick={() => handleReturn(c)}
                                                                className="rounded border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 hover:bg-emerald-100 transition-colors"
                                                            >
                                                                Mark Returned
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {error && <p className="mt-3 text-[11px] font-medium text-destructive">{error}</p>}
                </Card>
            </motion.div>

            {/* ── Side drawer ── */}
            {drawerMode && (
                <div className="fixed inset-0 z-40 flex justify-end bg-black/30 backdrop-blur-sm">
                    <div className="absolute inset-0" onClick={closeDrawer} />
                    <motion.div
                        initial={{ x: 360, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 360, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 280, damping: 26 }}
                        className="relative z-50 flex h-full w-full max-w-sm flex-col border-l bg-card p-4 shadow-xl sm:p-5"
                    >
                        {/* Drawer header */}
                        <div className="flex items-center justify-between gap-2">
                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                    {drawerMode === 'addAsset' ? 'New asset' : drawerMode === 'editAsset' ? 'Edit asset' : 'Checkout asset'}
                                </p>
                                <p className="text-sm font-semibold">
                                    {drawerMode === 'checkout'
                                        ? `Checking out: ${selectedAsset?.name}`
                                        : drawerMode === 'editAsset'
                                            ? selectedAsset?.name
                                            : 'Register a new inventory item'}
                                </p>
                            </div>
                            <Button size="icon" variant="ghost" onClick={closeDrawer}>✕</Button>
                        </div>

                        {/* Asset form */}
                        {(drawerMode === 'addAsset' || drawerMode === 'editAsset') && (
                            <div className="mt-4 space-y-3 text-xs flex-1 overflow-y-auto">
                                <div className="space-y-1">
                                    <Label htmlFor="fName">Name *</Label>
                                    <Input id="fName" value={fName} onChange={e => setFName(e.target.value)} placeholder="e.g. HDMI Cable" />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <Label htmlFor="fCategory">Category</Label>
                                        <select id="fCategory" value={fCategory} onChange={e => setFCategory(e.target.value)} className="h-8 w-full rounded-md border bg-background px-2 text-xs">
                                            {ASSET_CATEGORIES.map(c => <option key={c} value={c}>{c.replace('_', ' ')}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="fCondition">Condition</Label>
                                        <select id="fCondition" value={fCondition} onChange={e => setFCondition(e.target.value as AssetCondition)} className="h-8 w-full rounded-md border bg-background px-2 text-xs">
                                            {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <Label htmlFor="fTotalQty">Total Qty *</Label>
                                        <Input id="fTotalQty" type="number" min="0" value={fTotalQty} onChange={e => setFTotalQty(e.target.value)} />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="fAvailQty">Available Qty *</Label>
                                        <Input id="fAvailQty" type="number" min="0" value={fAvailQty} onChange={e => setFAvailQty(e.target.value)} />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="fLocation">Location</Label>
                                    <Input id="fLocation" value={fLocation} onChange={e => setFLocation(e.target.value)} placeholder="e.g. Storeroom B, Shelf 3" />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="fNotes">Notes</Label>
                                    <Input id="fNotes" value={fNotes} onChange={e => setFNotes(e.target.value)} placeholder="Any additional notes…" />
                                </div>
                            </div>
                        )}

                        {/* Checkout form */}
                        {drawerMode === 'checkout' && (
                            <div className="mt-4 space-y-3 text-xs flex-1 overflow-y-auto">
                                <div className="rounded-lg border bg-sky-50/60 px-3 py-2 text-[11px] dark:bg-sky-900/10">
                                    <span className="font-semibold text-sky-700 dark:text-sky-300">{selectedAsset?.availableQuantity}</span>
                                    <span className="text-muted-foreground ml-1">of {selectedAsset?.totalQuantity} units available</span>
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="fMemberUid">Member UID (Firebase) *</Label>
                                    <Input id="fMemberUid" value={fMemberUid} onChange={e => setFMemberUid(e.target.value)} placeholder="uid_abc123…" />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <Label htmlFor="fQty">Quantity *</Label>
                                        <Input id="fQty" type="number" min="1" max={selectedAsset?.availableQuantity} value={fQty} onChange={e => setFQty(e.target.value)} />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="fDueBack">Due Back</Label>
                                        <Input id="fDueBack" type="date" value={fDueBack} onChange={e => setFDueBack(e.target.value)} />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="fEventName">Event (optional)</Label>
                                    <Input id="fEventName" value={fEventName} onChange={e => setFEventName(e.target.value)} placeholder="e.g. Annual Fest 2026" />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="fCheckoutNotes">Notes</Label>
                                    <Input id="fCheckoutNotes" value={fCheckoutNotes} onChange={e => setFCheckoutNotes(e.target.value)} />
                                </div>
                            </div>
                        )}

                        {formError && <p className="mt-2 text-[11px] font-medium text-destructive">{formError}</p>}

                        <div className="mt-auto flex items-center justify-between pt-4 text-xs">
                            <p className="text-muted-foreground">
                                {drawerMode === 'checkout' ? 'Available quantity will be updated immediately.' : 'This entry will appear in the assets list.'}
                            </p>
                            <Button
                                size="sm"
                                onClick={drawerMode === 'checkout' ? handleCreateCheckout : handleSaveAsset}
                                disabled={saving}
                            >
                                {saving ? 'Saving…' : drawerMode === 'checkout' ? 'Confirm Checkout' : 'Save'}
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Delete confirm drawer */}
            {deleteConfirm && (
                <div className="fixed inset-0 z-40 flex justify-end bg-black/30 backdrop-blur-sm">
                    <div className="absolute inset-0" onClick={() => !deleting && setDeleteConfirm(null)} />
                    <motion.div
                        initial={{ x: 360, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 280, damping: 26 }}
                        className="relative z-50 flex h-full w-full max-w-sm flex-col border-l bg-card p-4 shadow-xl sm:p-5"
                    >
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Confirm deletion</p>
                        <p className="mt-1 text-sm font-semibold">Delete "{deleteConfirm.name}"?</p>
                        <p className="mt-2 text-[11px] text-muted-foreground">This will permanently remove the asset record. Existing checkout records referencing this asset won't be deleted.</p>
                        <div className="mt-auto flex gap-2 pt-4">
                            <Button variant="outline" className="flex-1" onClick={() => !deleting && setDeleteConfirm(null)}>Cancel</Button>
                            <Button variant="destructive" className="flex-1" onClick={handleDeleteAsset} disabled={deleting}>
                                {deleting ? 'Deleting…' : 'Delete'}
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}

        </motion.div>
    )
}
