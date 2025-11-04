import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { Request } from 'express';

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configurar storage de Cloudinary para Multer
const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req: Request, file: Express.Multer.File) => {
    return {
      folder: 'eventos', // Carpeta en Cloudinary donde se guardarán las imágenes
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: [{ width: 1000, height: 1000, crop: 'limit' }], // Opcional: redimensionar
      public_id: `evento-${Date.now()}`, // Nombre único del archivo
    };
  },
});

export { cloudinary, cloudinaryStorage };
