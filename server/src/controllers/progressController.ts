import { Response } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middlewares/auth';

export const getProgress = async (req: AuthRequest, res: Response) => {
  try {
    const { workshopId } = req.params;
    const userId = req.user!.id;

    let progress = await prisma.progress.findUnique({
      where: {
        userId_workshopId: {
          userId,
          workshopId: parseInt(workshopId)
        }
      }
    });

    if (!progress) {
      progress = await prisma.progress.create({
        data: {
          userId,
          workshopId: parseInt(workshopId),
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

export const updateProgress = async (req: AuthRequest, res: Response) => {
  try {
    const { workshopId } = req.params;
    const { lastPage, completed } = req.body;
    const userId = req.user!.id;

    const progress = await prisma.progress.upsert({
      where: {
        userId_workshopId: {
          userId,
          workshopId: parseInt(workshopId)
        }
      },
      update: {
        ...(lastPage !== undefined && { lastPage: parseInt(lastPage) }),
        ...(completed !== undefined && { completed })
      },
      create: {
        userId,
        workshopId: parseInt(workshopId),
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
