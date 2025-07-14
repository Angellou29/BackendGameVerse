import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';

// Crear el directorio destino si no existe
const rutaDestino = path.join(process.cwd(), 'imagenes', 'usuarios');
if (!fs.existsSync(rutaDestino)) {
  fs.mkdirSync(rutaDestino, { recursive: true });
}

// Configuración del almacenamiento
const storage = multer.diskStorage({
  destination: (_req: Request, _file: Express.Multer.File, cb) => {
    cb(null, rutaDestino);
  },
  filename: (_req: Request, file: Express.Multer.File, cb) => {
    const nombreFinal = `${Date.now()}-${file.originalname}`;
    cb(null, nombreFinal);
  },
});

// Middleware exportado
export const uploadImagenUsuario = multer({ storage });

