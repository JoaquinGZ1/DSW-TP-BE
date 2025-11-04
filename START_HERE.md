# 🚀 INSTRUCCIONES DE DEPLOY

## 📚 Documentación Completa

Tu aplicación está **lista para deploy**. Todos los archivos de configuración están preparados.

### 📖 Guías Disponibles

| Documento                                        | Descripción                | Tiempo | Dificultad |
| ------------------------------------------------ | -------------------------- | ------ | ---------- |
| **[DEPLOY_QUICK.md](./DEPLOY_QUICK.md)**         | ⚡ Guía rápida paso a paso | 20 min | ⭐⭐       |
| **[DEPLOY_GUIDE.md](./DEPLOY_GUIDE.md)**         | 📚 Guía completa detallada | 40 min | ⭐⭐⭐     |
| **[DEPLOY_CHECKLIST.md](./DEPLOY_CHECKLIST.md)** | ✅ Checklist interactivo   | -      | ⭐         |
| **[DEPLOY_EXAMPLES.md](./DEPLOY_EXAMPLES.md)**   | 🖼️ Ejemplos visuales       | -      | ⭐         |
| **[DEPLOY_COMMANDS.md](./DEPLOY_COMMANDS.md)**   | 🛠️ Comandos útiles         | -      | ⭐⭐       |

---

## 🎯 Recomendación: Comienza Aquí

### Para estudiantes / Primera vez desplegando:

👉 **Lee [DEPLOY_QUICK.md](./DEPLOY_QUICK.md)** y sigue los pasos

### Si tienes experiencia:

👉 **Usa [DEPLOY_CHECKLIST.md](./DEPLOY_CHECKLIST.md)** como referencia

### Si algo falla:

👉 **Consulta [DEPLOY_EXAMPLES.md](./DEPLOY_EXAMPLES.md)** para troubleshooting

---

## ⚡ Resumen Ultra-Rápido

### 1. Sube tu código a GitHub

```powershell
git init
git add .
git commit -m "Deploy ready"
git push
```

### 2. Deploy Base de Datos + Backend

- Ve a [railway.app](https://railway.app)
- Crea MySQL → Copia credenciales
- Deploy backend desde GitHub
- Configura variables de entorno

### 3. Deploy Frontend

- Ve a [vercel.com](https://vercel.com)
- Import desde GitHub
- Root directory: `sge`
- Configura `REACT_APP_API_URL`

### 4. Conecta todo

- Agrega `FRONTEND_URL` en backend
- Redeploy backend
- ¡Prueba tu app!

---

## 🌐 Servicios Gratuitos Recomendados

| Servicio    | Para         | Límite Gratuito | URL         |
| ----------- | ------------ | --------------- | ----------- |
| **Railway** | Backend + DB | $5 crédito/mes  | railway.app |
| **Vercel**  | Frontend     | 100GB bandwidth | vercel.com  |
| **Render**  | Backend      | 750 hrs/mes     | render.com  |
| **Netlify** | Frontend     | 100GB bandwidth | netlify.com |
| **Aiven**   | MySQL DB     | Plan startup    | aiven.io    |

---

## ✅ Archivos de Configuración Preparados

### Backend

- ✅ `src/app.ts` - CORS dinámico + puerto flexible
- ✅ `package.json` - Script `start` configurado
- ✅ `render.yaml` - Configuración para Render
- ✅ `.env.production.example` - Template de variables
- ✅ `.gitignore` - Protege archivos sensibles

### Frontend

- ✅ `sge/src/config.js` - Configuración de API
- ✅ `vercel.json` - Configuración para Vercel
- ✅ `netlify.toml` - Configuración para Netlify
- ✅ `.env.production.example` - Template de variables
- ✅ `.gitignore` - Protege archivos sensibles

---

## 🔑 Variables de Entorno Necesarias

### Backend (Railway/Render)

```
NODE_ENV=production
PORT=4000
DB_HOST=<tu-mysql-host>
DB_PORT=3306
DB_USER=<usuario>
DB_PASSWORD=<contraseña>
DB_NAME=<nombre-bd>
JWT_SECRET=<genera-uno-nuevo>
OPENAI_API_KEY=<tu-api-key>
FRONTEND_URL=<tu-url-vercel>
```

### Frontend (Vercel/Netlify)

```
REACT_APP_API_URL=<tu-url-backend>
GENERATE_SOURCEMAP=false
```

---

## 🎓 Para Entregar al Profesor

Una vez completado el deploy, proporciona:

1. **URL de la aplicación**: `https://tu-app.vercel.app`
2. **Repositorios** (opcional):
   - Backend: `https://github.com/tu-usuario/backend`
   - Frontend: `https://github.com/tu-usuario/frontend`

---

## 🆘 Ayuda

### Si tienes dudas:

1. Revisa [DEPLOY_EXAMPLES.md](./DEPLOY_EXAMPLES.md) para ejemplos visuales
2. Usa [DEPLOY_COMMANDS.md](./DEPLOY_COMMANDS.md) para comandos específicos
3. Consulta la documentación oficial de cada plataforma

### Errores comunes:

- **Error de CORS**: Agrega `FRONTEND_URL` en backend
- **Error 500**: Verifica variables de entorno y logs
- **Pantalla blanca**: Verifica `REACT_APP_API_URL`
- **DB no conecta**: Verifica credenciales y public networking

---

## ⏱️ Tiempo Estimado

- **Preparación de código**: Ya está listo ✅
- **Subir a GitHub**: 5 minutos
- **Deploy completo**: 20-30 minutos
- **Testing**: 5 minutos
- **Total**: ~30-40 minutos

---

## 🎉 ¡Todo Listo!

Tu aplicación tiene:

- ✅ Backend con API REST
- ✅ Frontend con React
- ✅ Sistema de autenticación (JWT)
- ✅ Gestión de imágenes
- ✅ Mapas con OpenStreetMap
- ✅ Moderación con IA (OpenAI)
- ✅ Base de datos MySQL

**Ahora solo falta desplegarla siguiendo las guías. ¡Éxito! 🚀**

---

## 📞 Recursos

- [Documentación Railway](https://docs.railway.app)
- [Documentación Vercel](https://vercel.com/docs)
- [Documentación Render](https://render.com/docs)
- [Documentación Netlify](https://docs.netlify.com)

---

**Última actualización**: Noviembre 2025
**Versión**: 1.0
**Estado**: ✅ Listo para deploy
