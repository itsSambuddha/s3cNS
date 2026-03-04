// app/api/inventory/route.ts
import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db/connect'
import { Asset } from '@/lib/db/models/Asset'

export async function GET(req: Request) {
    try {
        await connectToDatabase()
        const { searchParams } = new URL(req.url)
        const category = searchParams.get('category')
        const condition = searchParams.get('condition')

        const query: Record<string, any> = {}
        if (category) query.category = category
        if (condition) query.condition = condition

        const assets = await Asset.find(query).sort({ name: 1 }).lean()
        return NextResponse.json({ assets })
    } catch (err: any) {
        console.error('inventory GET error', err?.message ?? err)
        return NextResponse.json({ error: 'Failed to load assets' }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { name, category, totalQuantity, availableQuantity, condition, location, notes } = body

        if (!name || totalQuantity == null || availableQuantity == null) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        await connectToDatabase()

        // Upsert by name — if an asset with this name already exists update it,
        // otherwise create a new document.
        const asset = await Asset.findOneAndUpdate(
            { name },
            {
                $set: {
                    category: category || 'GENERAL',
                    totalQuantity: Number(totalQuantity),
                    availableQuantity: Number(availableQuantity),
                    condition: condition || 'GOOD',
                    location: location || null,
                    notes: notes || null,
                },
            },
            { upsert: true, new: true, lean: true },
        )

        return NextResponse.json({ asset })
    } catch (err: any) {
        console.error('inventory POST error', err?.message ?? err)
        return NextResponse.json({ error: 'Failed to save asset' }, { status: 500 })
    }
}

