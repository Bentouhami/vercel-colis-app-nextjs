// path: src/utils/db.ts
import { PrismaClient } from "@prisma/client";
import { Pool } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";

// Function to create PrismaClient with Neon adapter
const createPrismaClient = () => {
    // Create a Neon connection pool
    const neonPool = new Pool({
        connectionString: process.env.POSTGRES_PRISMA_URL || "",
    });

    // Use PrismaNeon adapter with the pool
    const adapter = new PrismaNeon(neonPool);

    // Return a PrismaClient instance
    return new PrismaClient({ adapter });
};

// Global declaration to prevent multiple instances
declare global {
    // eslint-disable-next-line no-var
    var prisma: PrismaClient | undefined;
}

// Create a PrismaClient instance
const prisma =
    global.prisma ||
    (global.prisma = createPrismaClient());

// Export the Prisma instance
export default prisma;

// Ensure no global pollution in production
if (process.env.NODE_ENV === "production") {
    global.prisma = undefined;
}
//
// import { PrismaClient } from "@prisma/client";
//
// const globalForPrisma = global as unknown as { prisma: PrismaClient };
//
// const prisma = globalForPrisma.prisma || new PrismaClient();
//
// if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
//
// export default prisma;
