// path: src/services/repositories/UserRepository.ts

import { IUserRepository } from "@/services/repositories/users/IUserRepository";
import {
  ProfileDto,
  RoleDto,
  UserAddressDto,
  UserLoginDto,
  UserLoginResponseDto,
} from "@/services/dtos";
import { mapUserToProfileDto } from "@/services/mappers/user.mapper";
import { prisma } from "@/utils/db";

export class UserRepository implements IUserRepository {
  async findUserByEmail(email: string): Promise<UserLoginDto | null> {
    // Check if the email is valid
    if (!email) {
      return null;
    }

    // Call the DAO to get the user
    try {
      const user = await prisma.user.findFirst({
        where: { email },
        include: {
          userAddresses: {
            include: {
              address: {
                include: {
                  city: {
                    select: {
                      id: true,
                      name: true,
                      country: {
                        select: {
                          id: true,
                          name: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      // Check if the user exists
      if (!user || !user.password) {
        return null;
      }
      const pivot = user.userAddresses[0];

      // prepare an AddressResponseDto from that pivot
      const address: UserAddressDto = {
        id: pivot.address.id,
        street: pivot.address.street ?? "",
        complement: pivot.address.complement ?? undefined,
        streetNumber: pivot.address.streetNumber ?? undefined,
        boxNumber: pivot.address.boxNumber ?? undefined,
        cityId: pivot.address.cityId,
        city: pivot.address.city,
      };

      // Prepare the user obj to be returned as UserLoginResponseDto
      const userObj: UserLoginResponseDto = {
        id: user.id,
        email: user.email,
        password: user.password ?? "",
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
        name: user.name ? `${user.lastName} ${user.firstName}` : "",
        phoneNumber: user.phoneNumber ?? "",
        userAddresses: address,
        image: user.image ?? "",
        role: user.role as RoleDto,
        isVerified: user.isVerified || false,
        emailVerified: user.emailVerified,
        verificationToken: user.verificationToken,
        verificationTokenExpires: user.verificationTokenExpires,
      };

      // Map the user to a UserResponseDto and return it
      return userObj;
    } catch (error) {
      console.error("Error getting user:", error);
      throw error;
    }
  }

  async getUserProfileById(userId: number): Promise<ProfileDto | null> {
    if (!userId) return null;
    try {
      const user = await prisma.user.findFirst({
        where: { id: userId },
        include: {
          userAddresses: {
            include: {
              address: {
                include: {
                  city: {
                    select: {
                      id: true,
                      name: true,
                      country: {
                        select: {
                          id: true,
                          name: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      // Check if the user exists
      if (!user || !(user.userAddresses.length > 0)) {
        return null;
      }

      const pivot = user.userAddresses[0];

      // prepare an AddressResponseDto from that pivot
      const address: UserAddressDto = {
        id: pivot.address.id,
        street: pivot.address.street ?? "",
        complement: pivot.address.complement ?? undefined,
        streetNumber: pivot.address.streetNumber ?? undefined,
        boxNumber: pivot.address.boxNumber ?? undefined,
        cityId: pivot.address.cityId,
        city: pivot.address.city,
      };

      // Prepare the user obj to be returned as UserLoginResponseDto
      const userObj: ProfileDto = {
        id: user.id,
        email: user.email,
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
        name: user.name ? `${user.lastName} ${user.firstName}` : "",
        birthDate: user.birthDate!,
        phoneNumber: user.phoneNumber ?? "",
        userAddresses: address,
        image: user.image ?? "",
        role: user.role as RoleDto,
        isVerified: user.isVerified || false,
      };

      // Map the user to a UserResponseDto and return it
      return userObj;
    } catch (error) {
      console.error("Error getting user profile:", error);
      throw error;
    }
  }

  // Pour SUPER_ADMIN
  async getAllUsers(): Promise<ProfileDto[] | null> {
    const users = await prisma.user.findMany({
      include: {
        userAddresses: {
          include: {
            address: {
              include: {
                city: {
                  include: { country: true },
                },
              },
            },
          },
        },
      },
    });

    const us = users.map((user) => mapUserToProfileDto(user));
    return us;
  }

  // Pour AGENCY_ADMIN
  async getUsersByAgencyAdmin(adminId: number): Promise<ProfileDto[]> {
    const staff = await prisma.agencyStaff.findFirst({
      where: {
        staffId: adminId,
        staffRole: "AGENCY_ADMIN",
      },
    });

    if (!staff) return [];

    const agencyClients = await prisma.agencyClients.findMany({
      where: {
        agencyId: staff.agencyId,
      },
      include: {
        client: {
          include: {
            userAddresses: {
              include: {
                address: {
                  include: {
                    city: {
                      include: {
                        country: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    return agencyClients
      .filter((ac) => ac.client.role === "CLIENT")
      .map((ac) => mapUserToProfileDto(ac.client));
  }
}

// Export a single instance of the UserRepository for use throughout the application
export const userRepositories = new UserRepository();
