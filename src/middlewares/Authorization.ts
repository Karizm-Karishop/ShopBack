import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/jwt.config';
import { UserRole } from '../database/models/UserModel';

interface DecodedToken {
  userId: number;
  role: UserRole;
}

const authorize = (roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => { 
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        res.status(401).json({ message: 'Authorization header missing' });
        return; 
      }

      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;

      if (!roles.includes(decoded.role)) {
        res.status(403).json({ message: 'Access forbidden: insufficient permissions' });
        return; 
      }

      (req as any).user = decoded;
      next(); 
    } catch (error) {
      res.status(401).json({ message: 'Invalid or expired token' });
    }
  };
};

export default authorize;
