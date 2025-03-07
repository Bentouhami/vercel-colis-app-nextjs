import {DefaultSession} from "next-auth";
import {AddressResponseDto, RoleDto} from "@/services/dtos";


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
        role?: RoleDto;
        userAddresses?: AddressResponseDto | null;
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
        role?: RoleDto;
        userAddresses?: AddressResponseDto | null;
        emailVerified?: Date | null;
    }
}

// declare module "next-auth/Session" {
//     interface Session {
//         user: User;
//     }
//
//     interface User {
//         id: number | string | null;
//         firstName?: string | null;
//         lastName?: string | null;
//         name?: string | null;
//         email?: string;
//         phoneNumber?: string | null;
//         image?: string | null;
//         role?: RoleDto;
//         address?: AddressResponseDto | null;
//         emailVerified?: Date | null;
//     }
// }