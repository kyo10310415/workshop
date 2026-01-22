import { Response } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middlewares/auth';

export const getWorkshops = async (req: AuthRequest, res: Response) => {
  try {
    const isAdmin = req.user?.role === 'ADMIN';

    const workshops = await prisma.workshop.findMany({
      where: isAdmin ? {} : { isPublic: true },
      include: {
        materials: {
          select: { id: true, title: true, pageCount: true }
        },
        _count: {
          select: { materials: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.json({ workshops });
  } catch (error) {
    console.error('Get workshops error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getWorkshopById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const isAdmin = req.user?.role === 'ADMIN';

    const workshop = await prisma.workshop.findUnique({
      where: { id: parseInt(id) },
      include: {
        materials: {
          select: {
            id: true,
            title: true,
            filename: true,
            originalName: true,
            fileSize: true,
            pageCount: true,
            createdAt: true
          },
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    if (!workshop) {
      return res.status(404).json({ error: 'Workshop not found' });
    }

    if (!isAdmin && !workshop.isPublic) {
      return res.status(403).json({ error: 'Access denied' });
    }

    return res.json({ workshop });
  } catch (error) {
    console.error('Get workshop error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const createWorkshop = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, isPublic } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const workshop = await prisma.workshop.create({
      data: {
        title,
        description: description || '',
        isPublic: isPublic === true
      }
    });

    return res.status(201).json({ workshop });
  } catch (error) {
    console.error('Create workshop error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateWorkshop = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, isPublic } = req.body;

    const workshop = await prisma.workshop.update({
      where: { id: parseInt(id) },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(isPublic !== undefined && { isPublic })
      }
    });

    return res.json({ workshop });
  } catch (error) {
    console.error('Update workshop error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteWorkshop = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.workshop.delete({
      where: { id: parseInt(id) }
    });

    return res.json({ message: 'Workshop deleted successfully' });
  } catch (error) {
    console.error('Delete workshop error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
