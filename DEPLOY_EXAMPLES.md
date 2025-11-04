# 🖼️ Capturas y Ejemplos de Configuración

Este documento muestra ejemplos visuales de cómo configurar cada servicio.

---

## 🚂 Railway - Configuración de Variables

```
Settings → Variables → New Variable

┌─────────────────────────────────────────────┐
│ Variable Name     │ Value                   │
├─────────────────────────────────────────────┤
│ NODE_ENV          │ production              │
│ DB_HOST           │ containers-us-west...   │
│ DB_PORT           │ 3306                    │
│ DB_USER           │ root                    │
│ DB_PASSWORD       │ ******************      │
│ DB_NAME           │ railway                 │
│ JWT_SECRET        │ ******************      │
│ OPENAI_API_KEY    │ sk-proj-*********       │
│ PORT              │ 4000                    │
│ FRONTEND_URL      │ https://tu-app.vercel..│
└─────────────────────────────────────────────┘
```

### Railway - Comandos de Build

```
Settings → Deploy

Build Command:  pnpm install && pnpm run build
Start Command:  node dist/app.js

✓ Verificar que "Source Repo" esté conectado
✓ Verificar que "Auto Deploy" esté activado
```

---

## 🔷 Vercel - Configuración de Variables

```
Project Settings → Environment Variables

┌──────────────────────────────────────────────┐
│ Name                  │ Value                │
├──────────────────────────────────────────────┤
│ REACT_APP_API_URL     │ https://dsw-backend..│
│ GENERATE_SOURCEMAP    │ false                │
└──────────────────────────────────────────────┘

Environment: ☑ Production ☑ Preview ☑ Development
```

### Vercel - Configuración de Build

```
Project Settings → General

Root Directory:     sge
Framework Preset:   Create React App
Build Command:      pnpm run build  (autodetectado)
Output Directory:   build           (autodetectado)
Install Command:    pnpm install    (autodetectado)
```

---

## 🎨 Render - Configuración

```
New Web Service → Settings

Name:               dsw-backend
Environment:        Node
Branch:             main
Root Directory:     (leave empty)
Build Command:      pnpm install && pnpm run build
Start Command:      node dist/app.js
Plan:               Free
```

### Render - Variables de Entorno

```
Environment → Add Environment Variable

┌─────────────────────────────────────────────┐
│ Key               │ Value                   │
├─────────────────────────────────────────────┤
│ NODE_ENV          │ production              │
│ DB_HOST           │ your-db-host.com        │
│ DB_PORT           │ 3306                    │
│ ... (resto igual que Railway)               │
└─────────────────────────────────────────────┘
```

---

## 🗄️ Aiven - MySQL Configuration

```
Create Service

Service Type:       MySQL
Cloud Provider:     AWS
Region:            us-east-1 (o el más cercano)
Service Plan:       Startup-4 (FREE)

Service Name:       dsw-mysql

✓ Wait 2-3 minutes for provisioning
```

### Obtener Credenciales

```
Overview → Connection Information

┌─────────────────────────────────────────────┐
│ Host:     mysql-xxxxx.aivencloud.com       │
│ Port:     12345                            │
│ User:     avnadmin                         │
│ Password: ****************                 │
│ Database: defaultdb                        │
└─────────────────────────────────────────────┘

Copiar estos valores a Railway/Render como:
DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME
```

---

## 🌐 Netlify - Configuración

```
New site from Git → Site settings

Repository:         tu-repo/DSW-TP-FE
Branch:             main
Base directory:     sge
Build command:      pnpm run build
Publish directory:  sge/build
```

### Netlify - Variables de Entorno

```
Site settings → Environment variables → Add a variable

┌──────────────────────────────────────────────┐
│ Key                   │ Value                │
├──────────────────────────────────────────────┤
│ REACT_APP_API_URL     │ https://backend...   │
│ GENERATE_SOURCEMAP    │ false                │
└──────────────────────────────────────────────┘
```

---

## 📂 Estructura de Archivos para Deploy

### Backend (DSW-TP)

```
DSW-TP/
├── .env                    ❌ NO subir a GitHub
├── .env.production.example ✅ Subir (sin valores reales)
├── .gitignore             ✅ Verificar que incluya .env
├── package.json           ✅ Con script "start"
├── tsconfig.json          ✅ Necesario para build
├── render.yaml            ✅ Configuración opcional
├── DEPLOY_*.md            ✅ Documentación
└── src/
    └── app.ts             ✅ Con CORS y PORT dinámicos
```

### Frontend (DSW-TP-FE)

```
DSW-TP-FE/
├── sge/
│   ├── .env                    ❌ NO subir
│   ├── .env.production.example ✅ Subir
│   ├── .gitignore             ✅ Verificar
│   ├── package.json           ✅ OK
│   ├── src/
│   │   ├── config.js          ✅ Configuración API
│   │   └── ...
├── vercel.json                ✅ Config Vercel
└── netlify.toml               ✅ Config Netlify
```

---

## 🔍 Verificación de URLs

### Comandos para verificar que todo funciona:

**Backend (desde terminal o navegador):**

```bash
# Debe devolver lista de eventos (puede estar vacía)
curl https://tu-backend.railway.app/api/eventos

# Debe devolver lista de categorías
curl https://tu-backend.railway.app/api/categorias
```

**Frontend:**

```
Abrir navegador → F12 → Console

No debe haber errores de:
- CORS
- Failed to fetch
- Network error
```

---

## 📊 Logs y Debugging

### Railway

```
Deployments → Click en el último deployment → Logs

Buscar:
✓ "Server running on port XXXX"
✓ "Schema sincronizado" (solo en dev)
✗ "Error connecting to database"
✗ "CORS error"
```

### Render

```
Logs (tab superior)

Buscar lo mismo que Railway
```

### Vercel

```
Deployments → Click en deployment → Building/Logs

✓ "Build completed"
✓ "Export successful"
✗ "Command failed"
```

---

## 🎯 Prueba Final Completa

### 1. Backend Health Check

```
GET https://tu-backend.railway.app/api/eventos
Esperado: [ ] o lista de eventos
```

### 2. Frontend Loading

```
Abrir: https://tu-frontend.vercel.app
Esperado: Página principal visible
```

### 3. Conexión Completa

```
En el frontend:
1. Ir a "Eventos"
2. Abrir F12 → Network
3. Verificar requests a tu backend
4. Status: 200 OK
```

---

## 💡 Tips de Troubleshooting

### Si ves pantalla blanca en frontend:

```
F12 → Console → Buscar errores
Posibles causas:
1. REACT_APP_API_URL mal configurada
2. Backend no responde
3. Error en el build
```

### Si backend da Error 500:

```
Revisar logs de Railway/Render
Posibles causas:
1. Variable de entorno faltante
2. Error de conexión a base de datos
3. Código TypeScript con errores
```

### Si hay error de CORS:

```
Console muestra: "Access-Control-Allow-Origin"
Solución:
1. Agregar FRONTEND_URL en backend
2. Redeploy backend
3. Limpiar caché del navegador
```

---

¡Con estas referencias visuales deberías poder configurar todo sin problemas! 🎉
