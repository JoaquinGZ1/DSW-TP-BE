import request from 'supertest';
import express from 'express';
import { organizadorRouter } from '../organizador/organizador.routes.js';
import { orm } from '../shared/db/orm.js';
import { Organizador } from '../organizador/organizador.entity.js';

const app = express();
app.use(express.json());
app.use('/api/organizadores', organizadorRouter);

describe('Organizador API Tests', () => {
  let testOrganizadorId: number;
  let testOrganizadorCUIT: string;
  const testEmail = `org-${Date.now()}@test.com`;
  const testNickname = `testorg-${Date.now()}`;

  beforeAll(async () => {
    await orm.connect();
  });

  afterAll(async () => {
    // Limpiar los datos de prueba usando ORM directamente
    if (testOrganizadorCUIT) {
      try {
        const organizador = await orm.em.findOne(Organizador, { cuit: testOrganizadorCUIT });
        if (organizador) {
          await orm.em.removeAndFlush(organizador);
        }
      } catch (error) {
        console.log('Error limpiando organizador de prueba:', error);
      }
    }
    orm.em.clear();
  }, 10000);

  describe('POST /api/organizadores/register', () => {
    it('debería registrar un nuevo organizador exitosamente', async () => {
      const newOrganizador = {
        CUIT: `20-${Math.floor(Math.random() * 100000000)}-0`,
        nickname: testNickname,
        mail: testEmail,
        password: 'OrgPassword123!',
        description: 'Organizador de prueba',
      };

      const response = await request(app)
        .post('/api/organizadores/register')
        .send(newOrganizador)
        .expect(201);

      expect(response.body.message).toBe('Organizador registrado exitosamente');
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.mail).toBe(newOrganizador.mail);
      expect(response.body.data.nickname).toBe(newOrganizador.nickname);
      expect(response.body.data.password).toBeUndefined();

      testOrganizadorId = response.body.data.id;
      testOrganizadorCUIT = response.body.data.CUIT;
    });

    it('no debería permitir registrar un organizador con CUIT duplicado', async () => {
      const duplicateOrg = {
        CUIT: testOrganizadorCUIT,
        nickname: `different-${Date.now()}`,
        mail: `different-${Date.now()}@test.com`,
        password: 'OrgPassword123!',
        description: 'Organizador duplicado',
      };

      const response = await request(app)
        .post('/api/organizadores/register')
        .send(duplicateOrg)
        .expect(400);

      expect(response.body.message).toBe('El CUIT ya está registrado');
    });

    it('no debería permitir registrar un organizador con email duplicado', async () => {
      const duplicateEmail = {
        CUIT: `20-${Math.floor(Math.random() * 100000000)}-0`,
        nickname: `different-${Date.now()}`,
        mail: testEmail,
        password: 'OrgPassword123!',
        description: 'Organizador duplicado',
      };

      const response = await request(app)
        .post('/api/organizadores/register')
        .send(duplicateEmail)
        .expect(400);

      expect(response.body.message).toBe('El correo electrónico ya está registrado');
    });

    it('no debería permitir registrar un organizador con nickname duplicado', async () => {
      const duplicateNickname = {
        CUIT: `20-${Math.floor(Math.random() * 100000000)}-0`,
        nickname: testNickname,
        mail: `different-${Date.now()}@test.com`,
        password: 'OrgPassword123!',
        description: 'Organizador duplicado',
      };

      const response = await request(app)
        .post('/api/organizadores/register')
        .send(duplicateNickname)
        .expect(400);

      expect(response.body.message).toBe('El nickname ya está registrado');
    });
  });

  describe('POST /api/organizadores/login', () => {
    it('debería hacer login con credenciales correctas', async () => {
      const loginData = {
        mail: testEmail,
        password: 'OrgPassword123!',
      };

      const response = await request(app)
        .post('/api/organizadores/login')
        .send(loginData)
        .expect(200);

      expect(response.body.message).toBe('Login exitoso');
      expect(response.body.organizador).toHaveProperty('id');
      expect(response.body.organizador).toHaveProperty('mail', testEmail);
      expect(response.body.organizador).toHaveProperty('nickname', testNickname);
      expect(response.body.organizador.password).toBeUndefined();
    });

    it('no debería hacer login con email incorrecto', async () => {
      const loginData = {
        mail: 'noexiste@test.com',
        password: 'OrgPassword123!',
      };

      const response = await request(app)
        .post('/api/organizadores/login')
        .send(loginData)
        .expect(404);

      expect(response.body.message).toBe('Organizador no encontrado');
    });

    it('no debería hacer login con contraseña incorrecta', async () => {
      const loginData = {
        mail: testEmail,
        password: 'WrongPassword123!',
      };

      const response = await request(app)
        .post('/api/organizadores/login')
        .send(loginData)
        .expect(401);

      expect(response.body.message).toBe('Contraseña incorrecta');
    });
  });

  describe('GET /api/organizadores', () => {
    it('debería obtener todos los organizadores', async () => {
      const response = await request(app)
        .get('/api/organizadores')
        .expect(200);

      expect(response.body.message).toBe('found all organizadores');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/organizadores/:CUIT', () => {
    it('debería obtener un organizador por CUIT', async () => {
      const response = await request(app)
        .get(`/api/organizadores/${testOrganizadorCUIT}`)
        .expect(200);

      expect(response.body.message).toBe('found Organizador');
      expect(response.body.data).toHaveProperty('CUIT', testOrganizadorCUIT);
      expect(response.body.data).toHaveProperty('mail', testEmail);
    });

    it('debería retornar error si el organizador no existe', async () => {
      const response = await request(app)
        .get('/api/organizadores/99-99999999-9')
        .expect(500);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('PUT /api/organizadores/:id', () => {
    it('debería actualizar la descripción de un organizador', async () => {
      const updatedData = {
        description: 'Descripción actualizada de organizador en test',
      };

      const response = await request(app)
        .put(`/api/organizadores/${testOrganizadorId}`)
        .send(updatedData)
        .expect(200);

      expect(response.body.message).toBe('Organizador updated');
      expect(response.body.data).toHaveProperty('description', updatedData.description);
    });
  });

  describe('GET /api/organizadores/:id/eventos', () => {
    it('debería obtener los eventos del organizador (vacío al inicio)', async () => {
      const response = await request(app)
        .get(`/api/organizadores/${testOrganizadorId}/eventos`)
        .expect(200);

      expect(response.body.message).toBe('Eventos del organizador encontrados');
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('debería retornar error con ID de organizador inválido', async () => {
      const response = await request(app)
        .get('/api/organizadores/abc/eventos')
        .expect(400);

      expect(response.body.message).toBe('ID de organizador inválido');
    });
  });

  describe('Password Encryption', () => {
    it('debería encriptar la contraseña al registrar', async () => {
      const newOrg = {
        CUIT: `20-${Math.floor(Math.random() * 100000000)}-0`,
        nickname: `encryptorg-${Date.now()}`,
        mail: `encryptorg-${Date.now()}@test.com`,
        password: 'PlainTextPassword123!',
        description: 'Test de encriptación org',
      };

      const response = await request(app)
        .post('/api/organizadores/register')
        .send(newOrg)
        .expect(201);

      expect(response.body.data.password).toBeUndefined();
      
      // Verificar que se puede hacer login con la contraseña original
      const loginResponse = await request(app)
        .post('/api/organizadores/login')
        .send({
          mail: newOrg.mail,
          password: newOrg.password,
        })
        .expect(200);

      expect(loginResponse.body.message).toBe('Login exitoso');

      // Limpiar
      await request(app).delete(`/api/organizadores/${response.body.data.CUIT}`);
    });
  });
});
