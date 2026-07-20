import mongoose, { Schema, Document } from 'mongoose';

export interface IDocument extends Document {
  title: string;
  filename: string;
  originalName: string;
  path: string;
  mimeType: string;
  size: number;
  department: string;
  equipmentId?: string;
  category: 'SOP' | 'Manual' | 'Maintenance' | 'Inspection' | 'Incident' | 'Audit' | 'Safety' | 'General';
  tags: string[];
  uploadedBy: mongoose.Types.ObjectId | string;
  ocrProcessed: boolean;
  ocrText?: string;
  chunkCount: number;
  complianceScore?: number;
  securityLevel: 'Public' | 'Internal' | 'Restricted' | 'Confidential';
  version: string;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const DocumentSchema = new Schema<IDocument>(
  {
    title: { type: String, required: true },
    filename: { type: String, required: true },
    originalName: { type: String, required: true },
    path: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    department: { type: String, required: true, default: 'Engineering' },
    equipmentId: { type: String, default: 'GEN-EQUIP-01' },
    category: {
      type: String,
      enum: ['SOP', 'Manual', 'Maintenance', 'Inspection', 'Incident', 'Audit', 'Safety', 'General'],
      default: 'SOP',
    },
    tags: [{ type: String }],
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    ocrProcessed: { type: Boolean, default: false },
    ocrText: { type: String },
    chunkCount: { type: Number, default: 0 },
    complianceScore: { type: Number, default: 95 },
    securityLevel: {
      type: String,
      enum: ['Public', 'Internal', 'Restricted', 'Confidential'],
      default: 'Internal',
    },
    version: { type: String, default: '1.0.0' },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export const DocumentModel = mongoose.model<IDocument>('Document', DocumentSchema);
