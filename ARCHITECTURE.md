# 🏗️ Arquitectura de Deploy

## Diagrama de la Aplicación Desplegada

```
┌─────────────────────────────────────────────────────────────┐
│                        USUARIO                               │
│                     (Navegador Web)                          │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ HTTPS
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                  VERCEL / NETLIFY                            │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │         FRONTEND (React)                            │    │
│  │  - DSW-TP-FE/sge/                                  │    │
│  │  - Build estático (HTML/CSS/JS)                    │    │
│  │  - Configuración: vercel.json / netlify.toml       │    │
│  │  - Variable: REACT_APP_API_URL                     │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  URL: https://tu-proyecto.vercel.app                        │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ API Calls (HTTPS)
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                  RAILWAY / RENDER                            │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │         BACKEND (Node.js + Express)                 │    │
│  │  - DSW-TP/                                         │    │
│  │  - TypeScript compilado a JavaScript               │    │
│  │  - API REST Endpoints:                             │    │
│  │    • /api/eventos                                  │    │
│  │    • /api/usuarios                                 │    │
│  │    • /api/organizadores                            │    │
│  │    • /api/categorias                               │    │
│  │    • /api/entrada                                  │    │
│  │    • /api/tiposEntradas                            │    │
│  │  - Autenticación JWT                               │    │
│  │  - Moderación con OpenAI                           │    │
│  │  - Upload de imágenes (Multer)                     │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  URL: https://tu-proyecto.railway.app                       │
│                                                              │
│  Variables de Entorno:                                      │
│  - NODE_ENV=production                                      │
│  - PORT=4000                                                │
│  - DB_HOST, DB_USER, DB_PASSWORD, DB_NAME                   │
│  - JWT_SECRET                                               │
│  - OPENAI_API_KEY                                           │
│  - FRONTEND_URL                                             │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ MySQL Protocol
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              RAILWAY MySQL / AIVEN                           │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │         BASE DE DATOS (MySQL)                       │    │
│  │                                                     │    │
│  │  Tablas:                                           │    │
│  │  - eventos                                         │    │
│  │  - usuarios                                        │    │
│  │  - organizadores                                   │    │
│  │  - categorias                                      │    │
│  │  - entradas                                        │    │
│  │  - tipos_entrada                                   │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  Puerto: 3306 (público)                                     │
│  Host: containers-us-west-XXX.railway.app                   │
└─────────────────────────────────────────────────────────────┘

              ┌────────────────────────────┐
              │   SERVICIOS EXTERNOS       │
              ├────────────────────────────┤
              │  OpenAI API                │
              │  - Moderación de contenido │
              │  - Análisis de texto       │
              └────────────────────────────┘
```

---

## 🔄 Flujo de Datos

### 1. Usuario accede a la aplicación

```
Usuario → https://tu-app.vercel.app
  ↓
Vercel sirve el React App (HTML/CSS/JS)
  ↓
Navegador ejecuta JavaScript
```

### 2. Usuario realiza una acción (ej: Ver eventos)

```
React App (Frontend)
  ↓
axios.get('https://tu-backend.railway.app/api/eventos')
  ↓
Backend (Express) recibe request
  ↓
Verifica CORS (origin permitido?)
  ↓
Controller procesa request
  ↓
MikroORM consulta MySQL
  ↓
Base de datos retorna datos
  ↓
Backend envía JSON response
  ↓
Frontend recibe y muestra datos
```

### 3. Usuario crea un evento (con imagen)

```
React Form
  ↓
axios.post con FormData (imagen + datos)
  ↓
Backend recibe request
  ↓
Verifica JWT Token (autenticación)
  ↓
Multer procesa imagen → guarda en /uploads
  ↓
OpenAI modera contenido (descripción)
  ↓
Si aprobado: guarda en MySQL
  ↓
Retorna evento creado
  ↓
Frontend actualiza UI
```

---

