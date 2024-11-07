// Path: src/services/frontend-services/simulation/SimulationService.ts
import {CreateParcelDto, FullSimulationDto, PreparedSimulation, SimulationWithIds, TarifsDto} from "@/utils/dtos";
import {DOMAIN} from "@/utils/constants";
import {calculateEnvoiDetails} from "@/services/frontend-services/simulation/SimulationCalculationService";
import {getTarifs} from "@/services/frontend-services/TarifsService";

export async function submitSimulation(simulationData: PreparedSimulation) {


    if (!simulationData) {
        throw new Error("Simulation data not found");
    }
    // 1. Récupérer les tarifs actuels
    const tarifs: TarifsDto = await getTarifs();

    if (!tarifs) {
        throw new Error("Tarifs not found");
    }


    const parcels = simulationData.parcels as CreateParcelDto[];
    // 2. Calculer les détails de l'envoi
    const calculationResults =
        await calculateEnvoiDetails(parcels, tarifs);

    if (!calculationResults) {
        throw new Error("Calculation results not found");
    }


    // 3. Préparer les données à envoyer
    const simulationBaseData: SimulationWithIds = {
        ...simulationData, // représente BaseSimulationDto
        ...calculationResults,
    };

    if (!simulationBaseData) {
        throw new Error("Simulation base data not found");
    }


    // 4. Appeler l'API pour enregistrer la simulation return simulationId after saving
    const response = await fetch(`${DOMAIN}/api/v1/simulations`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(simulationBaseData),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit simulation');
    }

    return response.json();


}


export async function getSimulationByIdAndToken(): Promise<FullSimulationDto | null> {

    try {
        const response = await fetch(`${DOMAIN}/api/v1/simulations`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch simulation');
        }

        // Extraire les données JSON
        const simulationData = await response.json();

        if (!simulationData || !simulationData.data) {
            throw new Error("Simulation not found");
        }

        return simulationData.data as FullSimulationDto;

    } catch (error) {
        throw error; // Relancer l'erreur pour qu'elle puisse être capturée par la fonction appelante
    }
}


export async function updateSimulationWithSenderAndDestinataireIds(simulation: FullSimulationDto) {

    try {
        const response = await fetch(`${DOMAIN}/api/v1/simulations`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: 'include',
            body: JSON.stringify(simulation),
        });

        if (!response.ok) {
            throw new Error('Failed to update simulation');
        }

        const updatedSimulationData = await response.json() as FullSimulationDto;

        if (!updatedSimulationData) {
            throw new Error("Simulation not found");
        }


        // Construire un objet avec uniquement les champs souhaités
        const filteredSimulationData: FullSimulationDto = {
            id: updatedSimulationData.id,
            userId: updatedSimulationData.userId,
            destinataireId: updatedSimulationData.destinataireId,
            departureCountry: updatedSimulationData.departureCountry,
            departureCity: updatedSimulationData.departureCity,
            departureAgency: updatedSimulationData.departureAgency,
            destinationCountry: updatedSimulationData.destinationCountry,
            destinationCity: updatedSimulationData.destinationCity,
            destinationAgency: updatedSimulationData.destinationAgency,
            parcels: updatedSimulationData.parcels, // Si `parcels` est stocké en tant que chaîne JSON
            status: updatedSimulationData.status,
            totalWeight: updatedSimulationData.totalWeight,
            totalVolume: updatedSimulationData.totalVolume,
            totalPrice: updatedSimulationData.totalPrice,
            departureDate: new Date(updatedSimulationData.departureDate),
            arrivalDate: new Date(updatedSimulationData.arrivalDate),
        };


        return filteredSimulationData;

    } catch (error) {
        throw error;
    }
}


