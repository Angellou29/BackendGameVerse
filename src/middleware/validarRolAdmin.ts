import { Request, Response, NextFunction } from 'express';

// Este middleware asume que `req.usuario` fue cargado previamente por validarAutenticacion
export const validarRolAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.usuario) {
    return res.status(401).json({ error: 'No autenticado' });
  }

  if (req.usuario.tipo !== 'admin') {
    return res.status(403).json({ error: 'Acceso denegado. Se requiere rol de administrador.' });
  }

  next();
};
