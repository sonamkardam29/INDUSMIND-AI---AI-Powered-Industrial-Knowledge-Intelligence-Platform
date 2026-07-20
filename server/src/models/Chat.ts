import mongoose, { Schema, Document } from 'mongoose';

export interface ICitation {
  documentId: string;
  documentTitle: string;
  pageNumber: number;
  snippet: string;
  similarity: number;
}

export interface IMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  confidenceScore?: number;
  citations?: ICitation[];
  sourceDocs?: string[];
  pageNumbers?: number[];
  relatedDocs?: string[];
  timestamp: Date;
  isBookmarked?: boolean;
}

export interface IChat extends Document {
  userId: mongoose.Types.ObjectId | string;
  title: string;
  department?: string;
  messages: IMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const CitationSchema = new Schema<ICitation>({
  documentId: { type: String, required: true },
  documentTitle: { type: String, required: true },
  pageNumber: { type: Number, required: true },
  snippet: { type: String, required: true },
  similarity: { type: Number, required: true },
});

const MessageSchema = new Schema<IMessage>({
  id: { type: String, required: true },
  sender: { type: String, enum: ['user', 'assistant'], required: true },
  content: { type: String, required: true },
  confidenceScore: { type: Number },
  citations: [CitationSchema],
  sourceDocs: [{ type: String }],
  pageNumbers: [{ type: Number }],
  relatedDocs: [{ type: String }],
  timestamp: { type: Date, default: Date.now },
  isBookmarked: { type: Boolean, default: false },
});

const ChatSchema = new Schema<IChat>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, default: 'New Knowledge Query' },
    department: { type: String, default: 'General' },
    messages: [MessageSchema],
  },
  { timestamps: true }
);

export const ChatModel = mongoose.model<IChat>('Chat', ChatSchema);
