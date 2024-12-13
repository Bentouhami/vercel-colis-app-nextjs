// Path: src/services/frontend-services/simulation/SimulationService.ts

import {DOMAIN} from "@/utils/constants";
import {calculateEnvoiDetails} from "@/services/frontend-services/simulation/SimulationCalculationService";
import {getTarifs} from "@/services/frontend-services/TarifsService";
import {
    BaseSimulationDto,
    EnvoiStatus,
    SimulationDtoRequest,
    SimulationResponseDto,
    SimulationStatus,
    TarifsDto
} from "@/services/dtos";
import {getAgencyIdByCountryAndCityAndAgencyName} from "@/services/frontend-services/AgencyService";
import axios from "axios";

export async function getSimulationById(id: number): Promise<SimulationResponseDto | null> {
    if (!id) {
        return null;
    }

    try {
        // Use axios to make the request
        const response = await axios.get(`${DOMAIN}/api/v1/simulations/${id}`, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        // Check if the response contains data
        if (!response.data || !response.data.data) {
            console.log("log ====> simulationData not found in getSimulationById function");
            return null;
        }

        return response.data.data as SimulationResponseDto;

    } catch (error) {
        // Enhanced error logging with axios
        if (axios.isAxiosError(error)) {
            console.error("Axios error in getSimulationById function:", error.response?.data || error.message);
        } else {
            console.error("Unknown error in getSimulationById function:", error);
        }
        return null;
    }
}


/**
 * Submit a simulation to the backend
 * @param simulationData
 */
export async function submitSimulation(simulationData: SimulationDtoRequest) {
    if (!simulationData) {
        throw new Error("Simulation data not found");
    }


    // get agency id by Country and city and agency name
    const departureAgencyId = await getAgencyIdByCountryAndCityAndAgencyName(simulationData.departureCountry, simulationData.departureCity, simulationData.departureAgency);
    if (!departureAgencyId) {
        throw new Error("Aucun agence trouvée pour cette ville");
    }

    // get arrival agency id by Country and city and agency name
    const arrivalAgencyId = await getAgencyIdByCountryAndCityAndAgencyName(simulationData.destinationCountry, simulationData.destinationCity, simulationData.destinationAgency);
    if (!arrivalAgencyId) {
        throw new Error("Aucun agence trouvée pour cette ville");
    }

    // 1. Récupérer les tarifs actuels
    const tarifs: TarifsDto = await getTarifs();

    if (!tarifs) {
        throw new Error("Tarifs not found");
    }


    const parcels = simulationData.parcels;
    if (!parcels) {
        throw new Error("Parcels not found");
    }

    // 2. Calculer les détails de l'envoi
    const calculationResults =
        await calculateEnvoiDetails(parcels, tarifs);


    if (!calculationResults) {
        throw new Error("Calculation results not found");
    }

    // 3. Préparer les données à envoyer
    const simulationBaseData: BaseSimulationDto = {
        departureAgencyId: departureAgencyId,
        arrivalAgencyId: arrivalAgencyId,
        simulationStatus: SimulationStatus.DRAFT,
        envoiStatus: EnvoiStatus.PENDING,
        parcels: parcels,
        totalWeight: calculationResults.totalWeight,
        totalVolume: calculationResults.totalVolume,
        totalPrice: calculationResults.totalPrice,
        departureDate: calculationResults.departureDate,
        arrivalDate: calculationResults.arrivalDate,
    }


    if (!simulationBaseData) {
        throw new Error("Simulation base data not found");
    }

    console.log("log ====> simulationBaseData in submitSimulation function before calling fetch function: ", simulationBaseData);

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

/**
 * Get the simulation from the cookies
 * @returns {Promise<SimulationResponseDto | null>} simulation or null
 */
export async function getSimulation(): Promise<SimulationResponseDto | null> {

    console.log("log ====> getSimulation function called in src/services/frontend-services/simulation/SimulationService.ts");

    try {
        const response = await fetch(`${DOMAIN}/api/v1/simulations`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });


        if (!response.ok) {
            console.log("log ====> not ok response in getSimulation function");
            return null;
        }

        // Extraire les données JSON
        const simulationData = await response.json();

        if (!simulationData || !simulationData.data) {
            console.log("log ====> simulationData not found in getSimulation function");
            return null;
        }

        return simulationData.data as SimulationResponseDto;

    } catch (error) {
        console.error("Erreur lors de la récupération de la simulation:", error);
        throw error;
    }
}

export async function updateSimulationWithSenderAndDestinataireIds(simulation: SimulationResponseDto) {

    console.log("log ====> updateSimulationWithSenderAndDestinataireIds function called in src/services/frontend-services/simulation/SimulationService.ts : ", simulation);

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


    } catch (error) {
        throw error;
    }
}


export async function deleteSimulationCookie() {
    try {
        const response = await fetch(`${DOMAIN}/api/v1/simulations/delete-cookies`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to delete simulation");
        }

        return response.json();
    } catch (error) {
        throw error;
    }
}
