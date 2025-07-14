import prisma from '../../prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'token';

import { enviarCorreoVerificacion } from './emailService';

export const registrarUsuario = async (data: any) => {
  const { nickname, correo, contrasena, pais } = data;

  const existeCorreo = await prisma.usuario.findUnique({ where: { correo } });
  if (existeCorreo) throw new Error('El correo ya está registrado.');

  const hash = await bcrypt.hash(contrasena, 10);
  const token = jwt.sign({ correo }, process.env.JWT_SECRET!, { expiresIn: '10m' });

  // ENVÍA CORREO
  await enviarCorreoVerificacion(correo, token);

  // NO lo guardes aún hasta que confirme (esto es opcional según cómo desees validar)
  await prisma.usuario.create({
    data: {
      nickname,
      correo,
      contrasena: hash,
      pais,
      tipo: 'user',
      verificado: false,
      token
    }
  });

  return { mensaje: 'Correo de verificación enviado. Revisa tu bandeja.' };
};

export const iniciarSesion = async (correoONickname: string, contrasena: string) => {
  const esCorreo = correoONickname.includes('@');
  const whereClause = esCorreo ? { correo: correoONickname } : { nickname: correoONickname };

  const usuario = await prisma.usuario.findUnique({ where: whereClause });

  if (!usuario) {
    throw new Error('Usuario no encontrado');
  }

  const match = await bcrypt.compare(contrasena, usuario.contrasena);
  if (!match) {
    throw new Error('Contraseña incorrecta');
  }

  // 👇 Verificación del correo
  if (!usuario.verificado) {
    throw new Error('Tu cuenta aún no ha sido verificada. Revisa tu correo electrónico.');
  }

  const token = jwt.sign(
    { id: usuario.id, tipo: usuario.tipo },
    process.env.JWT_SECRET!,
    { expiresIn: '1h' }
  );

  return { token, usuario };
};

export const obtenerUsuarios = async () => {
  return prisma.usuario.findMany({
    where: {
      tipo: 'user'  // Solo usuarios normales
    },
    select: {
      id: true,
      nickname: true,
      correo: true,
      pais: true,
      imagen: true,
      tipo: true
    }
  });
};

export const actualizarUsuario = (id: number, data: any) =>
  prisma.usuario.update({
    where: { id },
    data,
  });

export const eliminarUsuario = (id: number) =>
  prisma.usuario.delete({ where: { id } });

export const cambiarContrasenaConToken = async (token: string, nuevaContrasena: string) => {
  const usuario = await prisma.usuario.findFirst({ where: { token } });

  if (!usuario) throw new Error('Token inválido o expirado.');

  const hashContrasena = await bcrypt.hash(nuevaContrasena, 10);

  await prisma.usuario.update({
    where: { id: usuario.id },
    data: {
      contrasena: hashContrasena,
      token: null
    }
  });

  return 'Contraseña actualizada correctamente.';
};
