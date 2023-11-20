import { PrismaClient } from '@prisma/client';
import { get } from 'env-var'
import { PHASE_PRODUCTION_BUILD } from 'next/constants';
const globalForPrisma = global as unknown as { prisma: PrismaClient };

const NODE_ENV = get('NODE_ENV').default('development').asEnum(['development', 'production'])
const NEXT_PHASE = get('NEXT_PHASE').asString()

const isProductionEnv = NODE_ENV === 'production'
const isBuildingProduction = NEXT_PHASE === PHASE_PRODUCTION_BUILD

// This will throw an error if the DATABASE_URL environment variable is missing
// at runtime, but will not throw when compiling a production build using next
const DATABASE_URL = get('DATABASE_URL').required(isProductionEnv && !isBuildingProduction).asUrlString()

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        // when using a pooled database connection with prisma, you need to append`?pgbouncer=true` to the connection string.
        // The reason this is done here rather than in the .env file is because the Neon Vercel integration doesn't include it.
        url: `${DATABASE_URL}?pgbouncer=true&connect_timeout=10&pool_timeout=10`,
      },
    },
  });

if (isProductionEnv) globalForPrisma.prisma = prisma;
