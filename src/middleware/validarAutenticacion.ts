import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const validarAutenticacion = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Token requerido' });
  } else {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);
      req.usuario = decoded as any;
      next();
    } catch (err) {
      res.status(403).json({ error: 'Token inválido o expirado' });
    }
  }
};
