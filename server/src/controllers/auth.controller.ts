import { Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/db';
import { memoryFallbackAllowed } from '../models/dataStore';
import { AuthenticatedRequest } from '../middleware/auth';
import { 
  registerSchema, 
  loginSchema, 
  profileSetupSchema, 
  forgotPasswordSchema 
} from '../validation/schemas';
import { getJwtSecret } from '../config/jwt';
import {
  setSessionCookie,
  clearSessionCookie,
  SESSION_MAX_AGE_MS,
} from '../services/sessionCookie';

// Development-only fallback store. No demo or shared credentials are seeded.
const inMemoryUsers: any[] = [];

export const register = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const { email, password, name, age, gender, language } = validatedData;

    const hashedPassword = await bcrypt.hashSync(password, 10);

    let newUser: any;

    try {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already in use' });
      }

      newUser = await prisma.user.create({
        data: {
          email,
          passwordHash: hashedPassword,
          name,
          age,
          gender,
          language,
        }
      });
      console.log('Created user via Prisma:', newUser.email);
    } catch (dbError) {
      if (!memoryFallbackAllowed()) throw dbError;
      console.warn('Prisma DB error. Falling back to memory store for demo:', dbError);

      const existingInMemory = inMemoryUsers.find(u => u.email === email);
      if (existingInMemory) {
        return res.status(400).json({ error: 'Email already in use (demo store)' });
      }

      newUser = {
        id: `demo-user-${Date.now()}`,
        email,
        passwordHash: hashedPassword,
        name,
        age,
        gender,
        language,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      inMemoryUsers.push(newUser);
    }

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: 'PATIENT' },
      getJwtSecret(),
      { expiresIn: '7d' }
    );
    setSessionCookie(res, token, SESSION_MAX_AGE_MS.rememberedLegacy);

    const { passwordHash: _, ...userWithoutPassword } = newUser;
    return res.status(201).json({
      message: 'Registration successful',
      user: userWithoutPassword,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    let user: any;

    try {
      user = await prisma.user.findUnique({
        where: { email }
      });
    } catch (dbError) {
      if (!memoryFallbackAllowed()) throw dbError;
      console.warn('Prisma DB error on login. Checking memory store:', dbError);
      user = inMemoryUsers.find(u => u.email === email);
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isPasswordValid = bcrypt.compareSync(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: 'PATIENT' },
      getJwtSecret(),
      { expiresIn: '7d' }
    );
    setSessionCookie(res, token, SESSION_MAX_AGE_MS.rememberedLegacy);

    const { passwordHash: _, ...userWithoutPassword } = user;
    return res.status(200).json({
      message: 'Login successful',
      user: userWithoutPassword,
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    let user: any;

    try {
      user = await prisma.user.findUnique({
        where: { id: req.user.id }
      });
    } catch (dbError) {
      if (!memoryFallbackAllowed()) throw dbError;
      user = inMemoryUsers.find(u => u.id === req.user?.id);
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { passwordHash: _, ...userWithoutPassword } = user;
    return res.status(200).json({ user: userWithoutPassword });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const validatedData = profileSetupSchema.parse(req.body);
    const { age, gender, language } = validatedData;

    let updatedUser: any;

    try {
      updatedUser = await prisma.user.update({
        where: { id: req.user.id },
        data: {
          age,
          gender,
          language
        }
      });
      console.log('Updated user profile via Prisma for:', req.user.id);
    } catch (dbError) {
      if (!memoryFallbackAllowed()) throw dbError;
      console.warn('Prisma DB error updating user. Falling back to memory store:', dbError);

      const userInMemory = inMemoryUsers.find(u => u.id === req.user?.id);
      if (!userInMemory) {
        return res.status(404).json({ error: 'User not found in memory store' });
      }

      userInMemory.age = age;
      userInMemory.gender = gender;
      userInMemory.language = language;
      updatedUser = userInMemory;
    }

    const { passwordHash: _, ...userWithoutPassword } = updatedUser;
    return res.status(200).json({
      message: 'Profile updated successfully',
      user: userWithoutPassword
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { email } = forgotPasswordSchema.parse(req.body);

    let userExists = false;

    try {
      const user = await prisma.user.findUnique({ where: { email } });
      userExists = !!user;
    } catch (dbError) {
      if (!memoryFallbackAllowed()) throw dbError;
      userExists = inMemoryUsers.some(u => u.email === email);
    }

    if (!userExists) {
      return res.status(200).json({
        message: 'If the email exists, a password reset link has been dispatched.'
      });
    }

    const resetToken = jwt.sign({ email }, getJwtSecret(), { expiresIn: '1h' });
    const resetLink = `${process.env.CLIENT_ORIGIN || 'http://localhost:5173'}/auth/reset-password?token=${resetToken}`;

    return res.status(200).json({
      message: 'If the email exists, a password reset link has been dispatched.',
      debugResetLink: resetLink
    });
  } catch (error) {
    next(error);
  }
};

export const logout = (_req: AuthenticatedRequest, res: Response) => {
  clearSessionCookie(res);
  return res.status(200).json({ success: true, message: 'Signed out.' });
};

export { inMemoryUsers };
