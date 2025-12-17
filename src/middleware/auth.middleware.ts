import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extender el tipo Request para incluir información del usuario autenticado
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        role: 'usuario' | 'organizador';
        mail: string;
      };
    }
  }
}

/**
 * Middleware para verificar el token JWT en las peticiones
 * El token debe enviarse en el header Authorization como "Bearer <token>"
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    // Obtener el token del header Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ 
        message: 'Token de autenticación requerido' 
      });
    }

    // El formato esperado es "Bearer <token>"
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        message: 'Formato de token inválido. Use: Bearer <token>' 
      });
    }

    // Verificar el token
    const JWT_SECRET = process.env.JWT_SECRET;
    
    if (!JWT_SECRET) {
      console.error('❌ JWT_SECRET no está configurado en las variables de entorno');
      return res.status(500).json({ 
        message: 'Error de configuración del servidor' 
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: number;
      role: 'usuario' | 'organizador';
      mail: string;
    };

    // Agregar la información del usuario al objeto request
    req.user = decoded;
    
    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Token expirado. Por favor, inicia sesión nuevamente' 
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        message: 'Token inválido' 
      });
    }

    console.error('Error en authMiddleware:', error);
    return res.status(500).json({ 
      message: 'Error al verificar el token' 
    });
  }
}

/**
 * Middleware para verificar que el usuario autenticado sea del tipo especificado
 */
export function requireRole(...roles: ('usuario' | 'organizador')[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ 
        message: 'Usuario no autenticado' 
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Acceso denegado. Se requiere rol: ${roles.join(' o ')}` 
      });
    }

    next();
  };
}

/**
 * Middleware para verificar que el usuario solo acceda a sus propios datos
 * Compara el ID del usuario autenticado con el ID del parámetro de la ruta
 */
export function requireSelfOrRole(roles: ('usuario' | 'organizador')[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ 
        message: 'Usuario no autenticado' 
      });
    }

    const resourceId = Number.parseInt(req.params.id);

    // Permitir si es el mismo usuario o tiene un rol autorizado
    if (req.user.id === resourceId || roles.includes(req.user.role)) {
      return next();
    }

    return res.status(403).json({ 
      message: 'No tienes permiso para acceder a este recurso' 
    });
  };
}
