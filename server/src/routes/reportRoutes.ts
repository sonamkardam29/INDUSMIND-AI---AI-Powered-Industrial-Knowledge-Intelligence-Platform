import { Router } from 'express';
import { downloadPDFReport } from '../controllers/reportController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/download', authenticateToken, downloadPDFReport);

export default router;
