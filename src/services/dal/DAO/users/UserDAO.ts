// path: src/services/dal/users/UserDAO.ts

import { IUserDAO } from "./IUserDAO";
import {FullUserDto, UserDto} from "@/services/dtos/users/UserDto";
import { UserMapper } from "@/services/mappers/UserMapper";
import prisma from "@/utils/db";

export class UserDAO implements IUserDAO {
    async getAllUsers(): Promise<UserDto[]> {
        const users = await prisma.user.findMany({
            include: { Address: true }, // Include related Address if applicable
        });
        return users.map(UserMapper.toDto); // Map to DTOs
    }

    async getUserById(id: number): Promise<UserDto | null> {
        const user = await prisma.user.findUnique({
            where: { id },
            include: { Address: true }, // Include related Address if applicable
        });
        return user ? UserMapper.toDto(user) : null;
    }

    async createUser(data: FullUserDto): Promise<void> {
        const createdUser = await prisma.user.create({
            data,
            include: { Address: true }, // Include related Address if applicable
        });
    }

    async updateUser(id: number, data: Partial<UserDto>): Promise<UserDto | null> {
        const updatedUser = await prisma.user.update({
            where: { id },
            data: UserMapper.toCreateInput(data), // Convert DTO to Prisma data format
            include: { Address: true }, // Include related Address if applicable
        });
        return updatedUser ? UserMapper.toDto(updatedUser) : null;
    }

    async deleteUser(id: number): Promise<void> {
        await prisma.user.delete({
            where: { id },
        });
    }
}
