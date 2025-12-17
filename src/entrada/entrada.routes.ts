import { Router } from 'express';
import {
  sanitizedEntradaInput,
  findAll,
  findOne,
  add,
  update,
  remove,
} from './entrada.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

export const entradaRouter = Router();

// Rutas públicas
entradaRouter.get('/', authMiddleware, findAll);
entradaRouter.get('/:id', authMiddleware, findOne);

// Rutas protegidas (requieren autenticación)
entradaRouter.post('/', authMiddleware, sanitizedEntradaInput, add);
entradaRouter.put('/:id', authMiddleware, sanitizedEntradaInput, update);
entradaRouter.patch('/:id', authMiddleware, sanitizedEntradaInput, update);
entradaRouter.delete('/:id', authMiddleware, remove);
