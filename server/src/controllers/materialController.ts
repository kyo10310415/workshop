import { Response } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middlewares/auth';
import { storageService } from '../services/storageService';
import fs from 'fs';

export const uploadMaterial = async (req: AuthRequest, res: Response) => {
  try {
    const { workshopId } = req.params;
    const { title } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'PDF file is required' });
    }

    if (file.mimetype !== 'application/pdf') {
      return res.status(400).json({ error: 'Only PDF files are allowed' });
    }

    const filename = await storageService.saveFile(file);

    const material = await prisma.material.create({
      data: {
        workshopId: parseInt(workshopId as string),
        title: title || file.originalname,
        filename,
        originalName: file.originalname,
        fileSize: file.size,
        mimeType: file.mimetype,
        pageCount: 0 // Will be updated by PDF processing if needed
      }
    });

    return res.status(201).json({ material });
  } catch (error) {
    console.error('Upload material error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMaterial = async (req: AuthRequest, res: Response) => {
  try {
    const { materialId } = req.params;

    const material = await prisma.material.findUnique({
      where: { id: parseInt(materialId as string) },
      include: { workshop: true }
    });

    if (!material) {
      return res.status(404).json({ error: 'Material not found' });
    }

    const isAdmin = req.user?.role === 'ADMIN';
    if (!isAdmin && !material.workshop.isPublic) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const filepath = storageService.getFilePath(material.filename);

    if (!fs.existsSync(filepath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.setHeader('Content-Type', material.mimeType);
    res.setHeader('Content-Disposition', `inline; filename="${material.originalName}"`);
    
    const fileStream = fs.createReadStream(filepath);
    fileStream.pipe(res);
  } catch (error) {
    console.error('Get material error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteMaterial = async (req: AuthRequest, res: Response) => {
  try {
    const { materialId } = req.params;

    const material = await prisma.material.findUnique({
      where: { id: parseInt(materialId as string) }
    });

    if (!material) {
      return res.status(404).json({ error: 'Material not found' });
    }

    await storageService.deleteFile(material.filename);
    await prisma.material.delete({
      where: { id: parseInt(materialId as string) }
    });

    return res.json({ message: 'Material deleted successfully' });
  } catch (error) {
    console.error('Delete material error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
