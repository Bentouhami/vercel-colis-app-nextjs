// path: src/services/dal/users/UserDAO.ts

import {IUserDAO} from "./IUserDAO";
import {CreateUserDto, UserDto} from "@/services/dtos/users/UserDto";
import {UserMapper} from "@/services/mappers/UserMapper";
import prisma from "@/utils/db";
import bcrypt from "bcryptjs";

export class UserDAO implements IUserDAO {
    async getAllUsers(): Promise<UserDto[]> {
        const users = await prisma.user.findMany({
            include: {Address: true}, // Include related Address if applicable
        });
        return users.map(UserMapper.toDto); // Map to DTOs
    }

    async getUserById(id: number): Promise<UserDto | null> {
        const user = await prisma.user.findUnique({
            where: {id},
            include: {Address: true}, // Include related Address if applicable
        });
        return user ? UserMapper.toDto(user) : null;
    }

    async createUser(newUser: CreateUserDto) {
        const createdUser = await prisma.user.create({
            data: {
                ...newUser,
                Address: {
                    connect: {id: newUser.Address.connect.id}, // Associe l'adresse existante
                },
            },
            include: {Address: true},
        });

        return createdUser || null;
    }


    async updateUser(id: number, data: Partial<UserDto>): Promise<UserDto | null> {
        const updatedUser = await prisma.user.update({
            where: {id},
            data: UserMapper.toCreateInput(data), // Convert DTO to Prisma data format
            include: {Address: true}, // Include related Address if applicable
        });
        return updatedUser ? UserMapper.toDto(updatedUser) : null;
    }

    async deleteUser(id: number): Promise<void> {
        await prisma.user.delete({
            where: {id},
        });
    }

    static async getUserLoginDto(email: string, password: string) {

        console.log("log ====> getUserLoginUserDto function called in path: src/services/dal/users/UserDAO.ts")
        const user = await prisma.user.findFirst({
            where: {
                email: email},
            include: {
                Address: {
                    select: {
                        street: true,
                        number: true,
                        city: true,
                        zipCode: true,
                        country: true,
                    },
                },
            },
        });

        if (!user) {
            return null;
        }

        // Check if the user exists and has a password
        if (!user.password) {
            throw new Error("Incorrect credentials");
        }

        // Compare passwords
        const passwordValid = await bcrypt.compare(
            String(password), // Explicitly convert to string
            String(user.password) // Explicitly convert to string

        );
        // Use mapper to convert Prisma user to UserDto
        console.log("log ====> user returned from prisma.user.findFirst function in path: src/services/dal/users/UserDAO.ts: ", user);

        return user;
    }
}
