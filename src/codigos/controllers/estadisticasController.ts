import { Request, Response } from 'express';
import prisma from '../../prisma/client';
import { Venta } from '@prisma/client';

export const totalUsuarios = async (_req: Request, res: Response) => {
  try {
    const total = await prisma.usuario.count();
    res.json({ total });
  } catch (error) {
    console.error('❌ Error en totalUsuarios:', error);
    res.status(500).json({ error: 'Error al contar usuarios' });
  }
};


export const ventasHoy = async (_req: Request, res: Response) => {
  try {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const mañana = new Date(hoy);
    mañana.setDate(hoy.getDate() + 1);

    // Buscar ventas de hoy
    const ventas: Venta[] = await prisma.venta.findMany({
      where: {
        fecha: {
          gte: hoy,
          lt: mañana
        }
      }
    });

    const totalHoy = ventas.reduce((acc: number, venta: Venta) => acc + (venta.total ?? 0), 0);

    // Buscar ventas de ayer
    const ayer = new Date(hoy);
    ayer.setDate(hoy.getDate() - 1);

    const ventasAyer: Venta[] = await prisma.venta.findMany({
      where: {
        fecha: {
          gte: ayer,
          lt: hoy
        }
      }
    });

    const totalAyer = ventasAyer.reduce((acc: number, venta: Venta) => acc + (venta.total ?? 0), 0);

    const crecimiento = totalAyer > 0 ? ((totalHoy - totalAyer) / totalAyer) * 100 : 0;

    res.json({ totalHoy, crecimiento });
  } catch (error) {
    console.error('❌ Error en ventasHoy:', error);
    res.status(500).json({ error: 'Error al calcular las ventas de hoy' });
  }
};

export const ventasPorMes = async (_req: Request, res: Response) => {
  try {
    const añoActual = new Date().getFullYear();

    const ventas = await prisma.venta.findMany({
      where: {
        fecha: {
          gte: new Date(`${añoActual}-01-01T00:00:00.000Z`),
          lt: new Date(`${añoActual + 1}-01-01T00:00:00.000Z`)
        }
      }
    });

    const totalesPorMes = Array(12).fill(0);

    ventas.forEach((venta) => {
      const mes = new Date(venta.fecha).getMonth(); // 0 = Enero, 11 = Diciembre
      totalesPorMes[mes] += venta.total;
    });

    res.json({ totalesPorMes });
  } catch (error) {
    console.error('❌ Error en ventasPorMes:', error);
    res.status(500).json({ error: 'Error al obtener las ventas por mes' });
  }
};
