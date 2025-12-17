import { Router } from 'express';
import multer from 'multer';  // Importación de multer directamente
import { sanitizedEventoInput, findAll, findOne, add, update, remove } from './evento.controller.js';
import upload from '../multer.js';  // Importar el middleware de multer desde el archivo 'multer.ts'
import { authMiddleware, requireRole } from '../middleware/auth.middleware.js';

export const eventoRouter = Router();

// Rutas públicas (no requieren autenticación)
eventoRouter.get('/', findAll);
eventoRouter.get('/:id', findOne);

// Rutas protegidas (solo organizadores pueden crear, modificar y eliminar eventos)
eventoRouter.post('/', authMiddleware, requireRole('organizador'), upload.single('photo'), sanitizedEventoInput, add);
eventoRouter.put('/:id', authMiddleware, requireRole('organizador'), upload.single('photo'), sanitizedEventoInput, update);
eventoRouter.patch('/:id', authMiddleware, requireRole('organizador'), upload.single('photo'), sanitizedEventoInput, update);
eventoRouter.delete('/:id', authMiddleware, requireRole('organizador'), remove);
