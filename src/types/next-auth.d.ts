import { DefaultSession } from "next-auth";
import { CreateAddressDto, Roles} from "@/utils/dtos";


declare module "next-auth" {
    interface Session {
        user: User & DefaultSession["user"];
    }
    interface User {
        id: number | string | null;
        firstName?: string | null;
        lastName?: string | null;
        name?: string | null;
        email?: string;
        phoneNumber?: string | null;
        image?: string | null;
        roles?: Roles[];
        address?: CreateAddressDto | null;
        emailVerified?: Date | null;

    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: number | string | null;
        firstName?: string | null;
        lastName?: string | null;
        name?: string | null;
        email?: string;
        phoneNumber?: string | null;
        image?: string | null;
        roles?: Roles[];
        address?: CreateAddressDto | null;
        emailVerified?: Date | null;
    }
}