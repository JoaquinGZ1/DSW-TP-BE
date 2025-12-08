// src/server.ts
import 'dotenv/config';
import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { eventoRouter } from './evento/evento.routes.js';
import { tipoEntradaRouter } from './tipoEntrada/tipoEntrada.routes.js';
import { organizadorRouter } from './organizador/organizador.routes.js';
import { usuarioRouter } from './usuario/usuario.routes.js';
import { entradaRouter } from './entrada/entrada.routes.js';
import { categoriaRouter } from './categoria/categoria.routes.js';
import { orm, syncSchema } from './shared/db/orm.js';
import { RequestContext } from '@mikro-orm/core';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';


const app = express();
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Sirve archivos estáticos desde la carpeta 'uploads'
app.use('/uploads', (req, res, next) => {
    console.log(`Intentando servir: ${path.join(__dirname, 'uploads', req.path)}`);
    next();
}, express.static(path.join(__dirname, 'uploads')));

  
// Configurar CORS para desarrollo y producción
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:4000',
  process.env.FRONTEND_URL,
  'https://dsw-tp-fe.vercel.app', // Vercel URL principal
].filter(Boolean);

console.log('🔒 CORS Configuration:');
console.log('   Allowed Origins:', allowedOrigins);
console.log('   Environment:', process.env.NODE_ENV);
console.log('   FRONTEND_URL:', process.env.FRONTEND_URL);

app.use(
  cors({
    origin: (origin, callback) => {
      console.log('📨 Request from origin:', origin);
      
      // Permitir requests sin origin (como mobile apps o curl)
      if (!origin) {
        console.log('✅ Allowing request without origin');
        return callback(null, true);
      }
      
      // Verificar si está en la lista de orígenes permitidos
      if (allowedOrigins.includes(origin)) {
        console.log('✅ Origin allowed (in list):', origin);
        return callback(null, true);
      }
      
      // Permitir cualquier subdominio de vercel.app (para previews)
      if (origin.endsWith('.vercel.app')) {
        console.log('✅ Origin allowed (Vercel preview):', origin);
        return callback(null, true);
      }
      
      console.log('❌ Origin blocked:', origin);
      console.log('   Allowed origins:', allowedOrigins);
      callback(new Error(`CORS: Origin ${origin} not allowed`));
    },
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    preflightContinue: false,
    optionsSuccessStatus: 204
  })
);  

// Creación del contexto para la base de datos
app.use((req, res, next) => {
  RequestContext.create(orm.em, next);
  
});

// Rutas de la API
app.use('/api/entrada', entradaRouter);
app.use('/api/eventos', eventoRouter);
app.use('/api/tiposEntradas', tipoEntradaRouter);
app.use('/api/organizadores', organizadorRouter);
app.use('/api/usuarios', usuarioRouter);
app.use('/api/categorias', categoriaRouter);

// Ruta para manejar recursos no encontrados
app.use((_, res) => {
  return res.status(404).send({ message: 'Resource not found' });
});

// Inicializar ORM y sincronizar schema
await orm.connect();
await syncSchema();
console.log('✅ Schema synchronized');

// Puerto dinámico para servicios de hosting
const PORT = process.env.PORT || 4000;

// Arrancar el servidor
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
