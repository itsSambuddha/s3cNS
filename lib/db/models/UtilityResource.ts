import mongoose, { Schema, type Model, type Document, Types } from 'mongoose'

export type UtilityCategory =
  | 'Presentation Templates'
  | 'Rules of Procedure'
  | 'Session Documents'
  | 'Design Assets'
  | 'Handbooks & Guides'
  | 'General'

export type UtilityFileType = 'ppt' | 'doc' | 'pdf' | 'excel' | 'image' | 'folder' | 'other'

export interface IUtilityResource extends Document {
  title: string
  description?: string
  category: UtilityCategory
  isFolder: boolean
  parentFolderId?: Types.ObjectId | null
  filePath?: string
  fileName?: string
  fileSize: number
  fileType: UtilityFileType
  tags: string[]
  isPinned: boolean
  downloadCount: number
  uploadedBy?: string
  createdAt: Date
  updatedAt: Date
}

const UtilityResourceSchema = new Schema<IUtilityResource>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    category: {
      type: String,
      enum: [
        'Presentation Templates',
        'Rules of Procedure',
        'Session Documents',
        'Design Assets',
        'Handbooks & Guides',
        'General',
      ],
      default: 'General',
      index: true,
    },
    isFolder: { type: Boolean, default: false, index: true },
    parentFolderId: { type: Schema.Types.ObjectId, ref: 'UtilityResource', default: null, index: true },
    filePath: { type: String, default: '' },
    fileName: { type: String, default: '' },
    fileSize: { type: Number, default: 0 },
    fileType: {
      type: String,
      enum: ['ppt', 'doc', 'pdf', 'excel', 'image', 'folder', 'other'],
      default: 'other',
      index: true,
    },
    tags: [{ type: String }],
    isPinned: { type: Boolean, default: false },
    downloadCount: { type: Number, default: 0 },
    uploadedBy: { type: String, default: 'Secretariat Admin' },
  },
  { timestamps: true }
)

// Delete cached model in dev mode to enforce latest schema updates
if (mongoose.models.UtilityResource) {
  delete mongoose.models.UtilityResource
}

export const UtilityResource: Model<IUtilityResource> =
  mongoose.models.UtilityResource ||
  mongoose.model<IUtilityResource>('UtilityResource', UtilityResourceSchema)
