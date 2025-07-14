import { Router } from 'express';
import {
  listarNoticias,
  crearNoticia,
  eliminarNoticia,
  editarNoticia,
} from '../controllers/noticiaController';

import { validarAutenticacion } from '../../middleware/validarAutenticacion';
import { validarRolAdmin } from '../../middleware/validarRolAdmin';
import uploadImagenNoticia from '../../middleware/uploadImagenNoticia';

const router = Router();

router.get('/', listarNoticias);

router.post('/', validarAutenticacion, validarRolAdmin, uploadImagenNoticia.single('foto'), crearNoticia);

router.put(
  '/:id',
  validarAutenticacion,
  validarRolAdmin,
  uploadImagenNoticia.single('foto'),
  editarNoticia
);

router.delete(
  '/:id',
  validarAutenticacion,
  validarRolAdmin,
  eliminarNoticia
);

export default router;
