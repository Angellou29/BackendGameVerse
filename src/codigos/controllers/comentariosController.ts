import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Obtener los comentarios de un juego
export const getComentarios = async (req: Request, res: Response) => {
  const { juegoId } = req.params;
  try {
    const comentarios = await prisma.comentario.findMany({
      where: { juegoId: parseInt(juegoId) },
      orderBy: { date: 'desc' },
    });
    res.json(comentarios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los comentarios' });
  }
};

// Agregar un nuevo comentario
export const addComentario = async (req: Request, res: Response) => {
  const { juegoId, user, rating, text } = req.body;
  try {
    const nuevoComentario = await prisma.comentario.create({
      data: {
        juegoId: parseInt(juegoId),
        user,
        rating,
        text,
        date: new Date(),
      },
    });
    res.json(nuevoComentario);
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar el comentario' });
  }
};