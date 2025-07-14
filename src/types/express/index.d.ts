// src/types/express/index.d.ts
import { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      usuario?: JwtPayload & { id: number; tipo: string };
    }
  }
}
