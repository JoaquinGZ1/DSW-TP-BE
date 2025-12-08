import request from 'supertest';
import express from 'express';
import { entradaRouter } from '../entrada/entrada.routes.js';
import { eventoRouter } from '../evento/evento.routes.js';
import { usuarioRouter } from '../usuario/usuario.routes.js';
import { organizadorRouter } from '../organizador/organizador.routes.js';
import { categoriaRouter } from '../categoria/categoria.routes.js';
import { tipoEntradaRouter } from '../tipoEntrada/tipoEntrada.routes.js';
import { orm } from '../shared/db/orm.js';
import { Entrada } from '../entrada/entrada.entity.js';
import { TipoEntrada } from '../tipoEntrada/tipoEntrada.entity.js';
import { Evento } from '../evento/evento.entity.js';
import { Categoria } from '../categoria/categoria.entity.js';
import { Organizador } from '../organizador/organizador.entity.js';
import { Usuario } from '../usuario/usuario.entity.js';

const app = express();
app.use(express.json());
app.use('/api/entrada', entradaRouter);
app.use('/api/eventos', eventoRouter);
app.use('/api/usuarios', usuarioRouter);
app.use('/api/organizadores', organizadorRouter);
app.use('/api/categorias', categoriaRouter);
app.use('/api/tipoEntrada', tipoEntradaRouter);

