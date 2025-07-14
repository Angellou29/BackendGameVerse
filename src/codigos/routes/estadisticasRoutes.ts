import { Router } from 'express';
import { ventasHoy, totalUsuarios, ventasPorMes } from '../controllers/estadisticasController';

const router = Router();

router.get('/ventas-hoy', ventasHoy);
router.get('/total-usuarios', totalUsuarios);
router.get('/ventas-por-mes', ventasPorMes);

export default router;