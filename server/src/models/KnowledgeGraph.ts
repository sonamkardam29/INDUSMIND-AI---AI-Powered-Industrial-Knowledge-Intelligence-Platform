import mongoose, { Schema, Document } from 'mongoose';

export interface IKNode {
  id: string;
  label: string;
  type: 'Equipment' | 'Department' | 'Machine' | 'Process' | 'Incident' | 'SOP' | 'Failure';
  category?: string;
  details?: string;
}

export interface IKEdge {
  id: string;
  source: string;
  target: string;
  relation: string;
  weight?: number;
}

export interface IKnowledgeGraph extends Document {
  nodes: IKNode[];
  edges: IKEdge[];
  updatedAt: Date;
}

const NodeSchema = new Schema<IKNode>({
  id: { type: String, required: true },
  label: { type: String, required: true },
  type: {
    type: String,
    enum: ['Equipment', 'Department', 'Machine', 'Process', 'Incident', 'SOP', 'Failure'],
    required: true,
  },
  category: { type: String },
  details: { type: String },
});

const EdgeSchema = new Schema<IKEdge>({
  id: { type: String, required: true },
  source: { type: String, required: true },
  target: { type: String, required: true },
  relation: { type: String, required: true },
  weight: { type: Number, default: 1 },
});

const KnowledgeGraphSchema = new Schema<IKnowledgeGraph>(
  {
    nodes: [NodeSchema],
    edges: [EdgeSchema],
  },
  { timestamps: true }
);

export const KnowledgeGraphModel = mongoose.model<IKnowledgeGraph>(
  'KnowledgeGraph',
  KnowledgeGraphSchema
);
