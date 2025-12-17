# 🔐 Implementación de Autenticación JWT

## ✅ Cambios Realizados

Se ha implementado un sistema completo de autenticación basado en tokens JWT en el backend de la aplicación.

### 1. **Middleware de Autenticación** (`src/middleware/auth.middleware.ts`)

Nuevas funciones para validar tokens:

- **`authMiddleware`**: Verifica que el token JWT sea válido en cada petición
- **`requireRole(...roles)`**: Verifica que el usuario tenga un rol específico (usuario u organizador)
- **`requireSelfOrRole(roles)`**: Permite acceso solo al propio usuario o a roles autorizados

### 2. **Generación de Tokens en Login**

Modificados los controladores:
- `usuario.controller.ts`: Ahora genera un token JWT al hacer login
- `organizador.controller.ts`: Ahora genera un token JWT al hacer login

**Estructura del token:**
```typescript
{
  id: number,           // ID del usuario u organizador
  role: 'usuario' | 'organizador',  // Tipo de cuenta
  mail: string          // Email del usuario
}
```

**Expiración:** 24 horas

### 3. **Rutas Protegidas**

Se aplicó autenticación a las siguientes rutas:

#### Usuarios (`usuario.routes.ts`)
- ✅ **Públicas:** `POST /login`, `POST /register`
- 🔒 **Protegidas:** Todas las demás rutas requieren token válido
- 🔐 **Auto-acceso:** Solo puedes modificar/eliminar tu propia cuenta

#### Organizadores (`organizador.routes.ts`)
- ✅ **Públicas:** `POST /login`, `POST /register`
- 🔒 **Protegidas:** Todas las demás rutas requieren token válido
- 🔐 **Auto-acceso:** Solo puedes modificar/eliminar tu propia cuenta

#### Eventos (`evento.routes.ts`)
- ✅ **Públicas:** `GET /` (listar), `GET /:id` (ver detalle)
- 🔒 **Solo organizadores:** Crear, modificar y eliminar eventos

#### Entradas (`entrada.routes.ts`)
- 🔒 **Todas protegidas:** Requieren autenticación

---

## 🚀 Configuración Necesaria

### Variable de Entorno Requerida

Agrega esta variable a tu archivo `.env`:

```env
JWT_SECRET=tu_clave_secreta_super_segura_cambiala_en_produccion
```

**Para generar una clave segura:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 📡 Uso desde el Frontend

### 1. Login
```javascript
const response = await axios.post('/api/usuarios/login', {
  mail: 'usuario@example.com',
  password: 'password123'
});

// Ahora la respuesta incluye el token
const { token, usuario } = response.data;

// Guardar en localStorage
localStorage.setItem('Token', token);
localStorage.setItem('user', JSON.stringify(usuario));
```

### 2. Peticiones Autenticadas
```javascript
const token = localStorage.getItem('Token');

await axios.get('/api/usuarios/123/entradas', {
  headers: {
    Authorization: `Bearer ${token}`
  }
});
```

### 3. Manejo de Errores

**Token expirado (401):**
```javascript
if (error.response?.status === 401) {
  // Redirigir al login
  localStorage.removeItem('Token');
  navigate('/login');
}
```

**Acceso denegado (403):**
```javascript
if (error.response?.status === 403) {
  // No tienes permiso para este recurso
  alert('No tienes permiso para realizar esta acción');
}
```

---

## 🔍 Códigos de Respuesta

| Código | Significado | Acción |
|--------|-------------|--------|
| 401 | Token inválido/expirado | Redirigir al login |
| 403 | Sin permisos | Mostrar mensaje de error |
| 200 | Autenticación exitosa | Continuar |

---

## ✨ Funcionalidad del Frontend

El frontend **ya está preparado** para funcionar con tokens:
- ✅ Guarda el token en `localStorage` al hacer login
- ✅ Envía el token en el header `Authorization: Bearer <token>`
- ✅ Verifica la existencia del token con `isUserLoggedIn()`

**No se requieren cambios en el frontend**, solo asegurarse de que capture correctamente el token de la respuesta del login (lo cual ya hace).

---

## 🎯 Próximos Pasos

1. **Configurar JWT_SECRET:** Agrega la variable de entorno en tu archivo `.env`
2. **Reiniciar el servidor:** Para que tome la nueva configuración
3. **Probar el login:** Verifica que ahora devuelva un token
4. **Probar rutas protegidas:** Intenta acceder sin token para verificar la protección

---

## 📋 Ejemplo de Flujo Completo

```javascript
// 1. Login
const loginResponse = await axios.post('/api/usuarios/login', {
  mail: 'user@example.com',
  password: 'password123'
});

localStorage.setItem('Token', loginResponse.data.token);

// 2. Hacer una petición autenticada
const token = localStorage.getItem('Token');
const entradasResponse = await axios.get('/api/usuarios/1/entradas', {
  headers: { Authorization: `Bearer ${token}` }
});

// 3. Si el token expira
try {
  await axios.put('/api/usuarios/update/1', data, {
    headers: { Authorization: `Bearer ${token}` }
  });
} catch (error) {
  if (error.response?.status === 401) {
    // Token expirado - redirigir al login
    localStorage.removeItem('Token');
    window.location.href = '/login';
  }
}
```

---

## 🛡️ Seguridad

- ✅ Tokens firmados con JWT
- ✅ Expiración automática en 24 horas
- ✅ Validación en cada petición protegida
- ✅ Control de roles (usuario/organizador)
- ✅ Protección de recursos propios (no puedes modificar datos de otros usuarios)
- ✅ Headers CORS configurados para Authorization

---

**¡Sistema de autenticación JWT implementado correctamente!** 🎉
