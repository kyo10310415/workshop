import { Router } from 'express';
import { getProgress, getAllProgress, updateProgress } from '../controllers/progressController';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.get('/workshops/:workshopId/progress', authenticate, getProgress);
router.get('/workshops/:workshopId/progress/all', authenticate, getAllProgress);
router.put('/workshops/:workshopId/progress', authenticate, updateProgress);

export default router;
