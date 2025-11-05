# 🚀 Deployment

## EN MODO PRODUCCION.

### Backend - Railway

- **URL:** https://dsw-tp-be-production.up.railway.app
- **Plataforma:** Railway (región: asia-southeast1)
- **Base de datos:** MySQL en Railway
- **Variables de entorno requeridas:**
  - `NODE_ENV=production`
  - `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
  - `JWT_SECRET`
  - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
  - `OPENAI_API_KEY`

### Frontend - Vercel

- **URL:** https://dsw-tp-fe.vercel.app
- **Plataforma:** Vercel
- **Variables de entorno requeridas:**
  - `REACT_APP_API_URL=https://dsw-tp-be-production.up.railway.app`

### Almacenamiento de Imágenes - Cloudinary

- **Servicio:** Cloudinary
- **Uso:** Almacenamiento persistente de imágenes de eventos
- **Carpeta:** `eventos/`
- **Nota:** Railway tiene sistema de archivos efímero, por eso usamos Cloudinary en producción

## Flujo de Deployment

1. **Backend:** Push a `main` → Railway deploy automático
2. **Frontend:** Push a `master` → Vercel deploy automático
3. **Imágenes:** Se suben automáticamente a Cloudinary cuando `NODE_ENV=production`

## Comandos Útiles

```bash
# Backend - Deploy manual
railway up

# Frontend - Deploy manual
vercel --prod

# Verificar logs backend
railway logs

# Verificar logs frontend
vercel logs
```

railway connect mysql para conectar la terminal a la bdd de railway.
