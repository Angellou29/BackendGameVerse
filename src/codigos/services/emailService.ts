import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.CORREO_ENVIO,
    pass: process.env.PASSWORD_CORREO
  }
});

transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Error al conectar con Gmail:', error);
  } else {
    console.log('📬 Servidor Gmail listo para enviar correos');
  }
});

export const enviarCorreoVerificacion = async (correoDestino: string, token: string) => {
  const urlVerificacion = `http://localhost:5173/ConfirmarContrasena?token=${token}`;

  const mailOptions = {
    from: `"GameVerse" <${process.env.CORREO_ENVIO}>`,
    to: correoDestino,
    subject: 'Confirma tu cuenta en GameVerse 🎮',
    html: `
      <h2>¡Bienvenido a GameVerse!</h2>
      <p>Gracias por registrarte. 
      <p>Usa este código: <strong>${token}</strong></p>
      <small>Si no te registraste, puedes ignorar este mensaje.</small>
    `
  };

  await transporter.sendMail(mailOptions);
  console.log(`📨 Correo enviado a ${correoDestino} para crear juego.`);
};

export const enviarResumenCompra = async (
  correoDestino: string,
  nombreUsuario: string,
  juegos: { nombre: string; precio: number; clave: string }[],
  total: number
) => {
  const juegosHTML = juegos
    .map(j => `<li><strong>${j.nombre}</strong> - Clave de activación: <code>${j.clave}</code> - S/ ${j.precio.toFixed(2)}</li>`)
    .join('');

  const mailOptions = {
    from: `"GameVerse" <${process.env.CORREO_ENVIO}>`,
    to: correoDestino,
    subject: '🎮 ¡Gracias por tu compra en GameVerse!',
    html: `
      <h2>¡Hola, ${nombreUsuario}!</h2>
      <p>Gracias por tu compra. Aquí tienes el resumen de tu pedido:</p>
      <ul>${juegosHTML}</ul>
      <p><strong>Total pagado: S/ ${total.toFixed(2)}</strong></p>
      <p>Recuerda que solo puedes dejar una reseña de juegos que hayas comprado.</p>
      <hr/>
      <small>No respondas a este correo. Si tienes dudas, contáctanos en soporte@gameverse.com</small>
    `
  };

  await transporter.sendMail(mailOptions);
  console.log(`📨 Correo enviado a ${correoDestino} con ${juegos.length} juego(s).`);
};


export function generarClaveActivacion(): string {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let clave = '';
  for (let i = 0; i < 16; i++) {
    if (i > 0 && i % 4 === 0) clave += '-';
    const randomIndex = Math.floor(Math.random() * caracteres.length);
    clave += caracteres[randomIndex];
  }
  return clave;
}

export const enviarCorreoRecuperacion = async (correoDestino: string, token: string) => {
  const url = `http://localhost:5173/ConfirmarContrasena?token=${token}`;

  const mailOptions = {
    from: `"GameVerse" <${process.env.CORREO_ENVIO}>`,
    to: correoDestino,
    subject: '🔐 Recuperación de contraseña - GameVerse',
    html: `
      <h2>Recupera tu contraseña</h2>
      <p>Usa este código: <strong>${token}</strong></p>
      <p>Si no solicitaste esto, ignora este mensaje.</p>
    `
  };

  await transporter.sendMail(mailOptions);
  console.log(`📨 Correo enviado a ${correoDestino} para restablecer contraseña.`);
};