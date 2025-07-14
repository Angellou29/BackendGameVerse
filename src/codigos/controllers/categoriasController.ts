import { Request, Response } from 'express';
import prisma from '../../prisma/client';

export const crearCategoria = async (req: Request, res: Response) => {
  const { nombre } = req.body;
  try {
    const categoria = await prisma.categoria.create({
      data: { nombre }
    });
    res.status(201).json(categoria);
  } catch (error) {
    res.status(400).json({ error: 'No se pudo crear la categoría' });
  }
};

export const listarCategorias = async (_req: Request, res: Response) => {
  const categorias = await prisma.categoria.findMany();
  res.json(categorias);
};

export const crearMultiplesCategorias = async (req: Request, res: Response) => {
  const { categorias } = req.body;
  try {
    const creadas = await prisma.categoria.createMany({
      data: categorias,
      skipDuplicates: true // evita duplicados
    });
    res.status(201).json({ mensaje: 'Categorías creadas', resultado: creadas });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear categorías', detalle: error });
  }
};
