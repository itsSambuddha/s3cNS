// app/api/inventory/checkouts/route.ts
import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db/connect'
import { AssetCheckout } from '@/lib/db/models/AssetCheckout'
import { Asset } from '@/lib/db/models/Asset'
import mongoose from 'mongoose'

export async function GET(req: Request) {
    try {
        await connectToDatabase()
        const { searchParams } = new URL(req.url)
        const status = searchParams.get('status')
        const assetId = searchParams.get('assetId')

        const query: Record<string, any> = {}
        if (status) query.status = status
        if (assetId) query.assetId = new mongoose.Types.ObjectId(assetId)

        const checkouts = await AssetCheckout.find(query)
            .sort({ checkedOutAt: -1 })
            .limit(100)
            .lean()

        return NextResponse.json({ checkouts })
    } catch (err: any) {
        console.error('checkouts GET error', err?.message ?? err)
        return NextResponse.json({ error: 'Failed to load checkouts' }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { assetId, memberUid, eventId, eventName, quantity, dueBackAt, notes } = body

        if (!assetId || !memberUid || !quantity) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        await connectToDatabase()

        const asset = await Asset.findById(assetId)
        if (!asset) return NextResponse.json({ error: 'Asset not found' }, { status: 404 })

        if (asset.availableQuantity < quantity) {
            return NextResponse.json({ error: 'Insufficient quantity available' }, { status: 409 })
        }

        const checkout = await AssetCheckout.create({
            assetId,
            memberUid,
            eventId: eventId || null,
            eventName: eventName || null,
            quantity,
            checkedOutAt: new Date(),
            dueBackAt: dueBackAt ? new Date(dueBackAt) : null,
            status: 'OUT',
            notes: notes || null,
        })

        await Asset.findByIdAndUpdate(assetId, {
            $inc: { availableQuantity: -quantity },
        })

        return NextResponse.json({ checkout })
    } catch (err: any) {
        console.error('checkouts POST error', err?.message ?? err)
        return NextResponse.json({ error: 'Failed to create checkout' }, { status: 500 })
    }
}
