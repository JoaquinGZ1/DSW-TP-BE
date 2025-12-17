import { Router } from 'express';
import {
  sanitizedUsuarioInput,
  findAll,
  findOne,
  add,
  update,
  remove,
  login,
  register,
  findEntradasByUsuario,
  followCategoria,
  unfollowCategoria,
  getCategoriasSeguidas,
  deleteAccount,
} from './usuario.controller.js';
import { authMiddleware, requireSelfOrRole } from '../middleware/auth.middleware.js';

export const usuarioRouter = Router();

// Rutas públicas (no requieren autenticación)
usuarioRouter.post('/login', login);
usuarioRouter.post('/register', register);

// Rutas protegidas (requieren autenticación)
usuarioRouter.get('/', authMiddleware, findAll);
usuarioRouter.get('/:id', authMiddleware, findOne);
usuarioRouter.post('/', authMiddleware, sanitizedUsuarioInput, add);
usuarioRouter.put('/update/:id', authMiddleware, requireSelfOrRole([]), sanitizedUsuarioInput, update);
//usuarioRouter.patch('/:id', sanitizedUsuarioInput, update);
usuarioRouter.delete('/:id', authMiddleware, requireSelfOrRole([]), remove);
usuarioRouter.get('/:id/entradas', authMiddleware, requireSelfOrRole([]), findEntradasByUsuario);  // Aquí se obtiene las entradas por el id del usuario
usuarioRouter.post('/:id/follow-categoria', authMiddleware, requireSelfOrRole([]), followCategoria);  // Seguir una categoría
usuarioRouter.post('/:id/unfollow-categoria', authMiddleware, requireSelfOrRole([]), unfollowCategoria);  // Dejar de seguir una categoría
usuarioRouter.get('/:id/categorias-seguidas', authMiddleware, requireSelfOrRole([]), getCategoriasSeguidas);  // Obtener categorías seguidas
usuarioRouter.post('/:id/delete-account', authMiddleware, requireSelfOrRole([]), deleteAccount);  // Eliminar cuenta de usuario
