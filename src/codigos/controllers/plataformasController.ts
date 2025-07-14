import { Request, Response } from 'express';
import prisma from '../../prisma/client';

export const crearPlataforma = async (req: Request, res: Response) => {
  try {
    const { nombre } = req.body;

    const existente = await prisma.plataforma.findUnique({
      where: { nombre },
    });

    if (existente) {
      return res.status(400).json({ error: 'La plataforma ya existe.' });
    }

    const nueva = await prisma.plataforma.create({
      data: { nombre },
    });

    res.status(201).json(nueva);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la plataforma' });
  }
};

export const obtenerPlataformas = async (_req: Request, res: Response) => {
  try {
    const plataformas = await prisma.plataforma.findMany();
    res.json(plataformas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las plataformas' });
  }
};

export const crearMultiplesPlataformas = async (req: Request, res: Response) => {
  const { plataformas } = req.body;
  try {
    const resultado = await prisma.plataforma.createMany({
      data: plataformas,
      skipDuplicates: true // evita duplicados por nombre
    });
    res.status(201).json({ mensaje: 'Plataformas creadas', resultado });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear plataformas', detalle: error });
  }
};
