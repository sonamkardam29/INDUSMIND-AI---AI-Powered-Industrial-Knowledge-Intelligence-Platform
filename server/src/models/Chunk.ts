import mongoose, { Schema, Document } from 'mongoose';

export interface IChunk extends Document {
  documentId: mongoose.Types.ObjectId | string;
  documentTitle: string;
  pageNumber: number;
  chunkIndex: number;
  content: string;
  embedding: number[];
  metadata: {
    department?: string;
    equipmentId?: string;
    category?: string;
  };
  createdAt: Date;
}

const ChunkSchema = new Schema<IChunk>(
  {
    documentId: { type: Schema.Types.ObjectId, ref: 'Document', required: true },
    documentTitle: { type: String, required: true },
    pageNumber: { type: Number, required: true, default: 1 },
    chunkIndex: { type: Number, required: true },
    content: { type: String, required: true },
    embedding: [{ type: Number }],
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export const ChunkModel = mongoose.model<IChunk>('Chunk', ChunkSchema);
