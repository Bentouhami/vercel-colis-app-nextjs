// Path: src/services/backend-services/Bk_EnvoiService.ts

import prisma from "@/utils/db";
import {EnvoiDto, EnvoisListDto, EnvoiStatus, SimulationStatus} from "@/services/dtos";
import {generateTrackingNumber} from "@/utils/generateTrackingNumber";
import {simulationRepository} from "@/services/repositories/simulations/SimulationRepository";
import {generateAndUploadQRCode} from "@/utils/qrUtils";
import {QR_CODES_FOLDER} from "@/utils/constants";
import {envoiRepository} from "@/services/repositories/envois/EnvoiRepository";
import {cookies} from "next/headers";
import {PaymentSuccessDto} from "@/services/dtos/envois/PaymentSuccessDto";

/**
 * Cancel a simulation
 * @param envoiId
 * @returns
 */
export async function cancelSimulation(envoiId: number): Promise<void> {
    try {
        // Vérifiez si l'envoi existe
        const envoi = await prisma.envoi.findUnique({
            where: {id: envoiId},
        });

        if (!envoi) {
            throw new Error(`Envoi avec ID ${envoiId} introuvable.`);
        }

        // une transaction Prisma pour effectuer les opérations
        await prisma.$transaction([
            // Supprimer les colis liés à l'envoi
            prisma.parcel.deleteMany({
                where: {envoiId},
            }),
            // Mettre à jour le statut de l'envoi
            prisma.envoi.update({
                where: {id: envoiId},
                data: {
                    simulationStatus: SimulationStatus.CANCELLED,
                    envoiStatus: EnvoiStatus.CANCELLED, // Vous pouvez ajuster selon les besoins
                },
            }),
        ]);

    } catch (error) {
        console.error("Erreur lors de l'annulation de la simulation :", error);
        throw error;
    }
}

/**
 * Link a client to an agency if not already linked
 * @param clientId
 * @param agencyId
 */
async function linkClientToAgency(clientId: number, agencyId: number): Promise<void> {

    if (!clientId || !agencyId) return;
    try {
        const existingLink = await prisma.agencyClients.findUnique({
            where: {
                clientId_agencyId: {
                    clientId,
                    agencyId,
                },
                clientId,
                agencyId,
            }
        });

        if (!existingLink) {
            await prisma.agencyClients.create({
                data: {
                    clientId,
                    agencyId,
                },
            });
        }
    } catch (error) {
        console.error("Error linking client to agency:", error);
        throw error;
    }
}


/**
 * Update an envoi
 * @param envoiId
 * @returns
 */
export async function updateEnvoi(envoiId: number): Promise<boolean> {
    if (!envoiId) {
        return false;
    }

    try {

        // Step 1: Retrieve the envoi details
        const envoiResponse = await simulationRepository.getSimulationResponseById(envoiId);
        if (!envoiResponse) {
            return false;
        }


        // get the envoi by id
        const envoi: EnvoiDto | null = await envoiRepository.getEnvoiById(envoiId);

        if (!envoi) {
            return false;
        }

        // after the first update, if the second request hits, do:
        if (envoi.trackingNumber && envoi.qrCodeUrl && envoi.paid && envoi.simulationStatus === 'COMPLETED') {
            // Return early: we've already updated this envoi
            return true;
        }


        // check if the envoi has already been paid
        if (envoi.paid &&
            (envoi.simulationStatus === SimulationStatus.COMPLETED) &&
            envoi.qrCodeUrl) {
            (await cookies()).delete(process.env.SIMULATION_COOKIE_NAME!);

            return false;
        }
        // Step 1: verify and generate a tracking number
        const trackingNumber = envoi.trackingNumber || generateTrackingNumber(
            envoiResponse.departureCountry!,
            envoiResponse.departureCity!,
            envoiResponse.destinationCountry!,
            envoiResponse.destinationCity!
        );


        // Step 2: Prepare QR code data
        const qrData = {
                trackingNumber,
                departureCountry: envoiResponse.departureCountry,
                departureCity: envoiResponse.departureCity,
                destinationCountry: envoiResponse.destinationCountry,
                destinationCity: envoiResponse.destinationCity,
                userId: envoiResponse.userId,
                numberOfPackages: envoiResponse.parcels.length,
                paid: envoi.paid,
                envoiStatus: envoi.envoiStatus,
                simulationStatus: envoi.simulationStatus,
                arrivalDate: envoi.arrivalDate,
                departureDate: envoi.departureDate,
                transportId: envoi.transportId,
                comment: envoi.comment,
                parcels: envoi.parcels,
                totalWeight: envoi.totalWeight,
                totalVolume: envoi.totalVolume,
                totalPrice: envoi.totalPrice,
            }
        ;

        // Step 4: Generate and upload QR Code
        const qrCodeUrl = envoi.qrCodeUrl || (await generateAndUploadQRCode(qrData, trackingNumber, QR_CODES_FOLDER));


        // remove parcels from envoi
        const {
            parcels,
            id,
            departureAgency,
            arrivalAgency,
            totalWeight,
            totalVolume,
            totalPrice,
            departureDate,
            arrivalDate,
            userId,
            client,
            destinataireId,
            transportId,
            departureAgencyId,
            arrivalAgencyId,
            destinataire,
            ...restEnvoi
        } = envoi;

        // Step 5: Prepare updated envoi data
        const updatedEnvoiData = {
            ...restEnvoi,
            trackingNumber,
            qrCodeUrl,
            envoiStatus: EnvoiStatus.PENDING,
            simulationStatus: SimulationStatus.COMPLETED,
            paid: true
        };

        const updatedEnvoi = await envoiRepository.updateEnvoi(envoi.id!, updatedEnvoiData);

        if (!updatedEnvoi) {
            return false;
        }
        if (envoi.userId && envoi.departureAgencyId) {
            await linkClientToAgency(envoi.userId, envoi.departureAgencyId);
        }


        return true;
    } catch (error) {
        console.error("Error updating envoi: ", error);
        throw error;
    }
}

