// Path: src/services/frontend-services/simulation/SimulationService.ts
import {
    BaseDestinataireDto,
    BaseSimulationDto,
    CreateParcelDto,
    FullSimulationDto,
    SimulationStatus,
    SimulationWithoutIds,
    TarifsDto
} from "@/utils/dtos";
import {DOMAIN} from "@/utils/constants";
import {calculateEnvoiDetails} from "@/services/frontend-services/simulation/SimulationCalculationService";
import {getTarifs} from "@/services/frontend-services/TarifsService";
import {data} from "framer-motion/m";

export async function submitSimulation(simulationData: BaseSimulationDto) {

    // 1. Récupérer les tarifs actuels
    const tarifs: TarifsDto = await getTarifs();
    console.log("tarifs in submitSimulation function: ", tarifs);

    if (!tarifs) {
        throw new Error("Tarifs not found");
    }

    if (!simulationData) {
        throw new Error("Simulation data not found");
    }

    // Convertir chaque tarif en nombre pour éviter les erreurs de type
    const formattedTarifs: TarifsDto = {
        weightRate: Number(tarifs.weightRate),
        volumeRate: Number(tarifs.volumeRate),
        baseRate: Number(tarifs.baseRate),
        fixedRate: Number(tarifs.fixedRate),
    };

    const parcels = simulationData.parcels as CreateParcelDto[];
    // 2. Calculer les détails de l'envoi
    const calculationResults =
        await calculateEnvoiDetails(parcels, formattedTarifs);

    if (!calculationResults) {
        throw new Error("Calculation results not found");
    }

    console.log("log ====> simulationData in submitSimulation function: ", simulationData);
    // 3. Préparer les données à envoyer
    const simulationBaseData: SimulationWithoutIds = {
        ...simulationData, // représente BaseSimulationDto
        ...calculationResults, // représente  SimulationCalculationTotalsDto
        status: SimulationStatus.DRAFT, // ajoutée pour la SimulationWithoutIds interface
    };

    if (!simulationBaseData) {
        throw new Error("Simulation base data not found");
    }

    console.log("simulationBaseData in submitSimulation function before sending to API: ", simulationBaseData);

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
    console.log("log ====> getSimulationByIdAndToken function called in path: src/services/frontend-services/simulation/SimulationService.ts");

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

        console.log("simulationData in getSimulationByIdAndToken function:", simulationData.data);
        return simulationData.data as FullSimulationDto;

    } catch (error) {
        console.error('Error getting simulation:', error);
        throw error; // Relancer l'erreur pour qu'elle puisse être capturée par la fonction appelante
    }
}


export async function updateSimulationWithSenderAndDestinataireIds(simulation: FullSimulationDto) {
    console.log("log ====> updateSimulationWithSender function called");

    try {
        const response = await fetch(`${DOMAIN}/api/v1/simulations`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(simulation),
        });

        if (!response.ok) {
            throw new Error('Failed to update simulation');
        }

        const updatedSimulationData = await response.json();

        if (!updatedSimulationData.data) {
            throw new Error("Simulation not found");
        }

        console.log("updatedSimulationData in updateSimulationWithSenderAndDestinataireIds function:", updatedSimulationData.data);

        // Construire un objet avec uniquement les champs souhaités
        const filteredSimulationData: FullSimulationDto = {
            id: updatedSimulationData.data.id,
            userId: updatedSimulationData.data.userId,
            destinataireId: updatedSimulationData.data.destinataireId,
            departureCountry: updatedSimulationData.data.departureCountry,
            departureCity: updatedSimulationData.data.departureCity,
            departureAgency: updatedSimulationData.data.departureAgency,
            destinationCountry: updatedSimulationData.data.destinationCountry,
            destinationCity: updatedSimulationData.data.destinationCity,
            destinationAgency: updatedSimulationData.data.destinationAgency,
            parcels: JSON.parse(updatedSimulationData.data.parcels), // Si `parcels` est stocké en tant que chaîne JSON
            status: updatedSimulationData.data.status,
            totalWeight: updatedSimulationData.data.totalWeight,
            totalVolume: updatedSimulationData.data.totalVolume,
            totalPrice: updatedSimulationData.data.totalPrice,
            departureDate: new Date(updatedSimulationData.data.departureDate),
            arrivalDate: new Date(updatedSimulationData.data.arrivalDate),
        };

        console.log("filteredSimulationData is :" , filteredSimulationData)


        return filteredSimulationData;

    } catch (error) {
        console.error('Error updating simulation:', error);
        throw error;
    }
}


