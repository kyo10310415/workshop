import { Response } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middlewares/auth';

export const getProgress = async (req: AuthRequest, res: Response) => {
  try {
    const { workshopId } = req.params;
    const { materialId } = req.query;
    const userId = req.user!.id;

    console.log('=== Get Progress Debug ===');
    console.log('UserId:', userId);
    console.log('WorkshopId:', workshopId);
    console.log('MaterialId:', materialId);

    const parsedMaterialId = materialId ? parseInt(materialId as string) : null;
    const parsedWorkshopId = parseInt(workshopId as string);

    let progress = await prisma.progress.findFirst({
      where: {
        userId,
        workshopId: parsedWorkshopId,
        materialId: parsedMaterialId
      }
    });

    console.log('Found progress:', progress);

    if (!progress) {
      progress = await prisma.progress.create({
        data: {
          userId,
          workshopId: parsedWorkshopId,
          materialId: parsedMaterialId,
          lastPage: 1,
          completed: false
        }
      });
      console.log('Created new progress:', progress);
    }

    return res.json({ progress });
  } catch (error) {
    console.error('Get progress error:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
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

    console.log('=== Update Progress Debug ===');
    console.log('UserId:', userId);
    console.log('WorkshopId:', workshopId);
    console.log('MaterialId:', materialId);
    console.log('LastPage:', lastPage);
    console.log('Completed:', completed);

    const parsedMaterialId = materialId ? parseInt(materialId) : null;
    const parsedWorkshopId = parseInt(workshopId as string);

    // Find existing progress
    const existingProgress = await prisma.progress.findFirst({
      where: {
        userId,
        workshopId: parsedWorkshopId,
        materialId: parsedMaterialId
      }
    });

    console.log('Existing progress:', existingProgress);

    let progress;
    if (existingProgress) {
      // Update existing progress
      progress = await prisma.progress.update({
        where: { id: existingProgress.id },
        data: {
          ...(lastPage !== undefined && { lastPage: parseInt(lastPage) }),
          ...(completed !== undefined && { completed })
        }
      });
      console.log('Updated progress:', progress);
    } else {
      // Create new progress
      progress = await prisma.progress.create({
        data: {
          userId,
          workshopId: parsedWorkshopId,
          materialId: parsedMaterialId,
          lastPage: lastPage ? parseInt(lastPage) : 1,
          completed: completed === true
        }
      });
      console.log('Created progress:', progress);
    }

    return res.json({ progress });
  } catch (error) {
    console.error('Update progress error:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
