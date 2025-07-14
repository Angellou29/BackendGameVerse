import { Request, Response } from 'express';
import prisma from '../../prisma/client';

export const listarNoticias = async (_req: Request, res: Response) => {
  const noticias = await prisma.noticia.findMany({ orderBy: { fecha: 'desc' } });
  res.json(noticias);
};

export const crearNoticia = async (req: Request, res: Response) => {
  try {
    const { name, descripcion } = req.body;

    if (!name || !descripcion || !req.file) {
      return res.status(400).json({ error: 'Todos los campos (nombre, descripción e imagen) son obligatorios' });
    }

    const imagenRuta = `/imagenes/noticias/${req.file.filename}`;

    const noticia = await prisma.noticia.create({
      data: {
        titulo: name,
        contenido: descripcion,
        imagen: imagenRuta,
      },
    });

    res.status(201).json(noticia);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la noticia' });
  }
};

export const eliminarNoticia = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.noticia.delete({ where: { id: Number(id) } });
    res.json({ mensaje: 'Noticia eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'No se pudo eliminar la noticia' });
  }
};

export const editarNoticia = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, descripcion, foto } = req.body;

  try {
    const data: any = {};
    if (name) data.titulo = name;
    if (descripcion) data.contenido = descripcion;
    if (foto) data.imagen = foto;

    const noticiaActualizada = await prisma.noticia.update({
      where: { id: Number(id) },
      data,
    });

    res.json(noticiaActualizada);
  } catch (error) {
    res.status(500).json({ error: 'No se pudo editar la noticia' });
  }
};