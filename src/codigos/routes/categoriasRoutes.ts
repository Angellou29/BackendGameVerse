import { Router } from 'express';
import { crearCategoria, listarCategorias, crearMultiplesCategorias } from '../controllers/categoriasController';

const router = Router();

router.post('/', crearCategoria);
router.get('/', listarCategorias);

router.post('/multiples', crearMultiplesCategorias);

export default router;
