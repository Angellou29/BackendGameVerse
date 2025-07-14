import { Router } from 'express';
import * as juegoController from '../controllers/juegoController';
import { validarAutenticacion } from '../../middleware/validarAutenticacion';
import { obtenerPerfil } from '../controllers/usuarioController';

const router = Router();

router.get('/filtros', juegoController.filtrarJuegos);

router.get('/:id', juegoController.obtenerPorId);
router.post('/', juegoController.crearJuego);
router.put('/:id', juegoController.actualizarJuego);
router.delete('/:id', juegoController.eliminarJuego);
router.get('/', juegoController.obtenerTodos);
router.post('/cargar/masivos', juegoController.crearJuegosMasivos);

//TEMPORAL PARA ELIMINAR JUEGOS
router.delete('/', juegoController.eliminarTodos);
router.get('/perfil', validarAutenticacion, obtenerPerfil);


export default router;
