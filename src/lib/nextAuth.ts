import {type AuthOptions} from "next-auth";
import GoogleProvider from 'next-auth/providers/google';


export const authOptions: AuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
    ],
    session: {
        strategy: 'jwt',
        maxAge: 60 * 60 * 24 * 30, // 30 days
    },
    jwt: {
        // secret: process.env.JWT_SECRET,
    },
    callbacks: {
        // signIn, session callbacks
    },
    secret: process.env.NEXTAUTH_SECRET as string,
};