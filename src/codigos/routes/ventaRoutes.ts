import { Router } from 'express';
import { procesarCompra, verificarCompra, registrarMultiplesVentas } from '../controllers/ventaController';

const router = Router();

router.post('/procesar-compra', procesarCompra);
router.get('/verificar-compra/:usuarioId/:juegoId', verificarCompra);
router.post('/registrar-multiples', registrarMultiplesVentas);
export default router;
