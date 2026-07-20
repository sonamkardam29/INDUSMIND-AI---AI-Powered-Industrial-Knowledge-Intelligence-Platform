import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { DocumentModel } from '../models/Document';
import { ChunkModel } from '../models/Chunk';
import { processDocumentOCR, chunkTextIntoPages } from '../services/ocrService';

export const uploadDocument = async (req: AuthRequest, res: Response) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    const { title, department, equipmentId, category, tags, securityLevel } = req.body;

    const parsedTags = typeof tags === 'string' ? tags.split(',').map(t => t.trim()) : (tags || ['SOP', 'Industrial']);

    // Extract text & run OCR
    const ocrResult = await processDocumentOCR(file.path, file.mimetype);

    // Save Document record
    const doc = await DocumentModel.create({
      title: title || file.originalname,
      filename: file.filename,
      originalName: file.originalname,
      path: file.path,
      mimeType: file.mimetype,
      size: file.size,
      department: department || 'Engineering',
      equipmentId: equipmentId || 'GT-800',
      category: category || 'SOP',
      tags: parsedTags,
      uploadedBy: req.user?.id,
      ocrProcessed: ocrResult.isScanned,
      ocrText: ocrResult.text,
      chunkCount: 0,
      complianceScore: Math.floor(Math.random() * 10) + 90,
      securityLevel: securityLevel || 'Internal',
      version: '1.0.0',
    });

    // Chunk text for RAG Vector Index
    const pages = chunkTextIntoPages(ocrResult.text, ocrResult.pageCount);
    let totalChunks = 0;

    for (const p of pages) {
      await ChunkModel.create({
        documentId: doc._id,
        documentTitle: doc.title,
        pageNumber: p.pageNumber,
        chunkIndex: totalChunks,
        content: p.content,
        metadata: {
          department: doc.department,
          equipmentId: doc.equipmentId,
          category: doc.category,
        },
      });
      totalChunks++;
    }

    doc.chunkCount = totalChunks;
    await doc.save();

    return res.status(201).json({
      message: 'Document uploaded and indexed successfully into RAG engine.',
      document: doc,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getDocuments = async (req: AuthRequest, res: Response) => {
  try {
    const { search, department, category, equipmentId } = req.query;

    const filter: any = {};
    if (department && department !== 'All') filter.department = department;
    if (category && category !== 'All') filter.category = category;
    if (equipmentId) filter.equipmentId = equipmentId;

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search as string, 'i')] } },
        { originalName: { $regex: search, $options: 'i' } },
      ];
    }

    const documents = await DocumentModel.find(filter).sort({ createdAt: -1 }).exec();
    return res.json({ documents });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getDocumentById = async (req: AuthRequest, res: Response) => {
  try {
    const doc = await DocumentModel.findById(req.params.id).exec();
    if (!doc) return res.status(404).json({ message: 'Document not found.' });

    const chunks = await ChunkModel.find({ documentId: doc._id }).limit(10).exec();
    return res.json({ document: doc, sampleChunks: chunks });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateDocumentMetadata = async (req: AuthRequest, res: Response) => {
  try {
    const { title, department, category, tags, securityLevel } = req.body;
    const doc = await DocumentModel.findByIdAndUpdate(
      req.params.id,
      { title, department, category, tags, securityLevel },
      { new: true }
    ).exec();

    if (!doc) return res.status(404).json({ message: 'Document not found.' });
    return res.json({ message: 'Document metadata updated successfully.', document: doc });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteDocument = async (req: AuthRequest, res: Response) => {
  try {
    const doc = await DocumentModel.findByIdAndDelete(req.params.id).exec();
    if (!doc) return res.status(404).json({ message: 'Document not found.' });

    await ChunkModel.deleteMany({ documentId: doc._id }).exec();
    return res.json({ message: 'Document and its vector chunks deleted successfully.' });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
