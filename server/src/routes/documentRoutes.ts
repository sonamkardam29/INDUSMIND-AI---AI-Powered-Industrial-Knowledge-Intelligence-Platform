import { Router } from 'express';
import {
  uploadDocument,
  getDocuments,
  getDocumentById,
  updateDocumentMetadata,
  deleteDocument,
} from '../controllers/documentController';
import { authenticateToken } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

router.post('/upload', authenticateToken, upload.single('file'), uploadDocument);
router.get('/', authenticateToken, getDocuments);
router.get('/:id', authenticateToken, getDocumentById);
router.put('/:id', authenticateToken, updateDocumentMetadata);
router.delete('/:id', authenticateToken, deleteDocument);

export default router;
