import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';


const jwtSecret ='clave_secreta'; 

interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado, token no accectable.' });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as { userId: string };
    req.userId = decoded.userId;
    next();
  } catch (ex) {
    res.status(400).json({ message: 'Invalido tu token.' });
  }
};
