import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import mongoose from 'mongoose'
import { connectToDatabase } from '@/lib/db/connect'
import { UtilityResource, type UtilityCategory, type UtilityFileType } from '@/lib/db/models/UtilityResource'

function getFileType(fileName: string): UtilityFileType {
  const ext = path.extname(fileName).toLowerCase()
  if (['.ppt', '.pptx', '.potx', '.key'].includes(ext)) return 'ppt'
  if (['.doc', '.docx', '.txt', '.rtf', '.odt'].includes(ext)) return 'doc'
  if (ext === '.pdf') return 'pdf'
  if (['.xls', '.xlsx', '.csv', '.ods'].includes(ext)) return 'excel'
  if (['.png', '.jpg', '.jpeg', '.webp', '.svg', '.gif'].includes(ext)) return 'image'
  return 'other'
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase()

    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const title = (formData.get('title') as string) || ''
    const description = (formData.get('description') as string) || ''
    const category = ((formData.get('category') as string) || 'General') as UtilityCategory
    const tagsString = (formData.get('tags') as string) || ''
    const uploadedBy = (formData.get('uploadedBy') as string) || 'Secretariat Member'
    const rawParentId = formData.get('parentFolderId') as string | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Sanitize parentFolderId
    let parentFolderId: string | null = null
    if (rawParentId && rawParentId !== 'null' && rawParentId !== 'root' && mongoose.Types.ObjectId.isValid(rawParentId)) {
      parentFolderId = String(rawParentId)
    }

    let uploadDir = path.join(process.cwd(), 'public', 'uploads', 'utilities')

    if (parentFolderId) {
      const parentFolderDoc = await UtilityResource.findById(parentFolderId).lean()
      if (parentFolderDoc && parentFolderDoc.filePath) {
        const cleanParentRel = parentFolderDoc.filePath.replace(/^\//, '').replace(/\//g, path.sep)
        uploadDir = path.join(process.cwd(), 'public', cleanParentRel)
      }
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Ensure target uploads directory exists
    await fs.mkdir(uploadDir, { recursive: true })

    // Clean up filename
    const originalName = file.name
    const ext = path.extname(originalName)
    const baseName = path.basename(originalName, ext).replace(/[^a-zA-Z0-9_-]/g, '_')
    const uniqueFileName = `${baseName}_${Date.now()}${ext}`
    const filePathOnDisk = path.join(uploadDir, uniqueFileName)

    // Write file to local disk
    await fs.writeFile(filePathOnDisk, buffer)

    const relativeFilePath = '/' + path.relative(path.join(process.cwd(), 'public'), filePathOnDisk).replace(/\\/g, '/')
    const detectedType = getFileType(originalName)
    const tagsArr = tagsString
      ? tagsString.split(',').map((t) => t.trim()).filter(Boolean)
      : []

    const newResource = await UtilityResource.create({
      title: title.trim() || originalName,
      description: description.trim(),
      category,
      isFolder: false,
      parentFolderId: parentFolderId || null,
      filePath: relativeFilePath,
      fileName: originalName,
      fileSize: file.size,
      fileType: detectedType,
      tags: tagsArr,
      uploadedBy,
    })

    return NextResponse.json({ success: true, resource: newResource }, { status: 201 })
  } catch (error: any) {
    console.error('Error uploading utility file:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to upload utility resource' },
      { status: 500 }
    )
  }
}
