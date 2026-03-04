// app/api/inventory/checkouts/[id]/route.ts
import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db/connect'
import { AssetCheckout } from '@/lib/db/models/AssetCheckout'
import { Asset } from '@/lib/db/models/Asset'

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        const body = await req.json()
        const { status, notes } = body

        await connectToDatabase()

        const checkout = await AssetCheckout.findById(id)
        if (!checkout) return NextResponse.json({ error: 'Checkout not found' }, { status: 404 })

        const wasOut = checkout.status === 'OUT'
        const isBeingReturned = status === 'RETURNED' || status === 'LOST' || status === 'DAMAGED'

        checkout.status = status
        if (notes !== undefined) checkout.notes = notes
        if (isBeingReturned && !checkout.returnedAt) {
            checkout.returnedAt = new Date()
        }
        await checkout.save()

        // Restore available quantity if returning
        if (wasOut && isBeingReturned) {
            await Asset.findByIdAndUpdate(checkout.assetId, {
                $inc: { availableQuantity: checkout.quantity },
            })
        }

        return NextResponse.json({ checkout })
    } catch (err: any) {
        console.error('checkout PATCH error', err?.message ?? err)
        return NextResponse.json({ error: 'Failed to update checkout' }, { status: 500 })
    }
}
