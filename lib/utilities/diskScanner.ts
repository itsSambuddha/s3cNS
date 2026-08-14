import { promises as fs } from 'fs'
import path from 'path'
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

function inferCategory(fileName: string, folderName: string): UtilityCategory {
  const nameLower = (fileName + ' ' + folderName).toLowerCase()
  if (nameLower.includes('template') || nameLower.includes('pptx') || nameLower.includes('ppt')) {
    return 'Presentation Templates'
  }
  if (nameLower.includes('rule') || nameLower.includes('procedure') || nameLower.includes('conduct')) {
    return 'Rules of Procedure'
  }
  if (nameLower.includes('guide') || nameLower.includes('handbook') || nameLower.includes('manual')) {
    return 'Handbooks & Guides'
  }
  if (nameLower.includes('logo') || nameLower.includes('png') || nameLower.includes('jpg') || nameLower.includes('asset') || nameLower.includes('canva')) {
    return 'Design Assets'
  }
  if (nameLower.includes('proposal') || nameLower.includes('budget') || nameLower.includes('report') || nameLower.includes('letter')) {
    return 'Session Documents'
  }
  return 'General'
}

export async function syncDiskUtilities() {
  await connectToDatabase()

  const rootDir = path.join(process.cwd(), 'public', 'uploads', 'utilities')

  // Ensure root directory exists
  try {
    await fs.mkdir(rootDir, { recursive: true })
  } catch (err) {
    // Exists
  }

  const validDiskPaths = new Set<string>()

  // Recursive directory scanner
  async function scanDirectory(currentDiskPath: string, parentFolderId: string | null = null, folderName: string = 'General') {
    let entries: any[] = []
    try {
      entries = await fs.readdir(currentDiskPath, { withFileTypes: true })
    } catch (err) {
      return
    }

    for (const entry of entries) {
      // Ignore Office lock files (~$) and hidden OS files
      if (entry.name.startsWith('~$') || entry.name.startsWith('.')) {
        continue
      }

      const fullDiskPath = path.join(currentDiskPath, entry.name)

      if (entry.isDirectory()) {
        const relativeFolderPath = '/' + path.relative(path.join(process.cwd(), 'public'), fullDiskPath).replace(/\\/g, '/')
        validDiskPaths.add(relativeFolderPath)

        // Find or create folder document
        let folderDoc = await UtilityResource.findOne({
          isFolder: true,
          title: entry.name,
          parentFolderId: parentFolderId || null,
        })

        if (!folderDoc) {
          folderDoc = await UtilityResource.create({
            title: entry.name,
            description: `Folder: ${entry.name}`,
            category: inferCategory(entry.name, folderName),
            isFolder: true,
            parentFolderId: parentFolderId || null,
            filePath: relativeFolderPath,
            fileType: 'folder',
            uploadedBy: 'Disk Scanner',
          })
        }

        // Recursively scan subfolder
        await scanDirectory(fullDiskPath, String(folderDoc._id), entry.name)
      } else if (entry.isFile()) {
        const relativeFilePath = '/' + path.relative(path.join(process.cwd(), 'public'), fullDiskPath).replace(/\\/g, '/')
        validDiskPaths.add(relativeFilePath)

        const stats = await fs.stat(fullDiskPath)
        const fileType = getFileType(entry.name)
        const category = inferCategory(entry.name, folderName)

        let fileDoc = await UtilityResource.findOne({
          isFolder: false,
          filePath: relativeFilePath,
        })

        if (!fileDoc) {
          // Pre-fill clean title without extension
          const cleanTitle = entry.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')
          await UtilityResource.create({
            title: cleanTitle,
            description: entry.name,
            category,
            isFolder: false,
            parentFolderId: parentFolderId || null,
            filePath: relativeFilePath,
            fileName: entry.name,
            fileSize: stats.size,
            fileType,
            uploadedBy: 'Disk Sync',
          })
        } else {
          // Ensure parentFolderId & fileSize are synced
          const currentParentStr = fileDoc.parentFolderId ? String(fileDoc.parentFolderId) : null
          const targetParentStr = parentFolderId ? String(parentFolderId) : null

          if (currentParentStr !== targetParentStr || fileDoc.fileSize !== stats.size) {
            await UtilityResource.findByIdAndUpdate(fileDoc._id, {
              parentFolderId: parentFolderId || null,
              fileSize: stats.size,
            })
          }
        }
      }
    }
  }

  // Run recursive scan starting from public/uploads/utilities
  await scanDirectory(rootDir, null, 'Root')

  // Clean up any old database records whose files/folders no longer exist on disk
  const allDocs = await UtilityResource.find({}, { _id: 1, filePath: 1, isFolder: 1 }).lean()
  for (const doc of allDocs) {
    if (doc.filePath && doc.filePath.startsWith('/uploads/utilities/')) {
      const normalizedPath = doc.filePath.replace(/\\/g, '/')
      if (!validDiskPaths.has(normalizedPath)) {
        await UtilityResource.findByIdAndDelete(doc._id)
      }
    }
  }
}
