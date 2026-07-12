import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/whitestone_db";

let prismaInstance: PrismaClient;

if (typeof window === 'undefined') {
  // Safe instantiation on Server side
  const pool = new Pool({
    connectionString,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });
  
  // Suppress uncaught pool connection errors
  pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
  });

  const adapter = new PrismaPg(pool);
  
  prismaInstance =
    globalForPrisma.prisma ||
    new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
} else {
  // Safe fallback for Client side bundle generation (SPA hydration check)
  prismaInstance = null as unknown as PrismaClient;
}

export const prisma = prismaInstance;

if (process.env.NODE_ENV !== 'production' && typeof window === 'undefined') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
