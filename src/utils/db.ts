// path: src/utils/db.ts
// //New from vercel
//
// import { PrismaClient } from "@prisma/client"
//
// const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
//
// export const prisma = globalForPrisma.prisma || new PrismaClient()
//
// if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

import {PrismaClient} from "@prisma/client";
import {Pool} from "@neondatabase/serverless";
import {PrismaNeon} from "@prisma/adapter-neon";

const prismaClientSingleton = () => {
    const neon = new Pool({
        connectionString: process.env.POSTGRES_PRISMA_URL
    });
    const adapter = new PrismaNeon(neon)
    return new PrismaClient({adapter});
};

declare global {
    var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;