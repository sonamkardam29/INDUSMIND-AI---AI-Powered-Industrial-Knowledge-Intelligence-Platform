import { Router } from 'express';
import { runComplianceAudit, getAudits } from '../controllers/complianceController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/audit', authenticateToken, runComplianceAudit);
router.get('/audits', authenticateToken, getAudits);

export default router;
