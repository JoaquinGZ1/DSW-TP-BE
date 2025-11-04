# 🛠️ Comandos Útiles para Deploy

Todos los comandos PowerShell para facilitar el proceso de deploy.

---

## 🐙 Git y GitHub

### Inicializar y Subir Backend

```powershell
# Navegar al directorio del backend
cd c:\Users\joaqu\Desktop\DSW\DSW-TP

# Inicializar git (si no está inicializado)
git init

# Ver archivos que se subirán
git status

# Agregar todos los archivos
git add .

# Hacer commit
git commit -m "Preparado para deploy: backend con CORS dinámico y configuración de producción"

# Conectar con GitHub (reemplaza TU-USUARIO y TU-REPO)
git remote add origin https://github.com/TU-USUARIO/TU-REPO-BACKEND.git

# Subir a GitHub
git branch -M main
git push -u origin main
```

### Inicializar y Subir Frontend

```powershell
# Navegar al directorio del frontend
cd c:\Users\joaqu\Desktop\DSW\DSW-TP-FE

# Inicializar git (si no está inicializado)
git init

# Ver archivos que se subirán
git status

# Agregar todos los archivos
git add .

# Hacer commit
git commit -m "Preparado para deploy: frontend con configuración centralizada de API"

# Conectar con GitHub (reemplaza TU-USUARIO y TU-REPO)
git remote add origin https://github.com/TU-USUARIO/TU-REPO-FRONTEND.git

# Subir a GitHub
git branch -M main
git push -u origin main
```

### Actualizar después de cambios

```powershell
# En el directorio del proyecto (backend o frontend)
git add .
git commit -m "Descripción de los cambios"
git push
```

---

## 🔍 Verificación Local Antes de Deploy

### Backend - Verificar que compila

```powershell
cd c:\Users\joaqu\Desktop\DSW\DSW-TP

# Instalar dependencias (si no están instaladas)
pnpm install

# Compilar TypeScript
pnpm run build

# Verificar que dist/ se creó correctamente
ls dist
```

### Frontend - Verificar build

```powershell
cd c:\Users\joaqu\Desktop\DSW\DSW-TP-FE\sge

# Instalar dependencias (si no están instaladas)
pnpm install

# Crear build de producción
pnpm run build

# Verificar que build/ se creó correctamente
ls build
```

---

## 🧪 Testing Local con Variables de Entorno

### Backend - Probar en modo producción localmente

```powershell
cd c:\Users\joaqu\Desktop\DSW\DSW-TP

# Configurar variables temporalmente
$env:NODE_ENV="production"
$env:PORT="4000"

# Ejecutar
pnpm run build
node dist/app.js

# El servidor NO debería sincronizar schema en modo producción
```

### Frontend - Probar con API de producción

```powershell
cd c:\Users\joaqu\Desktop\DSW\DSW-TP-FE\sge

# Configurar variable temporal (reemplaza con tu URL)
$env:REACT_APP_API_URL="https://tu-backend.railway.app"

# Ejecutar en modo desarrollo
pnpm start

# O crear build
pnpm run build
```

---

## 🔐 Generar Secretos Seguros

### JWT_SECRET para producción

```powershell
# Opción 1: PowerShell nativo (genera hex aleatorio)
-join ((48..57) + (65..70) | Get-Random -Count 64 | ForEach-Object {[char]$_})

# Opción 2: Generar con Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Verificar JWT_SECRET actual

```powershell
cd c:\Users\joaqu\Desktop\DSW\DSW-TP
cat .env | Select-String JWT_SECRET
```

---

## 📦 Gestión de Dependencias

### Verificar versiones instaladas

```powershell
# Node.js
node --version

# PNPM
pnpm --version

# Lista de dependencias del proyecto
pnpm list
```

### Instalar dependencias limpias

```powershell
# Eliminar node_modules y lock
rm -Recurse -Force node_modules
rm pnpm-lock.yaml

# Reinstalar todo
pnpm install
```

---

## 🗄️ Base de Datos

### Conectar a MySQL local (para pruebas)

```powershell
# Si tienes MySQL instalado localmente
mysql -u dsw -p dsw

