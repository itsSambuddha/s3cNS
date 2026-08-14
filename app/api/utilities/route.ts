import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db/connect'
import { UtilityResource } from '@/lib/db/models/UtilityResource'
import { syncDiskUtilities } from '@/lib/utilities/diskScanner'

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase()

    // Automatically sync disk directory with database
    await syncDiskUtilities()

    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    const fileType = searchParams.get('fileType') || ''
    const parentFolderId = searchParams.get('parentFolderId')

    const filter: any = {}

    if (category && category !== 'All') {
      filter.category = category
    }

    if (fileType && fileType !== 'All') {
      filter.fileType = fileType
    }

    // If search term is provided, search across all files/folders regardless of folder level
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { fileName: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ]
    } else {
      // Navigation mode: filter by parentFolderId (null for root)
      if (!parentFolderId || parentFolderId === 'null' || parentFolderId === 'root') {
        filter.parentFolderId = null
      } else {
        filter.parentFolderId = parentFolderId
      }
    }

    // Fetch folders first, then files
    const resources = await UtilityResource.find(filter)
      .sort({ isFolder: -1, isPinned: -1, createdAt: -1 })
      .lean()

    // Build breadcrumb trail if inside a subfolder
    let breadcrumbs: Array<{ _id: string; title: string }> = []
    if (parentFolderId && parentFolderId !== 'null' && parentFolderId !== 'root') {
      let currentId: string | null = parentFolderId
      while (currentId) {
        const folderDoc: any = await UtilityResource.findById(currentId, { _id: 1, title: 1, parentFolderId: 1 }).lean()
        if (!folderDoc) break
        breadcrumbs.unshift({ _id: String(folderDoc._id), title: folderDoc.title })
        currentId = folderDoc.parentFolderId ? String(folderDoc.parentFolderId) : null
      }
    }

    return NextResponse.json({ success: true, resources, breadcrumbs })
  } catch (error: any) {
    console.error('Error fetching utilities:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch utilities' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase()
    const body = await req.json()

    if (!body.title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    const resource = await UtilityResource.create(body)
    return NextResponse.json({ success: true, resource }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating utility resource:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to create utility resource' },
      { status: 500 }
    )
  }
}
