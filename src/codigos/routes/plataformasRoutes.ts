import { Router } from 'express';
import { crearPlataforma, obtenerPlataformas, crearMultiplesPlataformas } from '../controllers/plataformasController';

const router = Router();

router.post('/', crearPlataforma);
router.get('/', obtenerPlataformas);
router.post('/multiples', crearMultiplesPlataformas);

export default router;
