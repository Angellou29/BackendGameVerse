import { Router } from 'express';
import * as usuarioController from '../controllers/usuarioController';
import { validarRegistro } from '../../middleware/validarRegistro';
import { enviarTokenContrasena, cambiarContrasenaConToken, editarPerfil } from '../controllers/usuarioController';
import { uploadImagenUsuario } from '../../middleware/uploadImagen';
import { obtenerPerfil } from '../controllers/usuarioController';
import { validarAutenticacion } from '../../middleware/validarAutenticacion';

const router = Router();

router.post('/registro', validarRegistro, usuarioController.registrar);
router.post('/login', usuarioController.login);
router.get('/', usuarioController.listar);
router.put('/:id', usuarioController.editar);
router.delete('/:id', usuarioController.eliminar);
router.get('/verificar/:token', usuarioController.verificarCuenta);
router.post('/enviar-token-contrasena', enviarTokenContrasena);
router.post('/cambiar-contrasena', cambiarContrasenaConToken);
router.patch('/editar/:id', editarPerfil);
router.put('/perfil/:id', uploadImagenUsuario.single('imagen'), editarPerfil);
router.get('/perfil', validarAutenticacion, obtenerPerfil);
router.post('/registrar-multiples', usuarioController.registrarMultiplesUsuarios);


export default router;
