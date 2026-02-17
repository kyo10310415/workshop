import { Response } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middlewares/auth';

export const getProgress = async (req: AuthRequest, res: Response) => {
  try {
    const { workshopId } = req.params;
    const { materialId } = req.query;
    const userId = req.user!.id;

    const parsedMaterialId = materialId ? parseInt(materialId as string) : null;

    const whereClause: any = {
      userId_workshopId_materialId: {
        userId,
        workshopId: parseInt(workshopId as string),
        materialId: parsedMaterialId
      }
    };

    let progress = await prisma.progress.findUnique({
      where: whereClause
    });

    if (!progress) {
      progress = await prisma.progress.create({
        data: {
          userId,
          workshopId: parseInt(workshopId as string),
          materialId: parsedMaterialId,
          lastPage: 1,
          completed: false
        }
      });
    }

    return res.json({ progress });
  } catch (error) {
    console.error('Get progress error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAllProgress = async (req: AuthRequest, res: Response) => {
  try {
    const { workshopId } = req.params;
    const userId = req.user!.id;

    const progresses = await prisma.progress.findMany({
      where: {
        userId,
        workshopId: parseInt(workshopId as string)
      },
      include: {
        material: true
      }
    });

    return res.json({ progresses });
  } catch (error) {
    console.error('Get all progress error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateProgress = async (req: AuthRequest, res: Response) => {
  try {
    const { workshopId } = req.params;
    const { materialId, lastPage, completed } = req.body;
    const userId = req.user!.id;

    const parsedMaterialId = materialId ? parseInt(materialId) : null;
    const whereClause: any = {
      userId_workshopId_materialId: {
        userId,
        workshopId: parseInt(workshopId as string),
        materialId: parsedMaterialId
      }
    };

    const progress = await prisma.progress.upsert({
      where: whereClause,
      update: {
        ...(lastPage !== undefined && { lastPage: parseInt(lastPage) }),
        ...(completed !== undefined && { completed })
      },
      create: {
        userId,
        workshopId: parseInt(workshopId as string),
        materialId: parsedMaterialId,
        lastPage: lastPage ? parseInt(lastPage) : 1,
        completed: completed === true
      }
    });

    return res.json({ progress });
  } catch (error) {
    console.error('Update progress error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