/**
 * Get an envoi by ID
 * @param envoiId
 * @returns
 */
export async function getEnvoiById(envoiId: number): Promise<EnvoiDto | null> {
    if (!envoiId) {
        throw new Error("Invalid envoi ID");
    }

    const envoi = await envoiRepository.getEnvoiById(envoiId);
    if (!envoi) {
        return null;
    }


    return envoi;
}

/**
 * Get paginated envois by user ID
 * @param userId - The user ID
 * @param limit - Number of results per page
 * @param offset - Offset for pagination
 * @returns { envois: EnvoisListDto[], total: number }
 */
export async function getAllEnvoisByUserId(userId: number, limit: number, offset: number): Promise<{
    envois: EnvoisListDto[],
    total: number
}> {
    try {

        const total = await prisma.envoi.count({
            where: {
                userId,
                simulationStatus: "COMPLETED",
            },
        });

        const envois = await prisma.envoi.findMany({
            where: {
                userId,
                simulationStatus: "COMPLETED",
            },
            take: limit,
            skip: offset,
            orderBy: {
                createdAt: "desc",
            },
            select: {
                id: true,
                totalWeight: true,
                totalPrice: true,
                departureDate: true,
                arrivalDate: true,
                envoiStatus: true,
                paid: true,
                trackingNumber: true,
                createdAt: true,
                destinataire: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        name: true,
                        email: true,
                        phoneNumber: true,
                    },
                },
                arrivalAgency: {
                    select: {
                        name: true,
                        address: {
                            select: {
                                streetNumber: true,
                                street: true,
                                city: {
                                    select: {
                                        id: true,
                                        name: true,
                                        country: {
                                            select: {
                                                id: true,
                                                name: true,
                                            }
                                        }
                                    }
                                },
                            },
                        },
                    }
                },
                departureAgency: {
                    select: {
                        name: true,
                        address: {
                            select: {
                                streetNumber: true,
                                street: true,
                                city: {
                                    select: {
                                        id: true,
                                        name: true,
                                        country: {
                                            select: {
                                                id: true,
                                                name: true,
                                            }
                                        }
                                    }
                                },
                            },
                        },
                    },
                },
            },
        });

        const formattedEnvois = envois.map((envoi) => ({
            id: envoi.id,
            departureAgency: envoi.departureAgency?.name,
            arrivalAgency: envoi.arrivalAgency?.name,
            totalWeight: envoi.totalWeight,
            totalPrice: envoi.totalPrice,
            arrivalDate: envoi.arrivalDate,
            departureDate: envoi.departureDate,
            envoiStatus: envoi.envoiStatus,
            paid: envoi.paid,
            destinataire: envoi.destinataire?.name ? `${envoi.destinataire?.lastName} ${envoi.destinataire?.firstName}` : "",
            trackingNumber: envoi.trackingNumber || "",
            createdAt: envoi.createdAt,
        }));

        return {envois: formattedEnvois, total};
    } catch (error) {
        console.error("Error fetching envois:", error);
        throw error;
    }
}

/**
 * get payment success data by id
 * @return PaymentSuccessDto if exits or null otherwise
 * @param envoiId
 */
export async function getPaymentSuccessDataById(envoiId: number): Promise<PaymentSuccessDto | null> {
    if (!envoiId) {
        throw new Error("Invalid envoi ID");
    }

    return await envoiRepository.getPaymentSuccessDataById(envoiId);
}