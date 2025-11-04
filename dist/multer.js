// src/middlewares/multer.ts
import multer from 'multer';
import fs from 'fs';
import { cloudinaryStorage } from './config/cloudinary.js';
const isProduction = process.env.NODE_ENV === 'production';
// Configuración del almacenamiento local (desarrollo)
const localStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'dist/uploads/';
        // Crear directorio si no existe
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `${uniqueSuffix}-${file.originalname}`);
    },
});
// Usar Cloudinary en producción, almacenamiento local en desarrollo
const storage = isProduction ? cloudinaryStorage : localStorage;
console.log(`📦 Storage configurado: ${isProduction ? 'Cloudinary (Producción)' : 'Local (Desarrollo)'}`);
// Filtro para aceptar solo imágenes JPG, JPEG, y PNG
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/webp' ||
        file.mimetype.startsWith('image/')) {
        cb(null, true);
    }
    else {
        cb(new Error('Solo se permiten imágenes en formato JPG, JPEG, PNG o WEBP.'), false);
    }
};
// Configuración de multer
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }, // Ajusta el límite de tamaño a 10MB
});
export default upload; // Exportar el middleware
//# sourceMappingURL=multer.js.map