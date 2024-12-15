// path: src/services/dal/users/UserDAO.ts

import {IUserDAO} from "./IUserDAO";
import {FullUserDto} from "@/services/dtos/users/UserDto";
import {Address as AddressPrisma, User as UserPrisma} from "@prisma/client";
import prisma from "@/utils/db";


/**
 * UserDAO class is responsible for interacting with the User table in the database.
 * It provides methods to retrieve, create, update, and delete user data.
 */
export class UserDAO implements IUserDAO {

    /**
     * Retrieves all users from the database.
     * @returns {Promise<UserPrisma[] | null>} An array of UserDto objects, or null if no users are found.
     */
    async getAllUsers(): Promise<UserPrisma[] | null> {
        const users = await prisma.user.findMany({
            include: {Address: true}, // Include related Address if applicable
        });

        if (!users) {
            return null;
        }
        return users; // Map to DTOs
    }

    /**
     * Retrieves a user by their ID from the database.
     * @param id - The ID of the user to retrieve.
     * @returns {Promise<UserPrisma | null>} The UserDto object, or null if the user is not found.
     */
    async getUserById(id: number): Promise<UserPrisma | null> {
        const user = await prisma.user.findUnique({
            where: {id},
            include: {Address: true}, // Include related Address if applicable
        });
        if (!user) {
            return null;
        }
        return user;
    }

    /**
     * Creates a new user in the database.
     * @param data - The data to create the user with.
     * @returns {Promise<void>} A Promise that resolves when the user is created.
     */
    async createUser(data: FullUserDto): Promise<void> {
        const createdUser = await prisma.user.create({
            data,
            include: {Address: true}, // Include related Address if applicable
        });
    }

    /**
     * Updates a user in the database.
     * @param id - The ID of the user to update.
     * @param data - The data to update the user with.
     * @returns {Promise<UserPrisma | null>} The updated UserDto object, or null if the user is not found.
     */
    async updateUser(id: number, data: Partial<UserPrisma>): Promise<UserPrisma | null> {
        const updatedUser = await prisma.user.update({
            where: {id},
            data: data, // Convert DTO to Prisma data format
            include: {Address: true}, // Include related Address if applicable
        });
        if (!updatedUser) {
            return null;
        }
        return updatedUser;
    }

    /**
     * Deletes a user from the database.
     * @param id - The ID of the user to delete.
     * @returns {Promise<void>} A Promise that resolves when the user is deleted.
     */
    async deleteUser(id: number): Promise<void> {
        await prisma.user.delete({
            where: {id},
        });
    }

    /**
     * Retrieves a user by their email address from the database.
     * @param email - The email address of the user to retrieve.
     * @returns {Promise<UserPrisma | null>} The UserDto object, or null if the user is not found.
     */

    async getUserByEmail(email: string): Promise<UserPrisma | null> {
        try {
            const user = await prisma.user.findFirst({
                where: {
                    email: email,
                },
                include: {
                    Address: true,
                },
            });
            if (!user) {
                return null;
            }
            return user;
        } catch (error) {
            console.error("Error getting user:", error);
            throw error;
        }
    }
}

// Export a single instance of the UserDAO class for use throughout the application
export const userDAO = new UserDAO();
