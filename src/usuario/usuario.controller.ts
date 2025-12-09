import { Request, Response, NextFunction } from 'express';
import { Usuario } from './usuario.entity.js';
import { Categoria } from '../categoria/categoria.entity.js';
import { orm } from '../shared/db/orm.js';
import bcrypt from 'bcrypt';

const em = orm.em;
const SALT_ROUNDS = 10;

// Función auxiliar para hashear contraseña
async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

// Helper para calcular el estado de la entrada
function calcularEstadoEntrada(fechaEvento: Date | undefined): string {
  if (!fechaEvento) return 'Expirada'; // Si no hay fecha, se considera expirada
  
  const ahora = new Date();
  const fechaEventoDate = new Date(fechaEvento);
  
  return fechaEventoDate > ahora ? 'Activa' : 'Expirada';
}

function sanitizedUsuarioInput(
  req: Request,
  res: Response,
  next: NextFunction
) {
  req.body.sanitizedInput = {
    DNI: req.body.DNI,
    nickname: req.body.nickname,
    password: req.body.password,
    mail: req.body.mail,
    description: req.body.description,
    photo: req.body.photo,
    eventosUsuario: req.body.eventosUsuario,
    entradas: req.body.entradas,
    categoriasSeguidas: req.body.categoriasSeguidas,
  };
  //more checks here

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key];
    }
  });
  next();
}

async function findEntradasByUsuario(req: Request, res: Response) {
  try {
    const usuarioId = Number.parseInt(req.params.id);

    // Aseguramos que el ID del usuario sea válido
    if (isNaN(usuarioId)) {
      return res.status(400).json({ message: 'ID de usuario inválido' });
    }

    // Buscar el usuario por su ID y cargar las entradas con populate completo
    const usuario = await em.findOneOrFail(
      Usuario,
      { id: usuarioId },
      { 
        populate: [
          'entradas', 
          'entradas.evento', 
          'entradas.evento.eventoCategoria', 
          'entradas.evento.organizador', 
          'entradas.tipoEntrada'
        ] 
      }
    );

    // Si no hay entradas, se maneja aquí
    if (usuario.entradas.isEmpty()) {
      return res.status(200).json({
        message: 'No se encontraron entradas para este usuario.',
        data: [],
      });
    }

    // Agregar estado calculado y mostrar createdAt como fecha de compra
    const entradasConEstado = usuario.entradas.getItems().map((entrada: any) => ({
      ...entrada,
      fechaCompra: entrada.createdAt, // Usar createdAt como fecha de compra
      estadoCalculado: calcularEstadoEntrada(entrada.evento.date)
    }));

    // Devolver las entradas con estado y fecha de compra
    res.status(200).json({
      message: 'Entradas del usuario encontradas',
      data: entradasConEstado
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: 'Error al obtener las entradas del usuario' });
  }
}

