import { Response } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middlewares/auth';

export const getExternalMaterialCompletion = async (req: AuthRequest, res: Response) => {
  try {
    const { materialId } = req.params;
    const userId = req.user!.id;

    console.log('=== Get External Material Completion ===');
    console.log('UserId:', userId);
    console.log('MaterialId:', materialId);

    let completion = await prisma.externalMaterialCompletion.findUnique({
      where: {
        userId_materialId: {
          userId,
          materialId: parseInt(materialId as string)
        }
      }
    });

    console.log('Found completion:', completion);

    if (!completion) {
      completion = await prisma.externalMaterialCompletion.create({
        data: {
          userId,
          materialId: parseInt(materialId as string),
          completed: false
        }
      });
      console.log('Created new completion:', completion);
    }

    return res.json({ completion });
  } catch (error) {
    console.error('Get external material completion error:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const updateExternalMaterialCompletion = async (req: AuthRequest, res: Response) => {
  try {
    const { materialId } = req.params;
    const { completed } = req.body;
    const userId = req.user!.id;

    console.log('=== Update External Material Completion ===');
    console.log('UserId:', userId);
    console.log('MaterialId:', materialId);
    console.log('Completed:', completed);

    const completion = await prisma.externalMaterialCompletion.upsert({
      where: {
        userId_materialId: {
          userId,
          materialId: parseInt(materialId as string)
        }
      },
      update: {
        completed: completed === true
      },
      create: {
        userId,
        materialId: parseInt(materialId as string),
        completed: completed === true
      }
    });

    console.log('Updated/Created completion:', completion);

    return res.json({ completion });
  } catch (error) {
    console.error('Update external material completion error:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
