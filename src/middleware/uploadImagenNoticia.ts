// src/middleware/uploadImagenNoticia.ts
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';

// Crear el directorio destino si no existe
const rutaDestino = path.join(process.cwd(), 'imagenes', 'noticias');
if (!fs.existsSync(rutaDestino)) {
  fs.mkdirSync(rutaDestino, { recursive: true });
}

// Configuración del almacenamiento
const storage = multer.diskStorage({
  destination: (_req: Request, _file, cb) => {
    cb(null, rutaDestino);
  },
  filename: (_req: Request, file, cb) => {
    const nombreFinal = `${Date.now()}-${file.originalname}`;
    cb(null, nombreFinal);
  },
});

// Middleware exportado
const uploadImagenNoticia = multer({ storage });
export default uploadImagenNoticia;
