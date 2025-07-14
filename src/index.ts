import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import usuarioRoutes from './codigos/routes/usuarioRoutes';
import juegoRoutes from './codigos/routes/juegoRoutes';
import path from 'path';
import ventasRoutes from './codigos/routes/ventaRoutes';
import cookieParser from 'cookie-parser';
import categoriasRoutes from './codigos/routes/categoriasRoutes';
import plataformaRoutes from './codigos/routes/plataformasRoutes';
import noticiaRoutes from './codigos/routes/noticiaRoutes';
import estadisticasRoutes from './codigos/routes/estadisticasRoutes';

dotenv.config();

const app = express();
const rutaImagenes = path.join(process.cwd(), 'imagenes');

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/juegos', juegoRoutes);
app.use('/api/ventas', ventasRoutes);
app.use('/static', express.static(path.join(process.cwd(), 'imagenes')));
app.use('/api/categorias', categoriasRoutes);
app.use('/api/plataformas', plataformaRoutes);
app.use('/api/noticias', noticiaRoutes);
app.use('/imagenes', express.static(path.join(process.cwd(), 'imagenes')));
app.use('/api/estadisticas', estadisticasRoutes);


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
