# 📸 Implementación de Imágenes

## Tecnología Utilizada

**Multer** - Middleware de Node.js para el manejo de `multipart/form-data`, usado para subir archivos.

## ¿Cómo Funciona?

### 1. Configuración (Backend)

**Archivo**: `src/multer.ts`

```typescript
import multer from 'multer'

// Configurar dónde y cómo guardar los archivos
const storage = multer.diskStorage({
  destination: 'dist/uploads/', // Carpeta de destino
  filename: (req, file, cb) => {
    // Nombre único: timestamp-random-nombre.jpg
    cb(
      null,
      Date.now() +
        '-' +
        Math.round(Math.random() * 1e9) +
        '-' +
        file.originalname
    )
  },
})

// Filtro: solo imágenes
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true)
  } else {
    cb(new Error('Solo se permiten imágenes'))
  }
}

export const upload = multer({ storage, fileFilter })
```

### 2. Uso en Rutas

**Archivo**: `src/evento/evento.routes.ts`

```typescript
import { upload } from '../multer.js'

// Endpoint que acepta imágenes
eventoRouter.post('/', upload.single('photo'), add)
```

### 3. Procesamiento en Controller

**Archivo**: `src/evento/evento.controller.ts`

```typescript
async function add(req: Request, res: Response) {
  const eventoData = req.body

  // Si se subió una imagen, guardar la ruta
  if (req.file) {
    eventoData.photo = req.file.path.replace(/\\/g, '/').replace('dist/', '')
    // Resultado: "uploads/1733709369759-422125895-evento.jpg"
  }

  const evento = em.create(Evento, eventoData)
  await em.persistAndFlush(evento)
}
```

### 4. Servir Imágenes

**Archivo**: `src/app.ts`

```typescript
// Servir archivos estáticos desde /uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
```

### 5. Frontend - Subir Imagen

**Archivo**: `src/pages/EventoCreate.js`

```javascript
const [photo, setPhoto] = useState(null)

// Input de archivo
;<input
  type="file"
  accept="image/*"
  onChange={(e) => setPhoto(e.target.files[0])}
/>

// Enviar con FormData
const formData = new FormData()
formData.append('photo', photo)
formData.append('name', name)
formData.append('description', description)

await axios.post('http://localhost:4000/api/eventos', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
})
```

### 6. Frontend - Mostrar Imagen

```javascript
<img src={`http://localhost:4000/${evento.photo}`} alt={evento.name} />
```

## Flujo Completo

```
Usuario selecciona imagen
        ↓
Frontend crea FormData
        ↓
POST a /api/eventos
        ↓
Multer intercepta el archivo
        ↓
Guarda en dist/uploads/
        ↓
Genera nombre único
        ↓
Controller guarda ruta en BD
        ↓
Frontend accede vía URL
http://localhost:4000/uploads/archivo.jpg
```

## Formatos Soportados

- ✅ JPG / JPEG
- ✅ PNG
- ✅ GIF
- ✅ Cualquier formato con MIME type `image/*`

## Estructura de Archivos

```
dist/
└── uploads/
    ├── 1733709369759-422125895-evento1.jpg
    ├── 1733709649983-338171740-evento2.png
    └── 1733713841527-339791339-evento3.jpg
```

## Características

- ✅ Nombre único para evitar colisiones
- ✅ Filtrado por tipo de archivo
- ✅ Almacenamiento en sistema de archivos
- ✅ Servido como archivos estáticos
