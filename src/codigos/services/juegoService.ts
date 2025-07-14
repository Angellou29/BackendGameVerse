import prisma from '../../prisma/client';

interface FiltroJuego {
  nombre?: string;
  plataforma?: string;
  precioMin?: number;
  precioMax?: number;
}

export const filtrarConLogica = async (filtros: FiltroJuego) => {
  const { nombre, plataforma, precioMin, precioMax } = filtros;

  return prisma.juego.findMany({
    where: {
      nombre: nombre ? { contains: nombre, mode: 'insensitive' } : undefined,
      precio: {
        gte: precioMin ?? undefined,
        lte: precioMax ?? undefined,
      },
      plataformas: plataforma
        ? {
            some: {
              nombre: plataforma,
            },
          }
        : undefined,
    },
    include: {
      categoria: true,
      plataformas: true,
    },
  });
};

export const obtenerTodos = () =>
  prisma.juego.findMany({
    include: {
      categoria: true,
      plataformas: true,
    },
  });

export const obtenerPorId = (id: number) => {
  return prisma.juego.findUnique({
    where: { id },
    include: {
      categoria: true,
      plataformas: true,
    },
  });
};

export const crearJuego = async (data: any) => {
  const {
    plataformaIds,
    categoriaId,
    ...juegoData
  } = data;

  return prisma.juego.create({
    data: {
      ...juegoData,
      categoria: { connect: { id: categoriaId } },
      plataformas: {
        connect: plataformaIds.map((id: number) => ({ id }))
      }
    },
    include: {
      categoria: true,
      plataformas: true
    }
  });
};

export const actualizarJuego = (id: number, data: any) => {
  return prisma.juego.update({
    where: { id },
    data: {
      ...data,
      categoria: data.categoria
        ? { connect: { nombre: data.categoria } }
        : undefined,
      plataformas: data.plataformas
        ? {
            set: data.plataformas.map((nombre: string) => ({ nombre })),
          }
        : undefined,
    },
    include: {
      categoria: true,
      plataformas: true,
    },
  });
};

export const eliminarJuego = (id: number) => {
  return prisma.juego.delete({
    where: { id },
  });
};

export const filtrarJuegos = async (
  nombre?: string,
  categoria?: string,
  plataforma?: string
) => {
  return prisma.juego.findMany({
    where: {
      nombre: nombre ? { contains: nombre, mode: 'insensitive' } : undefined,
      categoria: categoria ? { nombre: categoria } : undefined,
      plataformas: plataforma
        ? {
            some: {
              nombre: plataforma,
            },
          }
        : undefined,
    },
    include: {
      categoria: true,
      plataformas: true,
    },
  });
};
