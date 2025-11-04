# 🚀 Guía Completa de Deploy - Sistema de Gestión de Eventos

Esta guía te llevará paso a paso para desplegar tu aplicación completa en servidores gratuitos.

## 📦 Stack de Deploy Recomendado (100% GRATUITO)

- **Backend**: Railway o Render (Node.js + Express)
- **Frontend**: Vercel o Netlify (React)
- **Base de Datos**: Railway (MySQL)

---

## 🗄️ PASO 1: Deploy de la Base de Datos MySQL

### Opción A: Railway (Recomendado - Más fácil)

1. Ve a [railway.app](https://railway.app)
2. Crea una cuenta con GitHub
3. Click en "New Project" → "Provision MySQL"
4. Una vez creado, ve a la pestaña "Variables" y anota:

   - `MYSQL_HOST`
   - `MYSQL_PORT`
   - `MYSQL_USER`
   - `MYSQL_PASSWORD`
   - `MYSQL_DATABASE`

5. **Importante**: En la pestaña "Settings" busca "Public Networking" y actívalo para obtener una URL pública

### Opción B: Aiven.io

1. Ve a [aiven.io](https://aiven.io)
2. Crea cuenta gratuita
3. Create Service → MySQL
4. Selecciona el plan gratuito
5. Anota las credenciales de conexión

---

## 🔧 PASO 2: Deploy del Backend

### Opción A: Railway (Recomendado)

1. **En Railway:**

   - New Project → "Deploy from GitHub repo"
   - Conecta tu cuenta de GitHub
   - Selecciona el repositorio `DSW-TP`
   - Railway detectará automáticamente que es Node.js

2. **Configurar Variables de Entorno:**

   - Ve a la pestaña "Variables"
   - Agrega las siguientes variables:

   ```
   NODE_ENV=production
   DB_HOST=<tu-mysql-host-de-railway>
   DB_PORT=3306
   DB_USER=<tu-mysql-user>
   DB_PASSWORD=<tu-mysql-password>
   DB_NAME=<tu-mysql-database>
   JWT_SECRET=<tu-jwt-secret-del-.env>
   OPENAI_API_KEY=<tu-openai-key>
   PORT=4000
   ```

3. **Configurar Build:**

   - En Settings → Build Command: `pnpm install && pnpm run build`
   - Start Command: `node dist/app.js`

4. **Generar URL Pública:**
   - En Settings → Generate Domain
   - Anota la URL (ej: `https://tu-app.railway.app`)

### Opción B: Render.com

1. Ve a [render.com](https://render.com)
2. New → Web Service
3. Conecta tu repositorio GitHub
4. Configuración:

   - **Name**: dsw-backend
   - **Environment**: Node
   - **Build Command**: `pnpm install && pnpm run build`
   - **Start Command**: `node dist/app.js`
   - **Plan**: Free

5. Agrega las mismas variables de entorno

---

## ⚛️ PASO 3: Deploy del Frontend

### Opción A: Vercel (Recomendado - Más fácil)

1. **Preparar el código:**

   - Necesitamos actualizar la URL del backend en el frontend

2. **En Vercel:**

   - Ve a [vercel.com](https://vercel.com)
   - Import Project → Selecciona el repo `DSW-TP-FE`
   - Root Directory: `sge`
   - Framework Preset: Create React App
   - Build Command: `pnpm run build`
   - Output Directory: `build`

3. **Variables de Entorno:**

   ```
   REACT_APP_API_URL=https://tu-backend.railway.app
   GENERATE_SOURCEMAP=false
   ```

4. Click "Deploy"

### Opción B: Netlify

1. Ve a [netlify.com](https://netlify.com)
2. New site from Git → Conecta GitHub
3. Configuración:

   - Base directory: `sge`
   - Build command: `pnpm run build`
   - Publish directory: `sge/build`

4. Agrega las variables de entorno
5. Deploy

---

## 🔄 PASO 4: Actualizar el Código

### Backend: Actualizar CORS

El backend necesita permitir el origen de tu frontend:

```typescript
// En src/app.ts, actualiza la configuración de CORS:
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'https://tu-frontend.vercel.app', // Agrega tu URL de Vercel
      'https://tu-frontend.netlify.app', // O tu URL de Netlify
    ],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  })
)
```

### Backend: Puerto dinámico

```typescript
// En src/app.ts, cambia el puerto:
const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
```

### Frontend: Actualizar URLs del API

Necesitamos configurar la URL base del backend. Busca en todos los archivos donde hagas llamadas a la API y reemplaza `http://localhost:4000` por una variable de entorno.

---

## 📝 CHECKLIST de Deploy

### Backend ✅

- [ ] Base de datos MySQL creada en Railway/Aiven
- [ ] Repositorio backend en GitHub
- [ ] Backend desplegado en Railway/Render
- [ ] Variables de entorno configuradas
- [ ] CORS actualizado con URL del frontend
- [ ] Puerto dinámico configurado
- [ ] URL pública generada y funcionando

### Frontend ✅

- [ ] Repositorio frontend en GitHub
- [ ] Frontend desplegado en Vercel/Netlify
- [ ] Variable REACT_APP_API_URL configurada
- [ ] URLs de API actualizadas en el código
- [ ] Build exitoso
- [ ] Sitio accesible públicamente

---

## 🐛 Troubleshooting

### Error de CORS

- Verifica que la URL del frontend esté en la configuración de CORS del backend
- Asegúrate de hacer push y redeploy después de cambiar CORS

### Error de Base de Datos

- Verifica que las credenciales sean correctas
- Asegúrate de que la base de datos esté accesible públicamente
- Revisa que el puerto sea 3306

### Error 500 en el Backend

- Revisa los logs en Railway/Render
- Verifica que todas las variables de entorno estén configuradas
- Asegúrate de que el build se haya completado correctamente

### Frontend no se conecta al Backend

- Verifica que REACT_APP_API_URL esté configurada
- Asegúrate de que la URL incluya `https://` y NO termine en `/`
- Verifica que el backend esté funcionando visitando su URL

---

## 🎉 Testing Final

1. **Backend**: Visita `https://tu-backend.railway.app/api/eventos`
2. **Frontend**: Visita `https://tu-frontend.vercel.app`
3. **Funcionalidad completa**: Prueba crear un evento, registrarte, etc.

---

## 💰 Límites de los Planes Gratuitos

### Railway

- $5 USD de crédito mensual (suficiente para proyectos pequeños)
- ~500 horas/mes

### Render

- 750 horas/mes
- Se duerme después de 15 min de inactividad (tarda ~30s en despertar)

### Vercel/Netlify

- 100GB bandwidth/mes
- Builds ilimitados

---

## 📚 Recursos Adicionales

- [Documentación Railway](https://docs.railway.app)
- [Documentación Render](https://render.com/docs)
- [Documentación Vercel](https://vercel.com/docs)
- [Documentación Netlify](https://docs.netlify.com)

---

## 🔐 Seguridad

**IMPORTANTE**:

- Nunca subas archivos `.env` a GitHub
- Usa variables de entorno en las plataformas de deploy
- Cambia JWT_SECRET y OPENAI_API_KEY en producción
- Considera usar variables diferentes para desarrollo y producción
