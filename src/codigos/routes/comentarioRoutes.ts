import express from 'express';
import { getComentarios, addComentario } from '../controllers/comentariosController';

const router = express.Router();

// Ruta para obtener los comentarios de un juego
router.get('/:juegoId', getComentarios);

// Ruta para agregar un nuevo comentario
router.post('/', addComentario);

export default router;