# Dentro de MySQL:
# SHOW TABLES;
# SELECT * FROM eventos;
# EXIT;
```

### Conectar a MySQL de Railway (si tienes MySQL client)

```powershell
# Reemplaza con tus credenciales de Railway
mysql -h containers-us-west-XXX.railway.app -u root -p railway
```

---

## 🌐 Pruebas de API

### Probar endpoints del backend

```powershell
# Con curl (si está instalado)
curl https://tu-backend.railway.app/api/eventos

# Con PowerShell (alternativa)
Invoke-RestMethod -Uri "https://tu-backend.railway.app/api/eventos"

# Prueba de POST (crear evento) - requiere autenticación
$headers = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer TU-TOKEN-JWT"
}
$body = @{
    nombre = "Evento de Prueba"
    descripcion = "Descripción"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://tu-backend.railway.app/api/eventos" -Method POST -Headers $headers -Body $body
```

---

## 🔄 Redeploy Rápido

### Railway - Trigger redeploy desde CLI (si usas Railway CLI)

```powershell
# Instalar Railway CLI (primera vez)
# npm i -g @railway/cli

# Login
railway login

# Link proyecto
railway link

# Deploy
railway up
```

### Vercel - Redeploy desde CLI

```powershell
# Instalar Vercel CLI (primera vez)
npm i -g vercel

# Login
vercel login

# Deploy
cd c:\Users\joaqu\Desktop\DSW\DSW-TP-FE\sge
vercel --prod
```

---

## 🧹 Limpieza

### Limpiar builds locales

```powershell
# Backend
cd c:\Users\joaqu\Desktop\DSW\DSW-TP
rm -Recurse -Force dist

# Frontend
cd c:\Users\joaqu\Desktop\DSW\DSW-TP-FE\sge
rm -Recurse -Force build
```

### Limpiar caché

```powershell
# PNPM cache
pnpm store prune

# NPM cache (si usaste npm)
npm cache clean --force
```

---

## 📊 Logs y Debugging

### Ver logs en tiempo real (si usas Railway CLI)

```powershell
railway logs
```

### Verificar archivos que Git subirá

```powershell
# Ver qué archivos están siendo trackeados
git ls-files

# Ver qué archivos están siendo ignorados
git status --ignored
```

### Verificar que .env NO está en Git

```powershell
# Este comando NO debe mostrar .env
git ls-files | Select-String ".env"

# Verificar .gitignore
cat .gitignore | Select-String ".env"
```

---

## 🎯 Comandos de Emergencia

### Si olvidaste subir .gitignore y subiste .env

```powershell
# URGENTE: Remover .env del historial de Git
git rm --cached .env
git commit -m "Remover .env del repositorio"
git push

# Luego CAMBIAR todos los secretos (JWT_SECRET, DB_PASSWORD, etc.)
```

### Si el puerto está en uso localmente

```powershell
# Encontrar proceso usando puerto 4000
netstat -ano | findstr :4000

# Matar proceso (reemplaza PID)
taskkill /PID NUMERO_PID /F
```

### Si hay conflictos en Git

```powershell
# Ver conflictos
git status

# Resetear a última versión (CUIDADO: perderás cambios locales)
git reset --hard origin/main

# O resolver manualmente y luego:
git add .
git commit -m "Resolver conflictos"
git push
```

---

## 📝 Comandos de Información

### Ver configuración actual

```powershell
# Backend
cd c:\Users\joaqu\Desktop\DSW\DSW-TP
cat package.json | Select-String "scripts|name|version"

# Frontend
cd c:\Users\joaqu\Desktop\DSW\DSW-TP-FE\sge
cat package.json | Select-String "scripts|name|version"
```

### Ver variables de entorno (local)

```powershell
# Ver .env sin exponer valores sensibles
cat .env | Select-String "^[A-Z]" | ForEach-Object { $_.ToString().Split('=')[0] }
```

---

## 🚀 Script Completo de Deploy

### Todo en uno (después de tener repos en GitHub)

```powershell
# Backend
cd c:\Users\joaqu\Desktop\DSW\DSW-TP
git add .
git commit -m "Deploy: backend listo"
git push

# Frontend
cd c:\Users\joaqu\Desktop\DSW\DSW-TP-FE
git add .
git commit -m "Deploy: frontend listo"
git push

Write-Host "✅ Código actualizado en GitHub"
Write-Host "➡️  Ahora configura Railway y Vercel siguiendo DEPLOY_QUICK.md"
```

---

¡Usa estos comandos según los necesites en el proceso! 🎉
