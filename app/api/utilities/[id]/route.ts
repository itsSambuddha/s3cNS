import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { connectToDatabase } from '@/lib/db/connect'
import { UtilityResource } from '@/lib/db/models/UtilityResource'

async function deleteResourceRecursive(id: string) {
  const resource = await UtilityResource.findById(id)
  if (!resource) return

  if (resource.isFolder) {
    // Find all children inside this folder
    const children = await UtilityResource.find({ parentFolderId: id }).lean()
    for (const child of children) {
      await deleteResourceRecursive(String(child._id))
    }

    if (resource.filePath && resource.filePath.startsWith('/uploads/utilities/')) {
      const fullPath = path.join(process.cwd(), 'public', resource.filePath.replace(/^\//, '').replace(/\//g, path.sep))
      try {
        await fs.rm(fullPath, { recursive: true, force: true })
      } catch (err) {
        console.warn('Physical folder delete warning:', err)
      }
    }
  } else {
    // Try deleting physical file if it exists in local uploads directory
    if (resource.filePath && resource.filePath.startsWith('/uploads/utilities/')) {
      const fullPath = path.join(process.cwd(), 'public', resource.filePath.replace(/^\//, '').replace(/\//g, path.sep))
      try {
        await fs.unlink(fullPath)
      } catch (err) {
        console.warn('Physical file delete warning:', err)
      }
    }
  }

  await UtilityResource.findByIdAndDelete(id)
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase()
    const { id } = await params
    const body = await req.json()

    if (body.action === 'incrementDownload') {
      const resource = await UtilityResource.findByIdAndUpdate(
        id,
        { $inc: { downloadCount: 1 } },
        { new: true }
      )
      return NextResponse.json({ success: true, resource })
    }

    const updated = await UtilityResource.findByIdAndUpdate(id, body, { new: true })
    if (!updated) {
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, resource: updated })
  } catch (error: any) {
    console.error('Error updating utility resource:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to update utility resource' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase()
    const { id } = await params

    await deleteResourceRecursive(id)

    return NextResponse.json({ success: true, message: 'Folder/File deleted successfully' })
  } catch (error: any) {
    console.error('Error deleting utility resource:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to delete utility resource' },
      { status: 500 }
    )
  }
}