## 🌍 URLs Finales

| Componente    | URL Ejemplo                               | Público         |
| ------------- | ----------------------------------------- | --------------- |
| Frontend      | `https://dsw-eventos.vercel.app`          | ✅ Sí           |
| Backend API   | `https://dsw-backend.railway.app`         | ✅ Sí           |
| Base de Datos | `containers-us-west-123.railway.app:3306` | ⚠️ Solo Backend |

---

## 🔒 Seguridad

### CORS Configuration

```typescript
// Backend permite solo:
- http://localhost:3000 (desarrollo)
- https://tu-frontend.vercel.app (producción)
```

### Autenticación

```
Usuario → Login → Backend genera JWT Token
  ↓
Token guardado en localStorage
  ↓
Cada request incluye: Authorization: Bearer <token>
  ↓
Backend verifica token con JWT_SECRET
```

### Variables de Entorno

```
Desarrollo: .env (local, NO se sube a GitHub)
Producción: Configuradas en Railway/Vercel
            (Encriptadas y seguras)
```

---

## 📊 Recursos Utilizados (Plan Gratuito)

### Railway (Backend + DB)

```
CPU:      ~0.1 vCPU
RAM:      512 MB
Storage:  1 GB (DB)
Network:  100 GB/mes
Costo:    $5 crédito/mes (suficiente)
```

### Vercel (Frontend)

```
Bandwidth: 100 GB/mes
Builds:    100/día
Serverless: 100 GB-hrs/mes
Costo:     $0 (gratis)
```

### Total

```
💰 Costo mensual: $0 - $5
📈 Escala para: 1000-5000 usuarios/mes
⚡ Uptime: 99.9%
```

---

## 🔄 CI/CD (Despliegue Continuo)

### Automático con Git

```
Desarrollador hace:
  git add .
  git commit -m "Nueva feature"
  git push origin main

      ↓

Railway detecta push → Rebuild automático
Vercel detecta push → Rebuild automático

      ↓

Nueva versión en vivo en ~2 minutos
```

---

## 🚦 Monitoreo y Logs

### Railway

```
Dashboard → Deployment → Logs
- Ver errores en tiempo real
- Métricas de CPU/RAM
- Request logs
```

### Vercel

```
Dashboard → Deployments → Build Logs
- Estado del build
- Errores de compilación
- Analytics de tráfico
```

---

## 🔧 Mantenimiento

### Actualizaciones

```
1. Hacer cambios localmente
2. Testear en desarrollo
3. git push
4. Deploy automático
```

### Backups

```
Base de Datos:
- Railway: Backups automáticos diarios
- Exportar manualmente: mysqldump
```

### Escalado

```
Si necesitas más recursos:
- Railway: Upgrade a plan Pro ($5/mes)
- Vercel: Upgrade a Pro ($20/mes)
- O migrar a VPS (DigitalOcean, Linode)
```

---

## 🎯 Ventajas de esta Arquitectura

✅ **Gratuito o muy económico**
✅ **Fácil de mantener**
✅ **Escalable**
✅ **Deploy automático con Git**
✅ **SSL/HTTPS incluido**
✅ **CDN global para frontend**
✅ **Backups automáticos**
✅ **Monitoreo incluido**

---

## 📞 Troubleshooting por Componente

### Frontend no carga

```
1. Verificar build exitoso en Vercel
2. Verificar REACT_APP_API_URL
3. Verificar consola del navegador
```

### Backend no responde

```
1. Verificar logs en Railway
2. Verificar variables de entorno
3. Verificar conexión a base de datos
```

### Error de CORS

```
1. Verificar FRONTEND_URL en backend
2. Verificar origin en request
3. Redeploy backend
```

### Base de datos no conecta

```
1. Verificar credenciales
2. Verificar public networking habilitado
3. Verificar firewall/puerto
```

---

¡Esta es la arquitectura completa de tu aplicación desplegada! 🎉
