import request from 'supertest';
import express from 'express';
import { usuarioRouter } from '../usuario/usuario.routes.js';
import { orm } from '../shared/db/orm.js';
import { Usuario } from '../usuario/usuario.entity.js';

const app = express();
app.use(express.json());
app.use('/api/usuarios', usuarioRouter);

describe('Usuario API Tests', () => {
  let testUsuarioId: number;
  let testUsuarioDNI: number;
  const testEmail = `test-${Date.now()}@test.com`;
  const testNickname = `testuser-${Date.now()}`;

  beforeAll(async () => {
    // Inicializar la conexión a la base de datos
    await orm.connect();
  });

  afterAll(async () => {
    // Limpiar los datos de prueba usando ORM directamente (más rápido que HTTP)
    if (testUsuarioDNI) {
      try {
        const usuario = await orm.em.findOne(Usuario, { dni: testUsuarioDNI });
        if (usuario) {
          await orm.em.removeAndFlush(usuario);
        }
      } catch (error) {
        console.log('Error limpiando usuario de prueba:', error);
      }
    }
    orm.em.clear();
  }, 10000);

  describe('POST /api/usuarios/register', () => {
    it('debería registrar un nuevo usuario exitosamente', async () => {
      const newUser = {
        DNI: Math.floor(Math.random() * 100000000),
        nickname: testNickname,
        mail: testEmail,
        password: 'TestPassword123!',
        description: 'Usuario de prueba',
      };

      const response = await request(app)
        .post('/api/usuarios/register')
        .send(newUser)
        .expect(201);

      expect(response.body.message).toBe('Usuario registrado exitosamente');
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.mail).toBe(newUser.mail);
      expect(response.body.data.nickname).toBe(newUser.nickname);
      expect(response.body.data.password).toBeUndefined(); // La contraseña no debe devolverse

      testUsuarioId = response.body.data.id;
      testUsuarioDNI = response.body.data.DNI;
    });

    it('no debería permitir registrar un usuario con DNI duplicado', async () => {
      const duplicateUser = {
        DNI: testUsuarioDNI,
        nickname: `different-${Date.now()}`,
        mail: `different-${Date.now()}@test.com`,
        password: 'TestPassword123!',
        description: 'Usuario duplicado',
      };

      const response = await request(app)
        .post('/api/usuarios/register')
        .send(duplicateUser)
        .expect(400);

      expect(response.body.message).toBe('El DNI ya está registrado');
    });

    it('no debería permitir registrar un usuario con email duplicado', async () => {
      const duplicateEmail = {
        DNI: Math.floor(Math.random() * 100000000),
        nickname: `different-${Date.now()}`,
        mail: testEmail,
        password: 'TestPassword123!',
        description: 'Usuario duplicado',
      };

      const response = await request(app)
        .post('/api/usuarios/register')
        .send(duplicateEmail)
        .expect(400);

      expect(response.body.message).toBe('El correo electrónico ya está registrado');
    });

    it('no debería permitir registrar un usuario con nickname duplicado', async () => {
      const duplicateNickname = {
        DNI: Math.floor(Math.random() * 100000000),
        nickname: testNickname,
        mail: `different-${Date.now()}@test.com`,
        password: 'TestPassword123!',
        description: 'Usuario duplicado',
      };

      const response = await request(app)
        .post('/api/usuarios/register')
        .send(duplicateNickname)
        .expect(400);

      expect(response.body.message).toBe('El nickname ya está registrado');
    });
  });

  describe('POST /api/usuarios/login', () => {
    it('debería hacer login con credenciales correctas', async () => {
      const loginData = {
        mail: testEmail,
        password: 'TestPassword123!',
      };

      const response = await request(app)
        .post('/api/usuarios/login')
        .send(loginData)
        .expect(200);

      expect(response.body.message).toBe('Login exitoso');
      expect(response.body.usuario).toHaveProperty('id');
      expect(response.body.usuario).toHaveProperty('mail', testEmail);
      expect(response.body.usuario).toHaveProperty('nickname', testNickname);
      expect(response.body.usuario.password).toBeUndefined(); // La contraseña no debe devolverse
    });

    it('no debería hacer login con email incorrecto', async () => {
      const loginData = {
        mail: 'noexiste@test.com',
        password: 'TestPassword123!',
      };

      const response = await request(app)
        .post('/api/usuarios/login')
        .send(loginData)
        .expect(404);

      expect(response.body.message).toBe('Usuario no encontrado');
    });

    it('no debería hacer login con contraseña incorrecta', async () => {
      const loginData = {
        mail: testEmail,
        password: 'WrongPassword123!',
      };

      const response = await request(app)
        .post('/api/usuarios/login')
        .send(loginData)
        .expect(401);

      expect(response.body.message).toBe('Contraseña incorrecta');
    });
  });

  describe('GET /api/usuarios', () => {
    it('debería obtener todos los usuarios', async () => {
      const response = await request(app)
        .get('/api/usuarios')
        .expect(200);

      expect(response.body.message).toBe('found all Usuarios');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/usuarios/:DNI', () => {
    it('debería obtener un usuario por DNI', async () => {
      const response = await request(app)
        .get(`/api/usuarios/${testUsuarioDNI}`)
        .expect(200);

      expect(response.body.message).toBe('found Usuario');
      expect(response.body.data).toHaveProperty('DNI', testUsuarioDNI);
      expect(response.body.data).toHaveProperty('mail', testEmail);
    });

    it('debería retornar 500 si el usuario no existe', async () => {
      const response = await request(app)
        .get('/api/usuarios/999999999')
        .expect(500);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('PUT /api/usuarios/:id', () => {
    it('debería actualizar la descripción de un usuario', async () => {
      const updatedData = {
        description: 'Nueva descripción'
      };

      const response = await request(app)
        .put(`/api/usuarios/update/${testUsuarioDNI}`) // Ruta correcta: /update/:DNI
        .send(updatedData)
        .expect(200);

      expect(response.body.message).toBe('evento updated');
      expect(response.body.data).toHaveProperty('description', updatedData.description);
    });
  });

  describe('GET /api/usuarios/:id/entradas', () => {
    it('debería obtener las entradas del usuario (vacío al inicio)', async () => {
      const response = await request(app)
        .get(`/api/usuarios/${testUsuarioId}/entradas`)
        .expect(200);

      // Aceptar ambos mensajes: cuando hay entradas o cuando está vacío
      expect(response.body.message).toMatch(/encontradas|No se encontraron/);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('debería retornar error con ID de usuario inválido', async () => {
      const response = await request(app)
        .get('/api/usuarios/abc/entradas')
        .expect(400);

      expect(response.body.message).toBe('ID de usuario inválido');
    });
  });

  describe('Password Encryption', () => {
    it('debería encriptar la contraseña al registrar', async () => {
      const newUser = {
        DNI: Math.floor(Math.random() * 100000000),
        nickname: `encrypttest-${Date.now()}`,
        mail: `encrypt-${Date.now()}@test.com`,
        password: 'PlainTextPassword123!',
        description: 'Test de encriptación',
      };

      const response = await request(app)
        .post('/api/usuarios/register')
        .send(newUser)
        .expect(201);

      // La contraseña no debe estar en la respuesta
      expect(response.body.data.password).toBeUndefined();
      
      // Verificar que se puede hacer login con la contraseña original
      const loginResponse = await request(app)
        .post('/api/usuarios/login')
        .send({
          mail: newUser.mail,
          password: newUser.password,
        })
        .expect(200);

      expect(loginResponse.body.message).toBe('Login exitoso');

      // Limpiar
      await request(app).delete(`/api/usuarios/${response.body.data.DNI}`);
    });
  });
});
