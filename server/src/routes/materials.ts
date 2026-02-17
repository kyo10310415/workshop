import { Router } from 'express';
import multer from 'multer';
import {
  uploadMaterial,
  createUrlMaterial,
  getMaterial,
  deleteMaterial
} from '../controllers/materialController';
import { authenticate, requireAdmin } from '../middlewares/auth';

const router = Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

// Admin routes
router.post(
  '/workshops/:workshopId/materials',
  authenticate,
  requireAdmin,
  upload.single('pdf'),
  uploadMaterial
);

router.post(
  '/workshops/:workshopId/materials/url',
  authenticate,
  requireAdmin,
  createUrlMaterial
);

router.delete(
  '/materials/:materialId',
  authenticate,
  requireAdmin,
  deleteMaterial
);

// Public/User routes
router.get('/materials/:materialId', authenticate, getMaterial);

export default router;
