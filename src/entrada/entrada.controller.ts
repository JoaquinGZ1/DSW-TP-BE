import { Request, Response, NextFunction } from 'express'
import { Entrada } from './entrada.entity.js'
import { orm } from '../shared/db/orm.js'
import { Usuario } from '../usuario/usuario.entity.js';
import { Evento } from '../evento/evento.entity.js';
import { TipoEntrada } from '../tipoEntrada/tipoEntrada.entity.js';

const em = orm.em

// Helper para calcular el estado de la entrada
function calcularEstadoEntrada(fechaEvento: Date | undefined): string {
  if (!fechaEvento) return 'Expirada'; // Si no hay fecha, se considera expirada
  
  const ahora = new Date();
  const fechaEventoDate = new Date(fechaEvento);
  
  return fechaEventoDate > ahora ? 'Activa' : 'Expirada';
}

function sanitizedEntradaInput(
  req: Request,
  res: Response,
  next: NextFunction
) {
  req.body.sanitizedInput = {
    code: req.body.code,
    date: req.body.date,
    status: req.body.status,
    rating: req.body.rating,
    tipoEntrada: req.body.tipoEntrada,
    usuario: req.body.usuario,
    evento: req.body.evento,
  
  }
  //more checks here

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key]
    }
  })
  next()
}

async function findAll(req: Request, res: Response) {
  try {
    const entradas = await em.find(
      Entrada,
      {},
      { populate: ['tipoEntrada', 'usuario', 'evento'] }
    )
    
    // Agregar estado calculado a cada entrada
    const entradasConEstado = entradas.map(entrada => ({
      ...entrada,
      estadoCalculado: calcularEstadoEntrada(entrada.evento.date)
    }));
    
    res.status(200).json({ message: 'found all entradas', data: entradasConEstado })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const entrada = await em.findOneOrFail(
      Entrada,
      { id },
      { populate: ['tipoEntrada', 'usuario', 'evento'] }
    )
    
    // Agregar estado calculado
    const entradaConEstado = {
      ...entrada,
      estadoCalculado: calcularEstadoEntrada(entrada.evento.date)
    };
    
    res.status(200).json({ message: 'found entrada', data: entradaConEstado })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    const { usuario, evento, tipoEntrada, ...rest } = req.body.sanitizedInput;

    // Verifica si ya existe una entrada para ese usuario y evento
    const entradaExistente = await em.findOne(Entrada, {
      usuario,
      evento,
    });

    if (entradaExistente) {
      return res.status(409).json({
        message: 'El usuario ya tiene una entrada para este evento',
      });
    }

    // 🟡 Carga el evento para obtener su fecha
    const eventoEntity = await em.findOneOrFail(Evento, { id: evento });

    const entrada = em.create(Entrada, {
      ...rest,
      date: eventoEntity.date, // ✅ Asignar fecha del evento
      fechaCompra: new Date(), // Guardar fecha de compra
      usuario: em.getReference(Usuario, usuario),
      evento: eventoEntity,
      tipoEntrada: em.getReference(TipoEntrada, tipoEntrada),
    });

    await em.flush();
    res.status(201).json({ message: 'Entrada creada', data: entrada });
  } catch (error: any) {
    console.error('Error al crear entrada:', error);
    res.status(500).json({ message: error.message });
  }
}



async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const entradaToUpdate = await em.findOneOrFail(Entrada, { id })
    em.assign(entradaToUpdate, req.body.sanitizedInput)
    await em.flush()
    res
      .status(200)
      .json({ message: 'entrada updated', data: entradaToUpdate })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    console.log('🔍 Intentando eliminar entrada con ID:', id)
    
    // Usar transacción para asegurar que la eliminación se complete
    await em.transactional(async (em) => {
      // Verificar que la entrada existe antes de eliminarla
      const entrada = await em.findOneOrFail(Entrada, { id }, { populate: ['usuario', 'evento'] })
      console.log('📋 Entrada encontrada:', { id: entrada.id, evento: entrada.evento.name, usuario: entrada.usuario.nickname })
      
      // Eliminar la entrada
      await em.remove(entrada)
      console.log('✅ Entrada marcada para eliminación')
    })
    
    console.log('✅ Transacción completada - Entrada eliminada exitosamente')
    
    res.status(200).json({ 
      message: 'Entrada eliminada exitosamente',
      data: { id: id }
    })
  } catch (error: any) {
    console.error('❌ Error en remove:', error)
    if (error.name === 'NotFoundError') {
      res.status(404).json({ message: 'Entrada no encontrada' })
    } else {
      res.status(500).json({ message: error.message })
    }
  }
}

export { sanitizedEntradaInput, findAll, findOne, add, update, remove }