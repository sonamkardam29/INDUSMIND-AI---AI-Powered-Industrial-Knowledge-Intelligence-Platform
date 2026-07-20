import { Router } from 'express';
import {
  sendChatMessage,
  getChats,
  getChatById,
  bookmarkMessage,
} from '../controllers/chatController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/query', authenticateToken, sendChatMessage);
router.get('/', authenticateToken, getChats);
router.get('/:id', authenticateToken, getChatById);
router.post('/bookmark', authenticateToken, bookmarkMessage);

export default router;
