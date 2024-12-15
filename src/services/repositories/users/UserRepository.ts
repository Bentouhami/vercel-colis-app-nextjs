// path: src/services/repositories/UserRepository.ts

import {IUserRepository} from "@/services/repositories/users/IUserRepository";
import {UserLoginResponseDto} from "@/services/dtos";
import {userDAO} from "@/services/dal/DAO/users/UserDAO";
import {UserMapper} from "@/services/mappers/UserMapper";

export class UserRepository implements IUserRepository {
    async findUserByEmail(email: string): Promise<UserLoginResponseDto | null> {
        // Check if the email is valid
        if (!email) {
            return null;
        }

        console.log("log ====> email in path: src/services/repositories/users/UserRepository.ts: ", email);

        // Call the DAO to get the user
        try {
            const user = await userDAO.getUserByEmail(email);

            // Check if the user exists
            if (!user || !user.addressId) {
                return null;
            }

            console.log("log ====> user in path: src/services/repositories/users/UserRepository.ts: ", user);

            // Map the user to a UserResponseDto and return it
            return UserMapper.toLoginResponseDto(user) || null;

            // Handle any errors that may occur during the mapping process
        } catch (error) {
            console.error("Error getting user:", error);
            throw error;
        }
    }
}

// Export a single instance of the UserRepository for use throughout the application
export const userRepositories = new UserRepository();