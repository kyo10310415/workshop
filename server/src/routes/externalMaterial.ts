import { Router } from 'express';
import { getExternalMaterialCompletion, updateExternalMaterialCompletion } from '../controllers/externalMaterialController';
import { authenticate } from '../middlewares/auth';

const router = Router();

// Get external material completion status
router.get('/materials/:materialId/completion', authenticate, getExternalMaterialCompletion);

// Update external material completion status
router.put('/materials/:materialId/completion', authenticate, updateExternalMaterialCompletion);

export default router;