describe('Entrada API Tests', () => {
  let testUsuarioId: number;
  let testUsuarioDNI: number;
  let testOrganizadorId: number;
  let testOrganizadorCUIT: string;
  let testCategoriaId: number;
  let testEventoId: number;
  let testTipoEntradaId: number;
  let testEntradaId: number;

  beforeAll(async () => {
    await orm.connect();

    // Crear usuario de prueba
    const usuarioResponse = await request(app)
      .post('/api/usuarios/register')
      .send({
        DNI: Math.floor(Math.random() * 100000000),
        nickname: `testuser-entrada-${Date.now()}`,
        mail: `testuser-entrada-${Date.now()}@test.com`,
        password: 'TestPassword123!',
        description: 'Usuario para tests de entradas',
      });

    testUsuarioId = usuarioResponse.body.data.id;
    testUsuarioDNI = usuarioResponse.body.data.DNI;

    // Crear organizador de prueba
    const organizadorResponse = await request(app)
      .post('/api/organizadores/register')
      .send({
        CUIT: `20-${Math.floor(Math.random() * 100000000)}-0`,
        nickname: `testorg-entrada-${Date.now()}`,
        mail: `testorg-entrada-${Date.now()}@test.com`,
        password: 'TestPassword123!',
        description: 'Organizador para tests de entradas',
      });

    testOrganizadorId = organizadorResponse.body.data.id;
    testOrganizadorCUIT = organizadorResponse.body.data.CUIT;

    // Crear categoría de prueba
    const categoriaResponse = await request(app)
      .post('/api/categorias')
      .send({
        name: `Categoria Entrada Test ${Date.now()}`,
        description: 'Categoría para tests de entradas',
      });

    testCategoriaId = categoriaResponse.body.data.id;

    // Crear evento de prueba
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);

    const eventoResponse = await request(app)
      .post('/api/eventos')
      .send({
        name: `Evento Entrada Test ${Date.now()}`,
        description: 'Evento para tests de entradas',
        date: futureDate.toISOString(),
        cupos: 100,
        ubicacion: 'Av. Test 123',
        organizador: testOrganizadorId,
        eventoCategoria: testCategoriaId,
      });

    testEventoId = eventoResponse.body.data.id;

    // Crear tipo de entrada de prueba
    const tipoEntradaResponse = await request(app)
      .post('/api/tipoEntrada')
      .send({
        name: `Tipo VIP Test ${Date.now()}`,
        price: 1500,
      });

    testTipoEntradaId = tipoEntradaResponse.body.data.id;
  });

  afterAll(async () => {
    // Limpiar en orden inverso de creación usando ORM directamente
    try {
      if (testEntradaId) {
        const entrada = await orm.em.findOne(Entrada, { id: testEntradaId });
        if (entrada) await orm.em.removeAndFlush(entrada);
      }
      if (testTipoEntradaId) {
        const tipoEntrada = await orm.em.findOne(TipoEntrada, { id: testTipoEntradaId });
        if (tipoEntrada) await orm.em.removeAndFlush(tipoEntrada);
      }
      if (testEventoId) {
        const evento = await orm.em.findOne(Evento, { id: testEventoId });
        if (evento) await orm.em.removeAndFlush(evento);
      }
      if (testCategoriaId) {
        const categoria = await orm.em.findOne(Categoria, { id: testCategoriaId });
        if (categoria) await orm.em.removeAndFlush(categoria);
      }
      if (testOrganizadorCUIT) {
        const organizador = await orm.em.findOne(Organizador, { cuit: testOrganizadorCUIT });
        if (organizador) await orm.em.removeAndFlush(organizador);
      }
      if (testUsuarioDNI) {
        const usuario = await orm.em.findOne(Usuario, { dni: testUsuarioDNI });
        if (usuario) await orm.em.removeAndFlush(usuario);
      }
    } catch (error) {
      console.log('Error en cleanup:', error);
    }
    orm.em.clear();
  }, 10000);

  describe('POST /api/entrada', () => {
    it('debería crear una nueva entrada exitosamente', async () => {
      const newEntrada = {
        usuario: testUsuarioId,
        evento: testEventoId,
        tipoEntrada: testTipoEntradaId,
        status: 'Activa',
      };

      const response = await request(app)
        .post('/api/entrada')
        .send(newEntrada)
        .expect(201);

      expect(response.body.message).toBe('Entrada creada');
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.status).toBe(newEntrada.status);

      testEntradaId = response.body.data.id;
    });

    it('no debería permitir crear entrada duplicada para el mismo usuario y evento', async () => {
      const duplicateEntrada = {
        usuario: testUsuarioId,
        evento: testEventoId,
        tipoEntrada: testTipoEntradaId,
        status: 'Activa',
      };

      const response = await request(app)
        .post('/api/entrada')
        .send(duplicateEntrada)
        .expect(409);

      expect(response.body.message).toBe('El usuario ya tiene una entrada para este evento');
    });

    it('no debería crear una entrada sin campos requeridos', async () => {
      const incompleteEntrada = {
        usuario: testUsuarioId,
        // Faltan campos requeridos
      };

      const response = await request(app)
        .post('/api/entrada')
        .send(incompleteEntrada)
        .expect(500);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('GET /api/entrada', () => {
    it('debería obtener todas las entradas', async () => {
      const response = await request(app)
        .get('/api/entrada')
        .expect(200);

      expect(response.body.message).toBe('found all entradas');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('las entradas deberían tener estadoCalculado', async () => {
      const response = await request(app)
        .get('/api/entrada')
        .expect(200);

      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0]).toHaveProperty('estadoCalculado');
      expect(['Activa', 'Expirada']).toContain(response.body.data[0].estadoCalculado);
    });
  });

  describe('GET /api/entrada/:id', () => {
    it('debería obtener una entrada por ID', async () => {
      const response = await request(app)
        .get(`/api/entrada/${testEntradaId}`)
        .expect(200);

      expect(response.body.message).toBe('found entrada');
      expect(response.body.data).toHaveProperty('id', testEntradaId);
      expect(response.body.data).toHaveProperty('estadoCalculado');
    });

    it('debería retornar error si la entrada no existe', async () => {
      const response = await request(app)
        .get('/api/entrada/999999')
        .expect(500);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('GET /api/usuarios/:id/entradas', () => {
    it('debería obtener las entradas de un usuario', async () => {
      const response = await request(app)
        .get(`/api/usuarios/${testUsuarioId}/entradas`)
        .expect(200);

      expect(response.body.message).toContain('encontradas');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('las entradas del usuario deberían incluir fechaCompra', async () => {
      const response = await request(app)
        .get(`/api/usuarios/${testUsuarioId}/entradas`)
        .expect(200);

      if (response.body.data.length > 0) {
        expect(response.body.data[0]).toHaveProperty('fechaCompra');
        expect(response.body.data[0]).toHaveProperty('estadoCalculado');
      }
    });
  });

  describe('PUT /api/entrada/:id', () => {
    it('debería actualizar una entrada existente', async () => {
      const updatedData = {
        status: 'Usada',
      };

      const response = await request(app)
        .put(`/api/entrada/${testEntradaId}`)
        .send(updatedData)
        .expect(200);

      expect(response.body.message).toBe('entrada updated');
      expect(response.body.data.status).toBe(updatedData.status);
    });
  });

  describe('DELETE /api/entrada/:id', () => {
    it('debería eliminar una entrada', async () => {
      // Crear una entrada temporal para eliminar
      const tempEntrada = await request(app)
        .post('/api/entrada')
        .send({
          usuario: testUsuarioId,
          evento: testEventoId,
          tipoEntrada: testTipoEntradaId,
          status: 'Activa',
        });

      // Como ya existe una entrada para este usuario/evento, creamos otro usuario
      const tempUsuario = await request(app)
        .post('/api/usuarios/register')
        .send({
          DNI: Math.floor(Math.random() * 100000000),
          nickname: `tempuser-${Date.now()}`,
          mail: `tempuser-${Date.now()}@test.com`,
          password: 'TestPassword123!',
          description: 'Usuario temporal',
        });

      const tempUsuarioId = tempUsuario.body.data.id;
      const tempUsuarioDNI = tempUsuario.body.data.DNI;

      const entradaToDelete = await request(app)
        .post('/api/entrada')
        .send({
          usuario: tempUsuarioId,
          evento: testEventoId,
          tipoEntrada: testTipoEntradaId,
          status: 'Activa',
        });

      const entradaIdToDelete = entradaToDelete.body.data.id;

      // Eliminar la entrada
      await request(app)
        .delete(`/api/entrada/${entradaIdToDelete}`)
        .expect(200);

      // Verificar que ya no existe
      await request(app)
        .get(`/api/entrada/${entradaIdToDelete}`)
        .expect(500);

      // Limpiar usuario temporal
      await request(app).delete(`/api/usuarios/${tempUsuarioDNI}`);
    });
  });

  describe('Fecha de Compra', () => {
    it('debería guardar la fecha de compra al crear una entrada', async () => {
      // Crear otro usuario para esta prueba
      const userForDate = await request(app)
        .post('/api/usuarios/register')
        .send({
          DNI: Math.floor(Math.random() * 100000000),
          nickname: `dateuser-${Date.now()}`,
          mail: `dateuser-${Date.now()}@test.com`,
          password: 'TestPassword123!',
          description: 'Usuario para test de fecha',
        });

      const userId = userForDate.body.data.id;
      const userDNI = userForDate.body.data.DNI;

      const beforeCreation = new Date();

      const entrada = await request(app)
        .post('/api/entrada')
        .send({
          usuario: userId,
          evento: testEventoId,
          tipoEntrada: testTipoEntradaId,
          status: 'Activa',
        })
        .expect(201);

      const afterCreation = new Date();

      expect(entrada.body.data).toHaveProperty('createdAt');
      
      const createdAt = new Date(entrada.body.data.createdAt);
      expect(createdAt.getTime()).toBeGreaterThanOrEqual(beforeCreation.getTime());
      expect(createdAt.getTime()).toBeLessThanOrEqual(afterCreation.getTime());

      // Limpiar
      await request(app).delete(`/api/entrada/${entrada.body.data.id}`);
      await request(app).delete(`/api/usuarios/${userDNI}`);
    });
  });
});
