// Path: src/services/backend-services/Bk_EnvoiService.ts

import prisma from "@/utils/db";
import {EnvoiDto, EnvoisListDto, EnvoiStatus, SimulationStatus} from "@/services/dtos";
import {generateTrackingNumber} from "@/utils/generateTrackingNumber";
import {simulationRepository} from "@/services/repositories/simulations/SimulationRepository";
import {generateAndUploadQRCode} from "@/utils/qrUtils";
import {QR_CODES_FOLDER} from "@/utils/constants";
import {envoiRepository} from "@/services/repositories/envois/EnvoiRepository";
import {ParcelMapper} from "@/services/mappers/ParcelMapper";
import {EnvoiStatusMapper, SimulationStatusMapper} from "@/services/mappers/enums";
import {UserMapper} from "@/services/mappers/UserMapper";
import {AgencyMapper} from "@/services/mappers/AgencyMapper";

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

        console.log(`Simulation ${envoiId} annulée et parcels supprimés.`);
    } catch (error) {
        console.error("Erreur lors de l'annulation de la simulation :", error);
        throw error;
    }
}

/**
 * Delete all parcels associated with an envoi
 * @param envoiId
 */
export async function deleteParcelsByEnvoiId(envoiId: number) {
    try {
        await prisma.parcel.deleteMany({
            where: {envoiId},
        });
    } catch (error) {
        console.error("Erreur lors de la suppression des parcels:", error);
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
        console.log("log ====> envoiId in backend updateEnvoi function called in path: src/services/backend-services/Bk_EnvoiService.ts is : ", envoiId);

        // Step 1: Retrieve the envoi details
        const envoiResponse = await simulationRepository.getSimulationResponseById(envoiId);
        if (!envoiResponse) {
            console.log("log ====> envoiResponse not found in backend updateEnvoi function in path: src/services/backend-services/Bk_EnvoiService.ts is : ", envoiResponse);
            return false;
        }
        console.log("log ====> envoiResponse returned from simulationRepository.getSimulationResponseById function in path: src/services/backend-services/Bk_EnvoiService.ts is : ", envoiResponse);


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

        console.log("log ====> envoi returned from envoiRepository.getEnvoiById function in path: src/services/backend-services/Bk_EnvoiService.ts is : ", envoi);

        // check if the envoi has already been paid
        if (envoi.paid &&
            (envoi.simulationStatus === SimulationStatus.COMPLETED) &&
            envoi.qrCodeUrl) {
            return false;
        }
        // Step 1: verify and generate a tracking number
        const trackingNumber = envoi.trackingNumber || generateTrackingNumber(
            envoiResponse.departureCountry!,
            envoiResponse.departureCity!,
            envoiResponse.destinationCountry!,
            envoiResponse.destinationCity!
        );

        console.log("log ====> trackingNumber generated in backend updateEnvoi function called in path: src/services/backend-services/Bk_EnvoiService.ts is : ", trackingNumber);

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
        const qrCodeUrl = envoi.qrCodeUrl || await generateAndUploadQRCode(qrData, trackingNumber, QR_CODES_FOLDER);

        console.log("log ====> qrCodeUrl generated in backend updateEnvoi function called in path: src/services/backend-services/Bk_EnvoiService.ts is : ", qrCodeUrl);

        // Step 5: Prepare updated envoi data
        const updatedEnvoiData = {
            ...envoi,
            trackingNumber,
            qrCodeUrl,
            envoiStatus: EnvoiStatus.PENDING,
            simulationStatus: SimulationStatus.COMPLETED,
            paid: true
        };

        console.log("log ====> updatedEnvoiData generated in backend updateEnvoi function called in path: src/services/backend-services/Bk_EnvoiService.ts is : ", updatedEnvoiData);

        // Step 6: Update the envoi using a Prisma transaction
        // const updatedEnvoi = await prisma.$transaction([
        //     prisma.envoi.update({
        //         where: {id: envoiId},
        //         data: updatedEnvoiData,
        //     }),
        // ]);

        const updatedEnvoi = await envoiRepository.updateEnvoi(envoi.id!, updatedEnvoiData);

        console.log("log ====> updatedEnvoi generated in backend updateEnvoi function called in path: src/services/backend-services/Bk_EnvoiService.ts is : ", updatedEnvoi);

        if (!updatedEnvoi) {
            console.log("log ====> updatedEnvoi not found in backend updateEnvoi function in path: src/services/backend-services/Bk_EnvoiService.ts is : ", updatedEnvoi);
            return false;
        }
        console.log("log ====> updatedEnvoi in backend updateEnvoi function called in path: src/services/backend-services/Bk_EnvoiService.ts is : ", updatedEnvoi);
        console.log('Envoi updated successfully:', updatedEnvoi);

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

    try {
        console.log("log ====> envoiId in getEnvoiById function called in path: src/services/backend-services/Bk_EnvoiService.ts is : ", envoiId);

        const envoi = await prisma.envoi.findUnique({
            where: {id: envoiId},
            include: {
                parcels: true,
                client: true,
                destinataire: true,
                arrivalAgency: {
                    include: {
                        address: true
                    }
                },
                departureAgency: {
                    include: {
                        address: true
                    }
                },
                transport: true,
                envoiCoupon: true,
                notification: true,
            }
        });

        if (!envoi) {
            console.log("log ====> envoi not found in envoiRepository.getEnvoiById function in path: src/services/backend-services/Bk_EnvoiService.ts is : ", envoi);
            return null;
        }
        console.log("log ====> envoi returned from envoiRepository.getEnvoiById function in path: src/services/backend-services/Bk_EnvoiService.ts is : ", envoi);
        // map the envoi to a DTO with safer null handling
        const envoiDto = {
            id: envoi.id,
            trackingNumber: envoi.trackingNumber ?? undefined,
            qrCodeUrl: envoi.qrCodeUrl ?? undefined,
            envoiStatus: EnvoiStatusMapper.toDtoStatus(envoi.envoiStatus),
            simulationStatus: SimulationStatusMapper.toDtoStatus(envoi.simulationStatus),
            paid: envoi.paid,
            userId: envoi.userId ?? undefined,
            client: envoi.client ? UserMapper.toDto(envoi.client) : undefined,
            destinataire: envoi.destinataire ? UserMapper.toDto(envoi.destinataire) : undefined,
            arrivalAgency: envoi.arrivalAgency ? AgencyMapper.toDto(envoi.arrivalAgency) : null,
            departureAgency: envoi.departureAgency ? AgencyMapper.toDto(envoi.departureAgency) : null,
            destinataireId: envoi.destinataireId ?? undefined,
            transportId: envoi.transportId ?? undefined,
            departureAgencyId: envoi.departureAgencyId,
            arrivalAgencyId: envoi.arrivalAgencyId,
            totalWeight: envoi.totalWeight,
            totalVolume: envoi.totalVolume,
            totalPrice: envoi.totalPrice,
            departureDate: envoi.departureDate,
            arrivalDate: envoi.arrivalDate,
            verificationToken: envoi.verificationToken,
            comment: envoi.comment ?? undefined,
            parcels: ParcelMapper.toDtos(envoi.parcels),
        };
        if (!envoiDto) {
            return null;
        }

        console.log("log ====> envoiDto mapped and returned from envoiRepository.getEnvoiById function in path: src/services/backend-services/Bk_EnvoiService.ts is : ", envoiDto);

        return envoiDto;
    } catch (error) {
        console.error("Error getting envoi:", error);
        throw error;
    }
}

/**
 *  get all envois by user id
 *  @return EnvoiDto[]
 *  @param userId
 */

export async function getAllEnvoisByUserId(userId: number): Promise<EnvoisListDto[]> {
    try {
        console.log("log ====> userId in getAllEnvoisByUserId function called in path: src/services/backend-services/Bk_EnvoiService.ts is : ", userId);

        const envois = await prisma.envoi.findMany({
            where: {
                userId,
                simulationStatus: SimulationStatus.COMPLETED
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
                destinataire: {
                    select: {
                        name: true,
                        email: true,
                        phoneNumber: true,
                    }
                },
                arrivalAgency: {
                    select: {
                        name: true,
                        address: {
                            select: {
                                number: true,
                                street: true,
                                city: true,
                                country: true,
                            }
                        }
                    }
                },
                departureAgency: {
                    select: {
                        name: true,
                        address: {
                            select: {
                                number: true,
                                street: true,
                                city: true,
                                country: true,
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: "desc",
            }
        });

        if (!envois || envois.length === 0) {
            console.log("log ====> envois not found in envoiRepository.getAllEnvoisByUserId function in path: src/services/backend-services/Bk_EnvoiService.ts is : ", envois);
            return [];
        }


        console.log("log ====> envois returned from envoiRepository.getAllEnvoisByUserId function in path: src/services/backend-services/Bk_EnvoiService.ts is : ", envois);

        const formattedEnvois = envois.map((envoi) => {
            return {
                id: envoi.id,
                departureAgency: envoi.departureAgency?.name,
                arrivalAgency: envoi.arrivalAgency?.name,
                totalWeight: envoi.totalWeight,
                totalPrice: envoi.totalPrice,
                arrivalDate: envoi.arrivalDate,
                departureDate: envoi.departureDate,
                envoiStatus: envoi.envoiStatus,
                paid: envoi.paid,
                destinataire: envoi.destinataire?.name || "",
                trackingNumber: envoi.trackingNumber || "",
            }
        });
        console.log("log ====> formattedEnvois returned from envoiRepository.getAllEnvoisByUserId function in path: src/services/backend-services/Bk_EnvoiService.ts is : ", formattedEnvois);
        return formattedEnvois;


    } catch (error) {
        console.error("Error getting envois:", error);
        throw error;
    }
}
