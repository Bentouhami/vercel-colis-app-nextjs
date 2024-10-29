// Path: src/services/frontend-services/simulation/SimulationService.ts
import {
    BaseSimulationDto,
    CreateParcelDto, FullSimulationDto,
    SimulationStatus, SimulationWithoutIds, TarifsDto
} from "@/utils/dtos";
import {DOMAIN} from "@/utils/constants";
import {calculateEnvoiDetails} from "@/services/frontend-services/simulation/SimulationCalculationService";
import {getTarifs} from "@/services/frontend-services/TarifsService";

export async function submitSimulation(simulationData: BaseSimulationDto): Promise<number> {

    console.log("log ====> submitSimulation function called");
    console.log("simulationData in submitSimulation function: ", simulationData);
    // 1. Récupérer les tarifs actuels
    const tarifs : TarifsDto = await getTarifs() ;
    console.log("tarifs in submitSimulation function: ", tarifs);

    if (!tarifs) {
        throw new Error("Tarifs not found");
    }

    if (!simulationData) {
        throw new Error("Simulation data not found");
    }

    const parcels = simulationData.parcels as CreateParcelDto[];
    // 2. Calculer les détails de l'envoi
    const calculationResults =
        await calculateEnvoiDetails(parcels, tarifs);

    if(!calculationResults) {
        throw new Error("Calculation results not found");
    }

    console.log("log ====> simulationData in submitSimulation function: ", simulationData);
    // 3. Préparer les données à envoyer
    const simulationBaseData : SimulationWithoutIds = {
        ...simulationData, // représente BaseSimulationDto
        ...calculationResults, // représente  SimulationCalculationTotalsDto
        status: SimulationStatus.DRAFT, // ajoutée pour la SimulationWithoutIds interface
    };

    if(!simulationBaseData) {
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

    return await response.json();
}


export async function getSimulationById(id: number): Promise<FullSimulationDto | null> {
    try {

        // essayer d'envoyer la id a la route  /api/v1/simulations/[id]/route.ts
        const response = await fetch(`${DOMAIN}/api/v1/simulations/${id}`);

        if (!response.ok) {
            throw new Error('Failed to fetch simulation');
        }

        // Utilisez `await response.json()` pour obtenir les données au format JSON
        const simulationData: FullSimulationDto = await response.json();
        return simulationData;


    } catch (error) {
        console.error('Error getting simulation:', error);
        throw error; // Relancer l'erreur pour qu'elle puisse être capturée par la fonction appelante
    }
}
