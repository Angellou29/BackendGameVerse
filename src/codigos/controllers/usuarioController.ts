import { Request, Response } from 'express';
import * as UsuarioService from '../services/usuarioService';
import prisma from '../../prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { enviarCorreoRecuperacion } from '../services/emailService';

export const login = async (req: Request, res: Response) => {
  try {
    const { correo, contrasena } = req.body;

    const usuario = await prisma.usuario.findFirst({
      where: {
        OR: [
          { correo: correo },
          { nickname: correo }
        ]
      }
    });

    if (!usuario) {
      res.status(401).json({ error: 'Usuario no encontrado' });
    } else {
      const coincide = await bcrypt.compare(contrasena, usuario.contrasena);

      if (!coincide) {
        res.status(401).json({ error: 'Contraseña incorrecta' });
      } else if (!usuario.verificado) {
        res.status(403).json({ error: 'Debes confirmar tu cuenta desde el correo' });
      } else {
        const token = jwt.sign(
          { id: usuario.id, tipo: usuario.tipo },
          process.env.JWT_SECRET!,
          { expiresIn: '1h' }
        );

        res.cookie('token', token, {
          httpOnly: true,
          secure: false, 
          sameSite: 'lax',
          maxAge: 3600000 
        });

        const { contrasena: _, ...usuarioSinContrasena } = usuario;

        res.json({ mensaje: 'Inicio de sesión exitoso', usuario: usuarioSinContrasena });
      }
    }
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const registrar = async (req: Request, res: Response) => {
  try {
    const usuario = await UsuarioService.registrarUsuario(req.body);
    res.status(201).json(usuario);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const verificarCuenta = async (req: Request, res: Response) => {
  const { token } = req.params;

  const usuario = await prisma.usuario.findFirst({ where: { token } });

  if (!usuario) {
    res.status(400).json({ error: 'Token inválido' });
  } else {
    await prisma.usuario.update({
      where: { id: usuario.id },
      data: { verificado: true, token: null },
    });

    res.json({ mensaje: 'Cuenta verificada correctamente.' });
  }
};
export const listar = async (_req: Request, res: Response) => {
  const usuarios = await UsuarioService.obtenerUsuarios();
  res.json(usuarios);
};

export const editar = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const usuario = await UsuarioService.actualizarUsuario(id, req.body);
    res.json(usuario);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const eliminar = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    await UsuarioService.eliminarUsuario(id);
    res.status(204).send();
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const enviarTokenContrasena = async (req: Request, res: Response) => {
  const { correo } = req.body;

  if (!correo) {
    res.status(400).json({ error: 'Correo requerido' });
  } else {
    const usuario = await prisma.usuario.findUnique({ where: { correo } });

    if (!usuario) {
      res.status(404).json({ error: 'Usuario no encontrado' });
    } else {
      const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET!, { expiresIn: '10m' });

      await prisma.usuario.update({
        where: { id: usuario.id },
        data: { token }
      });

      await enviarCorreoRecuperacion(correo, token);

      res.json({ mensaje: 'Token enviado al correo' });
    }
  }
};

export const cambiarContrasenaConToken = async (req: Request, res: Response) => {
  const { token, nuevaContrasena } = req.body;

  if (!token || !nuevaContrasena) {
    res.status(400).json({ error: 'Faltan datos obligatorios.' });
  } else {
    const usuario = await prisma.usuario.findFirst({
      where: { token }
    });

    if (!usuario) {
      res.status(400).json({ error: 'Token inválido o expirado.' });
    } else {
      const hashContrasena = await bcrypt.hash(nuevaContrasena, 10);

      await prisma.usuario.update({
        where: { id: usuario.id },
        data: {
          contrasena: hashContrasena,
          token: null
        }
      });

      res.json({ mensaje: 'Contraseña actualizada correctamente.' });
    }
  }
};

export const editarPerfil = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { nickname, correo, pais } = req.body;
  const imagen = req.file?.filename; // 👈 viene de multer

  try {
    const dataActualizar: any = { nickname, correo, pais };
    if (imagen) dataActualizar.imagen = imagen;

    const actualizado = await prisma.usuario.update({
      where: { id },
      data: dataActualizar,
    });

    res.json(actualizado);
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({ error: 'Error al actualizar perfil' });
  }
};

export const obtenerPerfil = async (req: Request, res: Response) => {
  const id = req.usuario?.id;

  if (!id) {
    res.status(401).json({ error: 'No autenticado' });
  } else {
    const usuario = await prisma.usuario.findUnique({ where: { id } });

    if (!usuario) {
      res.status(404).json({ error: 'Usuario no encontrado' });
    } else {
      const { contrasena, token, ...usuarioLimpio } = usuario;
      res.json(usuarioLimpio);
    }
  }
};

export const registrarMultiplesUsuarios = async (req: Request, res: Response) => {
  try {
    const usuarios = req.body;

    if (!Array.isArray(usuarios) || usuarios.length === 0) {
      return res.status(400).json({ error: 'Se requiere una lista de usuarios' });
    }

    const nuevosUsuarios = await prisma.usuario.createMany({
      data: usuarios,
      skipDuplicates: true 
    });

    res.status(201).json({ mensaje: 'Usuarios registrados con éxito', cantidad: nuevosUsuarios.count });
  } catch (error) {
    console.error('❌ Error al registrar múltiples usuarios:', error);
    res.status(500).json({ error: 'Error al registrar los usuarios' });
  }
};
