import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getJwtSecret } from '../config/jwt';
import { readSessionToken } from '../services/sessionCookie';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: 'PATIENT' | 'CLINICIAN' | 'ADMIN';
    patientId?: string;
  };
}

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = readSessionToken(req);

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, getJwtSecret()) as {
      id: string;
      email: string;
      role: 'PATIENT' | 'CLINICIAN' | 'ADMIN';
      patientId?: string;
    };
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired access token' });
  }
};

export const requireRole = (roles: Array<'PATIENT' | 'CLINICIAN' | 'ADMIN'>) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Unauthorized to access this resource' });
    }
    next();
  };
};
