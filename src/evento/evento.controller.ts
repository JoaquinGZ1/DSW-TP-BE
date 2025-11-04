import { Request, Response, NextFunction } from 'express';
import { Evento } from './evento.entity.js';
import { orm } from '../shared/db/orm.js';
import { validateEventContent } from '../shared/ai/contentModerator.js';

const em = orm.em;

function sanitizedEventoInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    name: req.body.name,
    cupos: req.body.cupos,
    description: req.body.description,
    date: req.body.date,
    ubicacion: req.body.ubicacion,
    entradas: req.body.entradas,
    tiposEntrada: req.body.tiposEntrada,
    eventoCategoria: req.body.eventoCategoria,
    organizador: req.body.organizador,
    usuarios: req.body.usuarios,
  };

  // Si el archivo fue cargado, añade la ruta del archivo a los datos
  if (req.file) {
    // Normalizar la ruta para que sea consistente con la configuración del servidor
    // req.file.path será algo como "dist/uploads/filename.jpg"
    // pero necesitamos guardar "uploads/filename.jpg"
    const normalizedPath = req.file.path.replace(/^dist\//, '');
    req.body.sanitizedInput.photo = normalizedPath;
  }

  // Elimina los valores `undefined`
  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key];
    }
  });
  next();
}

async function findAll(req: Request, res: Response) {
  try {
    const eventos = await em.find(
      Evento,
      {},
      { populate: ['entradas', 'tiposEntrada', 'usuarios', 'eventoCategoria', 'organizador'] }
    );
    res.status(200).json({ message: 'found all events', data: eventos });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const evento = await em.findOneOrFail(
      Evento,
      { id },
      {
        populate: [
          'entradas',
          'tiposEntrada',
          'organizador',
          'usuarios',
          'eventoCategoria',
        ],
      }
    );
    res.status(200).json({ message: 'found evento', data: evento });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function add(req: Request, res: Response) {
  try {
    // Obtener un fork del EntityManager global
    const em = orm.em.fork();

    // Los datos del evento (sin sanitización en este ejemplo, ajusta según necesidad)
    const eventoData = req.body;

    // 🤖 MODERACIÓN DE CONTENIDO CON IA
    // Validar el nombre y descripción del evento antes de crearlo
    try {
      await validateEventContent(eventoData.name, eventoData.description);
    } catch (moderationError: any) {
      return res.status(400).json({
        success: false,
        message: '🚫 No se puede crear el evento',
        reason: 'Contenido inapropiado detectado',
        details: moderationError.message,
      });
    }

    // Verifica si se subió un archivo de imagen
    if (req.file) {
    // Normaliza la ruta para sistemas Windows y elimina 'dist/' del inicio
    eventoData.photo = req.file.path.replace(/\\/g, '/').replace('dist/', '');
    }


    // Crear el evento con los datos recibidos
    const evento = em.create(Evento, eventoData);

    // Persistir y hacer flush de los datos
    await em.persistAndFlush(evento);

    // Responder con el evento creado
    res.status(201).json({
      message: 'Evento creado con éxito',
      data: evento,
    });
  } catch (error) {
    const err = error as any;
    console.error('Error creando el evento:', err.message);
    res.status(500).json({
      message: `Error al crear el evento: ${err.message}`,
    });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const eventoToUpdate = await em.findOneOrFail(Evento, { id });
    em.assign(eventoToUpdate, req.body.sanitizedInput);
    await em.flush();
    res.status(200).json({ message: 'evento updated', data: eventoToUpdate });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);

    // Buscar el evento completo con sus entradas para asegurar la eliminación en cascada
    const evento = await em.findOneOrFail(
      Evento, 
      { id }, 
      { populate: ['entradas', 'tiposEntrada'] }
    );

    console.log(`🗑️ Eliminando evento "${evento.name}" con ${evento.entradas.length} entradas asociadas`);

    // Elimina el evento de la base de datos (las entradas se eliminarán automáticamente por la cascada)
    await em.removeAndFlush(evento);

    // Envía una respuesta exitosa
    res.status(200).json({ 
      message: 'Evento eliminado exitosamente junto con sus entradas asociadas.',
      deletedEntries: evento.entradas.length
    });
  } catch (error: any) {
    // Manejo de errores
    console.error('Error al eliminar el evento:', error);
    res.status(500).json({ message: 'Error al eliminar el evento.', error: error.message });
  }
}


export { sanitizedEventoInput, findAll, findOne, add, update, remove };
