// Path: src/services/frontend-services/simulation/SimulationService.ts

import { API_DOMAIN } from "@/utils/constants";
import { calculateEnvoiDetails } from "@/services/frontend-services/simulation/SimulationCalculationService";
import { getTarifs } from "@/services/frontend-services/TarifsService";
import {
  CreateSimulationRequestDto,
  EnvoiStatus,
  PartielUpdateSimulationDto,
  SimulationDtoRequest,
  SimulationResponseDto,
  SimulationStatus,
  UpdateEditedSimulationDto,
} from "@/services/dtos";
import { getAgencyId } from "@/services/frontend-services/AgencyService";
import axios from "axios";
import {
  getSimulationSummary,
  updateSimulationDestinataireId,
} from "@/services/backend-services/Bk_SimulationService";
import { findSuitableTransport } from "@/services/frontend-services/transport/TransportServiceCalc";
import { updateTransport } from "@/services/frontend-services/transport/TransportService";
import apiClient from "@/utils/axiosInstance";

/**
 *  get a simulation by id
 * @param id
 *  @return SimulationResponseDto if exits or null otherwise
 */
export async function getSimulationById(
  id: number
): Promise<SimulationResponseDto | null> {
  if (!id) {
    return null;
  }

  try {
    // Use axios to make the request
    const response = await axios.get(`${API_DOMAIN}/simulations/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Check if the response contains data
    if (!response.data || !response.data.data) {
      return null;
    }

    return response.data.data as SimulationResponseDto;
  } catch (error) {
    // Enhanced error logging with axios
    if (axios.isAxiosError(error)) {
      console.error(
        "Axios error in getSimulationById function:",
        error.response?.data || error.message
      );
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
  const departureAgencyId = await getAgencyId(
    simulationData.departureCountry,
    simulationData.departureCity,
    simulationData.departureAgency
  );

  if (!departureAgencyId) {
    throw new Error("Aucun agence trouvée pour cette ville");
  }

  // get arrival agency id by Country and city and agency name
  const arrivalAgencyId = await getAgencyId(
    simulationData.destinationCountry,
    simulationData.destinationCity,
    simulationData.destinationAgency
  );
  if (!arrivalAgencyId) {
    throw new Error("Aucun agence trouvée pour cette ville");
  }

  // 1. Récupérer les tarifs actuels
  const tarifs = await getTarifs();

  if (!tarifs) {
    throw new Error("Tarifs not found");
  }

  const parcels = simulationData.parcels;
  if (!parcels) {
    throw new Error("Parcels not found");
  }

  // 2. Calculer les détails de l'envoi
  const calculationResults = calculateEnvoiDetails(parcels, tarifs);

  if (!calculationResults) {
    throw new Error("Calculation results not found");
  }

  // 3. Préparer les données à envoyer
  const simulationBaseData: CreateSimulationRequestDto = {
    departureAgencyId: departureAgencyId,
    arrivalAgencyId: arrivalAgencyId,
    parcels: parcels,
    simulationStatus: SimulationStatus.DRAFT,
    envoiStatus: EnvoiStatus.PENDING,
    totalWeight: calculationResults.totalWeight,
    totalVolume: calculationResults.totalVolume,
    totalPrice: calculationResults.totalPrice,
    departureDate: calculationResults.departureDate,
    arrivalDate: calculationResults.arrivalDate,
  };

  if (!simulationBaseData) {
    throw new Error("Simulation base data not found");
  }

  console.log(
    " simulationBaseData in submitSimulation function in path: src/services/frontend-services/simulation/SimulationService.ts : ",
    simulationBaseData
  );

  // Prepare api url
  const apiUrl = `${API_DOMAIN}/simulations`;
  console.log(
    "API URL in submitSimulation function in path src/services/frontend-services/simulation/SimulationService.ts :",
    apiUrl
  );

  // 4. Appeler l'API pour enregistrer la simulation return simulationId after saving
  const response = await axios.post(apiUrl, simulationBaseData);

  if (!response.data) {
    throw new Error("Failed to submit simulation");
  }

  return response.data;
}

/**
 * Get the simulation from the cookies
 * @returns {Promise<SimulationResponseDto | null>} simulation or null
 */
export async function getSimulation(): Promise<SimulationResponseDto | null> {
  try {
    const response = await apiClient.get(`/simulations`);
    if (!response.data) {
      return null;
    }
    // Extraire les données JSON
    const simulationData = response.data;

    if (!simulationData || !simulationData.data) {
      return null;
    }
    return simulationData.data as SimulationResponseDto;
  } catch (error) {
    console.error("Erreur lors de la récupération de la simulation:", error);
    throw error;
  }
}

/**
 * updateSimulationDestination, update destinataireId of a simulation
 * @param simulationId
 * @param destinataireId
 * @returns {Promise<void | null>} A Promise that resolves when the destinataireId is updated
 * @describe('simulationId', () => {
 *      description: 'The ID of the simulation to update',
 *      required: true,
 *      type: 'number',
 *  })
 */
export async function updateSimulationDestinataire(
  simulationId: number,
  destinataireId: number
): Promise<boolean> {
  if (!simulationId || !destinataireId) {
    throw new Error("Invalid simulation or destinataire ID");
  }
  try {
    const response = await updateSimulationDestinataireId(
      simulationId,
      destinataireId
    );

    if (!response) {
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error updating destinataireId:", error);
    throw error;
  }
}

/**
 * updateSimulationEdited, update a simulation
 * @param simulationData
 * @returns {Promise<any | null>} A Promise that resolves when the simulation is updated
 */
export async function updateSimulationEdited(
  simulationData: PartielUpdateSimulationDto
): Promise<any | null> {
  if (!simulationData) {
    throw new Error("Simulation data not found");
  }

  // get agency id by Country and city and agency name
  const departureAgencyId = await getAgencyId(
    simulationData.departureCountry!,
    simulationData.departureCity!,
    simulationData.departureAgency!
  );
  if (!departureAgencyId) {
    throw new Error("Aucun agence trouvée pour cette ville");
  }

  // get arrival agency id by Country and city and agency name
  const arrivalAgencyId = await getAgencyId(
    simulationData.destinationCountry!,
    simulationData.destinationCity!,
    simulationData.destinationAgency!
  );

  if (!arrivalAgencyId) {
    throw new Error("Aucun agence trouvée pour cette ville");
  }

  // 1. Récupérer les tarifs actuels
  const tarifs = await getTarifs();

  if (!tarifs) {
    throw new Error("Tarifs not found");
  }

  const parcels = simulationData.parcels;
  if (!parcels) {
    throw new Error("Parcels not found");
  }

  // 2. Calculer les détails de l'envoi
  const calculationResults = calculateEnvoiDetails(parcels, tarifs);

  if (!calculationResults) {
    throw new Error("Calculation results not found");
  }

  if (!simulationData.id) {
    throw new Error("Simulation ID not found");
  }

  // 3. Préparer les données à envoyer
  const simulationBaseData: UpdateEditedSimulationDto = {
    id: simulationData.id,
    userId: simulationData.userId,
    destinataireId: simulationData.destinataireId,
    departureAgencyId: departureAgencyId,
    arrivalAgencyId: arrivalAgencyId,
    parcels: simulationData.parcels,
    simulationStatus: SimulationStatus.DRAFT,
    envoiStatus: EnvoiStatus.PENDING,
    totalWeight: calculationResults.totalWeight,
    totalVolume: calculationResults.totalVolume,
    totalPrice: calculationResults.totalPrice,
    departureDate: calculationResults.departureDate,
    arrivalDate: calculationResults.arrivalDate,
  };
  if (!simulationBaseData) {
    throw new Error("Simulation base data not found");
  }

  try {
    // 4. Appeler l'API pour enregistrer la simulation return simulationId after saving
    const response = await axios.put(
      `${API_DOMAIN}/simulations/edit`,
      simulationBaseData
    );

    if (!response.data) {
      throw new Error("Failed to update simulation");
    }

    return response.data;
  } catch (error) {
    console.error("Error updating simulation:", error);
    throw error;
  }
}

/**
 * Delete the simulation cookie
 * @returns {Promise<void | null>} A Promise that resolves when the status is updated
 */
export async function deleteSimulationCookie(): Promise<void> {
  try {
    const response = await axios.get(
      `${API_DOMAIN}/simulations/delete-cookies`,
      {
        withCredentials: true,
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      }
    );

    // Also delete client-side
    if (typeof document !== "undefined") {
      const cookieName = process.env.NEXT_PUBLIC_SIMULATION_COOKIE_NAME;
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${window.location.hostname}`;
    }

    return response.data;
  } catch (error) {
    console.error("Error deleting simulation cookie:", error);
    throw error;
  }
}

