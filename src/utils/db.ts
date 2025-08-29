// path: src/utils/db.ts

// import { PrismaNeon } from "@prisma/adapter-neon";
// import { neonConfig } from "@neondatabase/serverless";

// import ws from "ws";
// import { PrismaClient } from "@prisma/client";
// neonConfig.webSocketConstructor = ws;

// // To work in edge environments (Cloudflare Workers, Vercel Edge, etc.), enable querying over fetch
// neonConfig.poolQueryViaFetch = true;

// // Type definitions
// declare global {
//   var prisma: PrismaClient | undefined;
// }

// const connectionString = `${process.env.DATABASE_URL}`;

// const adapter = new PrismaNeon({ connectionString });
// const prisma = global.prisma || new PrismaClient({ adapter });

// if (process.env.NODE_ENV === "development") global.prisma = prisma;

// export default prisma;

// import { PrismaClient } from '@prisma/client';

// const globalForPrisma = global as unknown as { prisma: PrismaClient };

// const prisma = globalForPrisma.prisma || new PrismaClient();

// if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// export default prisma;

// import {PrismaClient} from '@prisma/client'
// import {PrismaNeon} from '@prisma/adapter-neon'

// const connectionString = `${process.env.DATABASE_URL}`

// const adapter = new PrismaNeon({ connectionString })
// const prisma = new PrismaClient({ adapter })

// export {prisma}
// Ne pas faire d'export default si tu veux utiliser l'import nommé {prisma}

import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

//  REMOVED: fetchConnectionCache is now always true by default
// neonConfig.fetchConnectionCache = true

const connectionString = process.env.DATABASE_URL!;

// Create Neon adapter with connection string directly
const adapter = new PrismaNeon({ connectionString });

// Create Prisma client with adapter
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