async function register(req: Request, res: Response) {
  const { nickname, mail, password, DNI, description } = req.body;

  try {
    // Verificar si el DNI ya está registrado
    const existingDNI = await em.findOne(Usuario, { DNI });
    if (existingDNI) {
      return res.status(400).json({ message: 'El DNI ya está registrado' });
    }

    // Verificar si el correo electrónico ya está registrado
    const existingMail = await em.findOne(Usuario, { mail });
    if (existingMail) {
      return res
        .status(400)
        .json({ message: 'El correo electrónico ya está registrado' });
    }

    // Verificar si el nickname ya está registrado
    const existingNickname = await em.findOne(Usuario, { nickname });
    if (existingNickname) {
      return res
        .status(400)
        .json({ message: 'El nickname ya está registrado' });
    }

    // Hashear la contraseña antes de guardarla
    const hashedPassword = await hashPassword(password);

    // Si todo está bien, crear el nuevo usuario
    const newUser = em.create(Usuario, {
      nickname,
      mail,
      password: hashedPassword,
      DNI,
      description,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await em.persistAndFlush(newUser);

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      data: {
        ...newUser,
        password: undefined // No devolver la contraseña hasheada
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar el usuario' });
  }
}

async function login(req: Request, res: Response) {
  const { mail, password } = req.body;

  try {
    const usuario = await em.findOne(Usuario, { mail });

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const isPasswordValid = await bcrypt.compare(password, usuario.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    res.status(200).json({
      message: 'Login exitoso',
      usuario: {
        DNI: usuario.DNI,
        nickname: usuario.nickname,
        mail: usuario.mail,
        description: usuario.description,
        id: usuario.id
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error al iniciar sesión' });
  }
}

async function findAll(req: Request, res: Response) {
  try {
    const usuarios = await em.find(
      Usuario,
      {},
      { populate: ['eventosUsuario', 'entradas'] }
    );
    res.status(200).json({ message: 'found all Usuarios', data: usuarios });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const DNI = Number.parseInt(req.params.id); // La ruta es /:id pero representa el DNI
    const usuario = await em.findOneOrFail(
      Usuario,
      { DNI }
      // Removed populate to avoid circular reference issues in tests
    );
    res.status(200).json({ message: 'found Usuario', data: usuario });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function add(req: Request, res: Response) {
  try {
    const usuario = em.create(Usuario, req.body.sanitizedInput);
    await em.flush();
    res.status(201).json({ message: 'Usuario created', data: usuario });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id); // El parámetro id es el ID de la base de datos
    console.log('🔄 Actualizando usuario con ID:', id);
    console.log('📝 Datos recibidos:', req.body);
    console.log('✅ Datos sanitizados:', req.body.sanitizedInput);
    
    const usuarioToUpdate = await em.findOneOrFail(Usuario, { id });
    console.log('👤 Usuario encontrado:', usuarioToUpdate.nickname);
    
    em.assign(usuarioToUpdate, req.body.sanitizedInput);
    await em.flush();
    
    console.log('✅ Usuario actualizado exitosamente');
    res.status(200).json({ message: 'usuario updated', data: usuarioToUpdate });
  } catch (error: any) {
    console.error('❌ Error al actualizar usuario:', error);
    res.status(500).json({ message: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const DNI = Number.parseInt(req.params.DNI);
    const usuario = em.getReference(Usuario, DNI);
    await em.removeAndFlush(usuario);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function followCategoria(req: Request, res: Response) {
  try {
    const usuarioId = Number.parseInt(req.params.id);
    const categoriaId = Number.parseInt(req.body.categoriaId);

    // Buscar el usuario con sus categorías seguidas
    const usuario = await em.findOneOrFail(
      Usuario,
      { id: usuarioId },
      { populate: ['categoriasSeguidas'] }
    );

    // Buscar la categoría
    const categoria = await em.findOneOrFail(Categoria, { id: categoriaId });

    // Verificar si ya la sigue
    const yaLaSigue = usuario.categoriasSeguidas.contains(categoria);
    if (yaLaSigue) {
      return res.status(400).json({ message: 'Ya sigues esta categoría' });
    }

    // Agregar la categoría a las seguidas
    usuario.categoriasSeguidas.add(categoria);
    await em.flush();

    res.status(200).json({
      message: 'Categoría seguida exitosamente',
      data: categoria
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function unfollowCategoria(req: Request, res: Response) {
  try {
    const usuarioId = Number.parseInt(req.params.id);
    const categoriaId = Number.parseInt(req.body.categoriaId);

    // Buscar el usuario con sus categorías seguidas
    const usuario = await em.findOneOrFail(
      Usuario,
      { id: usuarioId },
      { populate: ['categoriasSeguidas'] }
    );

    // Buscar la categoría
    const categoria = await em.findOneOrFail(Categoria, { id: categoriaId });

    // Verificar si la sigue
    const laSigue = usuario.categoriasSeguidas.contains(categoria);
    if (!laSigue) {
      return res.status(400).json({ message: 'No sigues esta categoría' });
    }

    // Remover la categoría de las seguidas
    usuario.categoriasSeguidas.remove(categoria);
    await em.flush();

    res.status(200).json({
      message: 'Dejaste de seguir la categoría exitosamente',
      data: categoria
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function getCategoriasSeguidas(req: Request, res: Response) {
  try {
    const usuarioId = Number.parseInt(req.params.id);

    // Buscar el usuario con sus categorías seguidas
    const usuario = await em.findOneOrFail(
      Usuario,
      { id: usuarioId },
      { populate: ['categoriasSeguidas'] }
    );

    res.status(200).json({
      message: 'Categorías seguidas obtenidas exitosamente',
      data: usuario.categoriasSeguidas.getItems()
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function deleteAccount(req: Request, res: Response) {
  try {
    const usuarioId = Number.parseInt(req.params.id);
    const { confirmacion } = req.body;

    // Verificar que se recibió la confirmación
    if (!confirmacion) {
      return res.status(400).json({ 
        message: 'Debe proporcionar la confirmación para eliminar la cuenta' 
      });
    }

    // Verificar que la confirmación sea exactamente "ELIMINAR"
    if (confirmacion !== 'ELIMINAR') {
      return res.status(400).json({ 
        message: 'La confirmación debe ser exactamente "ELIMINAR" para proceder con la eliminación de la cuenta' 
      });
    }

    // Buscar el usuario con sus entradas para asegurar la eliminación en cascada
    const usuario = await em.findOneOrFail(
      Usuario,
      { id: usuarioId },
      { populate: ['entradas'] }
    );

    console.log(`🗑️ Eliminando cuenta del usuario "${usuario.nickname}" con ${usuario.entradas.length} entradas asociadas`);

    // Eliminar el usuario (las entradas se eliminarán automáticamente por la cascada)
    await em.removeAndFlush(usuario);

    // Enviar respuesta exitosa
    res.status(200).json({ 
      message: 'Cuenta eliminada exitosamente junto con todas las entradas asociadas.',
      deletedEntradas: usuario.entradas.length,
      usuario: {
        nickname: usuario.nickname,
        mail: usuario.mail
      }
    });
  } catch (error: any) {
    console.error('Error al eliminar la cuenta:', error);
    res.status(500).json({ 
      message: 'Error al eliminar la cuenta.', 
      error: error.message 
    });
  }
}

export {
  sanitizedUsuarioInput,
  findAll,
  findOne,
  add,
  update,
  remove,
  login,
  register,
  findEntradasByUsuario,
  calcularEstadoEntrada,
  followCategoria,
  unfollowCategoria,
  getCategoriasSeguidas,
  deleteAccount,
};
