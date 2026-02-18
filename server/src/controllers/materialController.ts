import { Response } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middlewares/auth';
import { storageService } from '../services/storageService';
import fs from 'fs';
import * as pdfParse from 'pdf-parse';

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

    // Get PDF page count
    let pageCount = 0;
    try {
      const dataBuffer = fs.readFileSync(file.path);
      const pdfData = await (pdfParse as any)(dataBuffer);
      pageCount = pdfData.numpages;
      console.log(`PDF page count: ${pageCount}`);
    } catch (error) {
      console.error('Failed to parse PDF:', error);
      // Continue with pageCount = 0 if parsing fails
    }

    const material = await prisma.material.create({
      data: {
        workshopId: parseInt(workshopId as string),
        title: title || file.originalname,
        type: 'PDF',
        filename,
        originalName: file.originalname,
        fileSize: file.size,
        mimeType: file.mimetype,
        pageCount
      }
    });

    return res.status(201).json({ material });
  } catch (error) {
    console.error('Upload material error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const createUrlMaterial = async (req: AuthRequest, res: Response) => {
  try {
    const { workshopId } = req.params;
    const { title, url, type } = req.body;

    if (!title || !url || !type) {
      return res.status(400).json({ error: 'Title, URL, and type are required' });
    }

    if (!['GOOGLE_DOCS', 'GOOGLE_SHEETS'].includes(type)) {
      return res.status(400).json({ error: 'Invalid material type' });
    }

    const material = await prisma.material.create({
      data: {
        workshopId: parseInt(workshopId as string),
        title,
        type,
        url
      }
    });

    return res.status(201).json({ material });
  } catch (error) {
    console.error('Create URL material error:', error);
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

    // For URL-based materials, return metadata only
    if (material.type !== 'PDF' || !material.filename) {
      return res.json({ material });
    }

    // For PDF materials, stream the file
    const filepath = storageService.getFilePath(material.filename);

    if (!fs.existsSync(filepath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.setHeader('Content-Type', material.mimeType || 'application/pdf');
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

    // Delete file only for PDF materials
    if (material.type === 'PDF' && material.filename) {
      await storageService.deleteFile(material.filename);
    }
    
    await prisma.material.delete({
      where: { id: parseInt(materialId as string) }
    });

    return res.json({ message: 'Material deleted successfully' });
  } catch (error) {
    console.error('Delete material error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
