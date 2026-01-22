import { Router } from 'express';
import { getProgress, updateProgress } from '../controllers/progressController';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.get('/workshops/:workshopId/progress', authenticate, getProgress);
router.put('/workshops/:workshopId/progress', authenticate, updateProgress);

export default router;