/**
 * updateSimulationTransportId, update transportId of a simulation
 * @param simulationId
 * @returns {Promise<void | null>} A Promise that resolves when the transportId is updated
 */
export async function assignTransportToSimulation(
  simulationId: number
): Promise<boolean> {
  try {
    // get simulation summary by id
    const simulation = await getSimulationSummary(simulationId);
    // verify if simulation exists
    if (!simulation) {
      return false;
    }

    // calculate and find suitable transport
    const suitableTransport = await findSuitableTransport(simulation);

    if (!suitableTransport) {
      return false;
    }
    // update transport with current volume and weight
    const updatedTransport = await updateTransport(suitableTransport);
    if (!updatedTransport) {
      return false;
    }

    // update simulation with transportId
    const response = await updateSimulationTransportId(
      simulationId,
      updatedTransport.id
    );

    if (!response) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
}

/**
 * updateSimulationTransportId, update transportId of a simulation
 * @param simulationId
 * @param transportId
 * @returns {Promise<boolean>} A Promise that resolves when the transportId is updated
 */
async function updateSimulationTransportId(
  simulationId: number,
  transportId: number
): Promise<boolean> {
  if (!simulationId || !transportId) {
    throw new Error("Invalid simulation or transport ID");
  }

  try {
    // using axios to make the request
    const response = await axios.put(
      `${API_DOMAIN}/simulations/${simulationId}`,
      {
        transportId,
      }
    );

    if (!response.data) {
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
}
