import { PrismaClient } from '@prisma/client';

let _prisma: PrismaClient | null = null;

export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    if (_prisma === null) {
      _prisma = new PrismaClient();
    }
    return (_prisma as any)[prop];
  },
  has(_target, prop) {
    if (_prisma === null) {
      _prisma = new PrismaClient();
    }
    return Object.hasOwn(_prisma, prop);
  }
});
