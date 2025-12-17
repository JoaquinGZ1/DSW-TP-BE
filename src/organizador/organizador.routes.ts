import { Router } from 'express';
import {
  sanitizedOrganizadorInput,
  findAll,
  findOne,
  add,
  update,
  remove,
  login,
  register,
  findEventosByOrganizador,
  deleteAccount,
} from './organizador.controller.js';
import { authMiddleware, requireSelfOrRole } from '../middleware/auth.middleware.js';

export const organizadorRouter = Router();

// Rutas públicas (no requieren autenticación)
organizadorRouter.post('/login', login);
organizadorRouter.post('/register', register);

// Rutas protegidas (requieren autenticación)
organizadorRouter.get('/', authMiddleware, findAll);
organizadorRouter.get('/:id', authMiddleware, findOne);
organizadorRouter.post('/', authMiddleware, sanitizedOrganizadorInput, add);
organizadorRouter.put('/update/:id', authMiddleware, requireSelfOrRole([]), sanitizedOrganizadorInput, update);
// organizadorRouter.patch('/:id', sanitizedOrganizadorInput, update);
organizadorRouter.delete('/:id', authMiddleware, requireSelfOrRole([]), remove);
organizadorRouter.get('/:id/eventos', authMiddleware, requireSelfOrRole([]), findEventosByOrganizador); // Nueva ruta para obtener eventos
organizadorRouter.post('/:id/delete-account', authMiddleware, requireSelfOrRole([]), deleteAccount);  // Eliminar cuenta de organizador
