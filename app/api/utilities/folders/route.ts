import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import mongoose from 'mongoose'
import { connectToDatabase } from '@/lib/db/connect'
import { UtilityResource, type UtilityCategory } from '@/lib/db/models/UtilityResource'

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase()
    const body = await req.json()
    const { title, description = '', category = 'General', parentFolderId: rawParentId, uploadedBy = 'Secretariat Member' } = body

    if (!title || !title.trim()) {
      return NextResponse.json({ error: 'Folder name is required' }, { status: 400 })
    }

    const cleanTitle = title.trim()

    // Sanitize parentFolderId
    let parentFolderId: string | null = null
    if (rawParentId && rawParentId !== 'null' && rawParentId !== 'root' && mongoose.Types.ObjectId.isValid(rawParentId)) {
      parentFolderId = String(rawParentId)
    }

    let parentDiskPath = path.join(process.cwd(), 'public', 'uploads', 'utilities')

    if (parentFolderId) {
      const parentFolderDoc = await UtilityResource.findById(parentFolderId).lean()
      if (parentFolderDoc && parentFolderDoc.filePath) {
        const cleanParentRel = parentFolderDoc.filePath.replace(/^\//, '').replace(/\//g, path.sep)
        parentDiskPath = path.join(process.cwd(), 'public', cleanParentRel)
      }
    }

    // Create physical folder on local disk
    const physicalFolderPath = path.join(parentDiskPath, cleanTitle)
    await fs.mkdir(physicalFolderPath, { recursive: true })

    const relativePath = '/' + path.relative(path.join(process.cwd(), 'public'), physicalFolderPath).replace(/\\/g, '/')

    // Check if folder doc already exists in DB
    let folderDoc = await UtilityResource.findOne({
      isFolder: true,
      title: cleanTitle,
      parentFolderId: parentFolderId || null,
    })

    if (!folderDoc) {
      folderDoc = await UtilityResource.create({
        title: cleanTitle,
        description: description.trim(),
        category: category as UtilityCategory,
        isFolder: true,
        parentFolderId: parentFolderId || null,
        filePath: relativePath,
        fileName: cleanTitle,
        fileType: 'folder',
        uploadedBy,
      })
    } else {
      // Update metadata
      folderDoc = await UtilityResource.findByIdAndUpdate(
        folderDoc._id,
        {
          description: description.trim(),
          category: category as UtilityCategory,
          filePath: relativePath,
        },
        { new: true }
      )
    }

    return NextResponse.json({ success: true, folder: folderDoc }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating folder:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to create folder' },
      { status: 500 }
    )
  }
}
