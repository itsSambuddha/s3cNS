// app/api/inventory/[id]/route.ts
import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db/connect'
import { Asset } from '@/lib/db/models/Asset'

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        const body = await req.json()
        await connectToDatabase()

        const asset = await Asset.findByIdAndUpdate(id, { $set: body }, { new: true, lean: true })
        if (!asset) return NextResponse.json({ error: 'Asset not found' }, { status: 404 })

        return NextResponse.json({ asset })
    } catch (err: any) {
        console.error('inventory PATCH error', err?.message ?? err)
        return NextResponse.json({ error: 'Failed to update asset' }, { status: 500 })
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        await connectToDatabase()

        const asset = await Asset.findByIdAndDelete(id)
        if (!asset) return NextResponse.json({ error: 'Asset not found' }, { status: 404 })

        return NextResponse.json({ success: true })
    } catch (err: any) {
        console.error('inventory DELETE error', err?.message ?? err)
        return NextResponse.json({ error: 'Failed to delete asset' }, { status: 500 })
    }
}
