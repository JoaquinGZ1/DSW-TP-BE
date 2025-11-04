# 🚀 Guía Rápida de Deploy - Pasos Esenciales

## 📋 Pre-requisitos

- Cuenta en GitHub
- Tu código subido a GitHub (2 repositorios: backend y frontend)

---

## ⚡ OPCIÓN RÁPIDA: Railway + Vercel (Recomendado)

### 1️⃣ Base de Datos (5 minutos)

```
1. Ir a railway.app
2. Login con GitHub
3. "New Project" → "Provision MySQL"
4. Copiar credenciales (Variables tab)
```

### 2️⃣ Backend (10 minutos)

```
1. En Railway: "New" → "GitHub Repo" → Selecciona DSW-TP
2. Settings → Variables → Agregar:
   - NODE_ENV=production
   - DB_HOST=<de railway mysql>
   - DB_PORT=3306
   - DB_USER=<de railway mysql>
   - DB_PASSWORD=<de railway mysql>
   - DB_NAME=<de railway mysql>
   - JWT_SECRET=<tu jwt del .env>
   - OPENAI_API_KEY=<tu openai key>
   - PORT=4000

3. Settings → Generate Domain
4. Copiar URL (ej: https://dsw-backend.railway.app)
```

### 3️⃣ Frontend (5 minutos)

```
1. Ir a vercel.com
2. "New Project" → Import tu repo DSW-TP-FE
3. Root Directory: sge
4. Environment Variables:
   - REACT_APP_API_URL=<tu URL de railway del paso 2>
   - GENERATE_SOURCEMAP=false

5. Deploy
```

### 4️⃣ Actualizar CORS en Backend

```
1. En Railway, agregar variable:
   - FRONTEND_URL=<tu URL de vercel>

2. Hacer commit y push del código actualizado
   (El código ya está preparado con los cambios de CORS)
```

---

## 🎯 URLS FINALES

- **Frontend**: https://tu-proyecto.vercel.app
- **Backend**: https://tu-proyecto.railway.app
- **Base de Datos**: MySQL en Railway

---

## ✅ Testing

1. Visita tu frontend en Vercel
2. Intenta registrarte o crear un evento
3. Si hay error de CORS: verifica que FRONTEND_URL esté en Railway

---

## 🐛 Si algo falla

### Error de CORS

→ Agrega FRONTEND_URL en variables de Railway

### Error 500

→ Revisa logs en Railway (click en el deployment)

### Frontend no conecta

→ Verifica REACT_APP_API_URL en Vercel

---

## 💡 Alternativas

### Si Railway se queda sin crédito:

- **Backend**: Render.com (750 hrs/mes gratis)
- **Base de Datos**: Aiven.io (plan gratuito)

### Si Vercel no funciona:

- **Frontend**: Netlify (similar a Vercel)

---

## 📱 Entrega al Profesor

Proporciona estas URLs:

- **Aplicación Web**: https://tu-proyecto.vercel.app
- **API (opcional)**: https://tu-proyecto.railway.app/api/eventos

---

## ⏱️ Tiempo Estimado Total: 20-30 minutos

¡Listo! Tu aplicación estará en línea y accesible desde cualquier lugar.
