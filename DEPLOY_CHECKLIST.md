# ✅ Checklist de Deploy - Sistema de Gestión de Eventos

Usa este checklist para asegurarte de completar todos los pasos necesarios.

---

## 📦 FASE 1: Preparación de Código

### Backend

- [ ] Archivo `src/app.ts` actualizado con CORS dinámico
- [ ] Puerto configurado como variable de entorno (PORT)
- [ ] Archivo `package.json` tiene script `"start": "node dist/app.js"`
- [ ] Variable `NODE_ENV` se verifica antes de `syncSchema()`
- [ ] Archivos `.env` NO se subirán a GitHub (verificar .gitignore)

### Frontend

- [ ] Archivo `src/config.js` creado con configuración de API
- [ ] Archivo `.env` tiene `REACT_APP_API_URL`
- [ ] Archivos `.env` NO se subirán a GitHub (verificar .gitignore)
- [ ] Verificado que no hay URLs hardcodeadas (ejecutar `node check-api-urls.js`)

---

## 🐙 FASE 2: GitHub

- [ ] Repositorio Backend creado en GitHub
- [ ] Repositorio Frontend creado en GitHub
- [ ] Código del Backend subido (push)
- [ ] Código del Frontend subido (push)
- [ ] Verificado que archivos `.env` NO están en GitHub

---

## 🗄️ FASE 3: Base de Datos

### Railway (Recomendado)

- [ ] Cuenta creada en railway.app
- [ ] MySQL provisionado ("New Project" → "Provision MySQL")
- [ ] Public networking habilitado
- [ ] Credenciales copiadas:
  - [ ] MYSQL_HOST
  - [ ] MYSQL_PORT
  - [ ] MYSQL_USER
  - [ ] MYSQL_PASSWORD
  - [ ] MYSQL_DATABASE

### Alternativa: Aiven

- [ ] Cuenta creada en aiven.io
- [ ] MySQL service creado (plan gratuito)
- [ ] Credenciales copiadas

---

## 🔧 FASE 4: Backend Deploy

### Railway

- [ ] "New" → "GitHub Repo" → Seleccionado repo backend
- [ ] Variables de entorno configuradas:
  - [ ] NODE_ENV=production
  - [ ] DB_HOST
  - [ ] DB_PORT=3306
  - [ ] DB_USER
  - [ ] DB_PASSWORD
  - [ ] DB_NAME
  - [ ] JWT_SECRET
  - [ ] OPENAI_API_KEY
  - [ ] PORT=4000
- [ ] Settings → Build Command: `pnpm install && pnpm run build`
- [ ] Settings → Start Command: `node dist/app.js`
- [ ] Domain generado (Settings → Generate Domain)
- [ ] URL del backend copiada: ********\_\_********

### Alternativa: Render

- [ ] "New Web Service" → Conectado repo backend
- [ ] Build Command: `pnpm install && pnpm run build`
- [ ] Start Command: `node dist/app.js`
- [ ] Variables de entorno configuradas (igual que Railway)
- [ ] URL del backend copiada: ********\_\_********

### Verificación Backend

- [ ] Visitar `https://tu-backend.railway.app/api/eventos`
- [ ] Debe devolver JSON (puede estar vacío `[]`)
- [ ] NO debe dar error 500 o de base de datos

---

## ⚛️ FASE 5: Frontend Deploy

### Vercel (Recomendado)

- [ ] Cuenta creada en vercel.com
- [ ] "New Project" → Import desde GitHub → Repo frontend
- [ ] Root Directory configurado: `sge`
- [ ] Framework Preset: Create React App
- [ ] Variables de entorno configuradas:
  - [ ] REACT_APP_API_URL=`<URL del backend>`
  - [ ] GENERATE_SOURCEMAP=false
- [ ] Deploy completado
- [ ] URL del frontend copiada: ********\_\_********

### Alternativa: Netlify

- [ ] Cuenta creada en netlify.com
- [ ] "New site from Git" → Repo frontend
- [ ] Base directory: `sge`
- [ ] Build command: `pnpm run build`
- [ ] Publish directory: `sge/build`
- [ ] Variables de entorno configuradas (igual que Vercel)
- [ ] URL del frontend copiada: ********\_\_********

### Verificación Frontend

- [ ] Visitar tu URL de Vercel/Netlify
- [ ] La página carga correctamente
- [ ] NO muestra pantalla blanca o error

---

## 🔗 FASE 6: Conectar Backend y Frontend

### Actualizar CORS en Backend

- [ ] En Railway/Render, agregar variable:
  - [ ] FRONTEND_URL=`<tu URL de Vercel/Netlify>`
- [ ] Si ya desplegaste, hacer "Redeploy" para aplicar cambios

### Verificación de Conexión

- [ ] Visitar el frontend
- [ ] Intentar ver lista de eventos
- [ ] Intentar registrarte como usuario
- [ ] NO debe haber errores de CORS en la consola del navegador

---

## 🧪 FASE 7: Testing Completo

- [ ] **Página principal**: Se ve correctamente
- [ ] **Lista de eventos**: Carga (aunque esté vacía)
- [ ] **Registro de usuario**: Funciona
- [ ] **Login**: Funciona
- [ ] **Crear evento** (como organizador): Funciona
- [ ] **Ver detalles de evento**: Funciona
- [ ] **Mapa**: Se muestra correctamente (OpenStreetMap)
- [ ] **Imágenes**: Se suben y muestran correctamente

---

## 📝 FASE 8: Documentación para Entrega

- [ ] URL de la aplicación web anotada
- [ ] URL del backend anotada (opcional)
- [ ] URLs de repositorios GitHub anotadas
- [ ] Capturas de pantalla tomadas (opcional):
  - [ ] Página principal
  - [ ] Un evento con mapa
  - [ ] Panel de usuario/organizador

---

## 🎉 COMPLETADO

### Entregar al profesor:

1. **URL de la aplicación**: ********\_\_********
2. **Repo Backend**: ********\_\_********
3. **Repo Frontend**: ********\_\_********

---

## 🐛 Si algo falla, revisar:

### Error de CORS

- ✓ Verificar que FRONTEND_URL esté en variables del backend
- ✓ Hacer redeploy del backend después de agregar la variable

### Error 500 en Backend

- ✓ Revisar logs en Railway/Render
- ✓ Verificar todas las variables de entorno
- ✓ Verificar conexión a base de datos

### Frontend no conecta

- ✓ Verificar REACT_APP_API_URL
- ✓ Verificar que backend esté funcionando
- ✓ Revisar consola del navegador para errores

### Base de datos vacía

- ✓ Esto es normal en primera instalación
- ✓ Crear algunos eventos de prueba para demostrar

---

**Tiempo estimado total**: 30-40 minutos
**Dificultad**: Media
**Costo**: $0 (todo gratuito)

¡Éxito! 🚀
