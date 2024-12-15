// path: src/services/dal/users/IUserDAO.ts


import { FullUserDto, UserDto} from "@/services/dtos/users/UserDto";

import {User as UserPrisma} from "@prisma/client";

export interface IUserDAO {
    getAllUsers(): Promise<UserPrisma[] |  null>;
    getUserById(id: number): Promise<UserPrisma | null>;
    getUserByEmail(email: string): Promise<UserPrisma | null>;
    createUser(data: FullUserDto): Promise<void>;
    updateUser(id: number, data: Partial<UserPrisma>): Promise<UserPrisma | null>;
    deleteUser(id: number): Promise<void>;
}