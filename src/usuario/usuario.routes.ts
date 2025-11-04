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

export const usuarioRouter = Router();

usuarioRouter.get('/', findAll);
usuarioRouter.get('/:id', findOne);
usuarioRouter.post('/', sanitizedUsuarioInput, add);
usuarioRouter.put('/update/:id', sanitizedUsuarioInput, update);
//usuarioRouter.patch('/:id', sanitizedUsuarioInput, update);
usuarioRouter.delete('/:id', remove);
usuarioRouter.post('/login', login);
usuarioRouter.post('/register', register);
usuarioRouter.get('/:id/entradas', findEntradasByUsuario);  // Aquí se obtiene las entradas por el id del usuario
usuarioRouter.post('/:id/follow-categoria', followCategoria);  // Seguir una categoría
usuarioRouter.post('/:id/unfollow-categoria', unfollowCategoria);  // Dejar de seguir una categoría
usuarioRouter.get('/:id/categorias-seguidas', getCategoriasSeguidas);  // Obtener categorías seguidas
usuarioRouter.post('/:id/delete-account', deleteAccount);  // Eliminar cuenta de usuario
