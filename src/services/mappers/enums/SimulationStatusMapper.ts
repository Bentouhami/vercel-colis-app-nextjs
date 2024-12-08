// path: src/services/mappers/enums/SimulationStatusMapper.ts

import {SimulationStatus as PrismaSimulationStatus} from "@prisma/client";
import {SimulationStatus} from "@/services/dtos";

export class SimulationStatusMapper {
    static toDtoStatus(status: PrismaSimulationStatus): SimulationStatus {
        switch (status) {
            case PrismaSimulationStatus.DRAFT:
                return SimulationStatus.DRAFT;
            case PrismaSimulationStatus.CONFIRMED:
                return SimulationStatus.CONFIRMED;
            case PrismaSimulationStatus.COMPLETED:
                return SimulationStatus.COMPLETED;
            case PrismaSimulationStatus.CANCELLED:
                return SimulationStatus.CANCELLED;
            default:
                throw new Error(`Invalid Simulation Status: ${status}`);
        }
    }

    static toPrismaStatus(status: SimulationStatus): PrismaSimulationStatus {
        switch (status) {
            case SimulationStatus.DRAFT:
                return PrismaSimulationStatus.DRAFT;
            case SimulationStatus.CONFIRMED:
                return PrismaSimulationStatus.CONFIRMED;
            case SimulationStatus.COMPLETED:
                return PrismaSimulationStatus.COMPLETED;
            case SimulationStatus.CANCELLED:
                return PrismaSimulationStatus.CANCELLED;
            default:
                throw new Error(`Invalid Simulation Status: ${status}`);
        }
    }

    static isValidStatus(status: SimulationStatus): boolean {
        return Object.values(SimulationStatus).includes(status);
    }
}

