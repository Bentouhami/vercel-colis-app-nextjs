import  NextAuth  from "next-auth";
import {PrismaAdapter} from "@auth/prisma-adapter";

import prisma from "@/utils/db";
import authConfig from "@auth.config";

export const {
    handlers : {GET, POST},
    auth,
} = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: 'jwt',
    },
    ...authConfig,
});
