# 🌐 Deploy Completado - Sistema de Gestión de Eventos

## ✅ Archivos Preparados para Deploy

Tu proyecto ya está preparado con todos los archivos necesarios para el deploy:

### Backend (DSW-TP)

- ✅ `render.yaml` - Configuración para Render
- ✅ `DEPLOY_GUIDE.md` - Guía completa paso a paso
- ✅ `DEPLOY_QUICK.md` - Guía rápida (20 min)
- ✅ `src/app.ts` - Actualizado con CORS dinámico y puerto flexible
- ✅ `.env` - Actualizado con nuevas variables

### Frontend (DSW-TP-FE)

- ✅ `vercel.json` - Configuración para Vercel
- ✅ `netlify.toml` - Configuración para Netlify
- ✅ `sge/src/config.js` - Configuración centralizada de API
- ✅ `sge/.env` - Actualizado con REACT_APP_API_URL
- ✅ `check-api-urls.js` - Script para verificar URLs

---

## 🚀 Siguiente Paso: Subir a GitHub

### 1. Inicializar repositorios (si no lo has hecho)

**Backend:**

```powershell
cd c:\Users\joaqu\Desktop\DSW\DSW-TP
git init
git add .
git commit -m "Preparado para deploy con Railway"
```

**Frontend:**

```powershell
cd c:\Users\joaqu\Desktop\DSW\DSW-TP-FE
git init
git add .
git commit -m "Preparado para deploy con Vercel"
```

### 2. Crear repositorios en GitHub

1. Ve a [github.com](https://github.com)
2. Click en "+" → "New repository"
3. Crea dos repositorios:
   - `DSW-TP-Backend` (o el nombre que prefieras)
   - `DSW-TP-Frontend`

### 3. Conectar y subir

**Backend:**

```powershell
cd c:\Users\joaqu\Desktop\DSW\DSW-TP
git remote add origin https://github.com/TU-USUARIO/DSW-TP-Backend.git
git branch -M main
git push -u origin main
```

**Frontend:**

```powershell
cd c:\Users\joaqu\Desktop\DSW\DSW-TP-FE
git remote add origin https://github.com/TU-USUARIO/DSW-TP-Frontend.git
git branch -M main
git push -u origin main
```

---

## 📖 Guías de Deploy

### Opción 1: Guía Rápida (Recomendada) ⚡

Lee `DEPLOY_QUICK.md` - Solo 20 minutos

### Opción 2: Guía Completa 📚

Lee `DEPLOY_GUIDE.md` - Paso a paso detallado

---

## 🎯 Plataformas Recomendadas (TODO GRATIS)

### Combo Recomendado #1: Railway + Vercel

- ✅ **Más fácil de configurar**
- ✅ Base de datos MySQL incluida en Railway
- ✅ Deploy automático desde GitHub
- ⚠️ Railway: $5 crédito/mes (suficiente para desarrollo)

### Combo Recomendado #2: Render + Netlify

- ✅ 100% gratis
- ✅ 750 horas/mes en Render
- ⚠️ Se duerme después de 15 min de inactividad

---

## 🔧 Variables de Entorno a Configurar

### Backend (Railway/Render)

```
NODE_ENV=production
DB_HOST=<tu-mysql-host>
DB_PORT=3306
DB_USER=<tu-mysql-user>
DB_PASSWORD=<tu-mysql-password>
DB_NAME=<tu-mysql-database>
JWT_SECRET=<tu-jwt-secret>
OPENAI_API_KEY=<tu-openai-key>
PORT=4000
FRONTEND_URL=<tu-url-de-vercel>
```

### Frontend (Vercel/Netlify)

```
REACT_APP_API_URL=<tu-url-de-backend>
GENERATE_SOURCEMAP=false
```

---

## 📱 Entrega al Profesor

Una vez desplegado, proporciona:

1. **URL de la aplicación web**: `https://tu-proyecto.vercel.app`
2. **Repositorios GitHub**:
   - Backend: `https://github.com/tu-usuario/DSW-TP-Backend`
   - Frontend: `https://github.com/tu-usuario/DSW-TP-Frontend`

---

## 🐛 Solución de Problemas Comunes

### Error: "npm not found" o "pnpm not found"

→ En la configuración del servicio, asegúrate de especificar `pnpm` como gestor de paquetes

### Error de CORS

→ Verifica que `FRONTEND_URL` esté configurada en el backend

### Base de datos no conecta

→ Asegúrate de que la base de datos tenga networking público habilitado

### Frontend muestra pantalla blanca

→ Verifica que `REACT_APP_API_URL` esté configurada correctamente

---

## 💡 Consejos

1. **Primero despliega la base de datos**, luego el backend, finalmente el frontend
2. **Guarda todas las URLs y credenciales** en un documento aparte
3. **Prueba cada paso** antes de continuar con el siguiente
4. **Revisa los logs** si algo falla - todas las plataformas tienen una sección de logs

---

## 📞 Recursos de Ayuda

- [Documentación Railway](https://docs.railway.app)
- [Documentación Vercel](https://vercel.com/docs)
- [Documentación Render](https://render.com/docs)
- [Documentación Netlify](https://docs.netlify.com)

---

## ⏱️ Tiempo Estimado

- **Subir a GitHub**: 5 minutos
- **Deploy completo**: 20-30 minutos
- **Total**: ~30-35 minutos

---

¡Éxito con tu deploy! 🎉
