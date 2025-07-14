import { Request, Response } from 'express';
import prisma from '../../prisma/client';
import { enviarResumenCompra, generarClaveActivacion } from '../services/emailService';

export const procesarCompra = async (req: Request, res: Response) => {
  try {
    const { usuarioId, juegos, total } = req.body;

    if (!usuarioId || !Array.isArray(juegos) || juegos.length === 0 || total === undefined) {
      res.status(400).json({ error: 'Datos incompletos para procesar la compra' });
      return;
    }

    const usuario = await prisma.usuario.findUnique({ where: { id: usuarioId } });
    if (!usuario) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;
    }

    const resumenJuegos: {
      nombre: string;
      precio: number;
      clave: string;
    }[] = [];

    for (const juego of juegos) {
      const clave = generarClaveActivacion();

      await prisma.venta.create({
        data: {
          usuarioId,
          juegoId: juego.id,
          clave,
          total: juego.precio 
        },
      });

      resumenJuegos.push({
        nombre: juego.nombre,
        precio: juego.precio,
        clave,
      });
    }

    await enviarResumenCompra(usuario.correo, usuario.nickname, resumenJuegos, total);
    console.log(`✅ Correo enviado a ${usuario.correo}`);
    res.json({ mensaje: 'Compra registrada y correo enviado con éxito' });

  } catch (error) {
    console.error('❌ Error en procesarCompra:', error);
    res.status(500).json({ error: 'Error al procesar la compra' });
  }
};

export const verificarCompra = async (req: Request, res: Response) => {
  const usuarioId = Number(req.params.usuarioId);
  const juegoId = Number(req.params.juegoId);

  if (!usuarioId || !juegoId) {
    res.status(400).json({ error: 'Faltan parámetros usuarioId o juegoId' });
    return;
  }

  const venta = await prisma.venta.findFirst({
    where: {
      usuarioId,
      juegoId
    }
  });

  if (venta) {
    res.json({ comprado: true });
  } else {
    res.json({ comprado: false });
  }
};

export const registrarMultiplesVentas = async (req: Request, res: Response) => {
  try {
    const ventas = req.body;

    if (!Array.isArray(ventas) || ventas.length === 0) {
      return res.status(400).json({ error: 'Se requiere una lista de ventas' });
    }

    const faltantes = ventas.filter(
      v => !v.usuarioId || !v.juegoId || !v.clave || typeof v.total !== 'number'
    );
    if (faltantes.length > 0) {
      return res.status(400).json({ error: 'Algunas ventas tienen datos incompletos' });
    }

    const nuevasVentas = await prisma.venta.createMany({
      data: ventas
    });

    res.status(201).json({
      mensaje: 'Ventas registradas con éxito',
      cantidad: nuevasVentas.count
    });

  } catch (error: any) {
    console.error('❌ Error al registrar múltiples ventas:', error.message, error.stack);
    res.status(500).json({ error: 'Error al registrar las ventas' });
  }
};

