import { Router } from 'express';
import { getKnowledgeGraph, addGraphEntity } from '../controllers/kgController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, getKnowledgeGraph);
router.post('/entity', authenticateToken, addGraphEntity);

export default router;
