// path: src/services/dtos/envois/PaymentSuccessDto.ts

import { SimulationStatus } from '@/services/dtos/enums/EnumsDto';

export interface PaymentSuccessDto {
    id: number;             // The Envoi's ID
    paid: boolean;
    simulationStatus: SimulationStatus;
    trackingNumber: string | null;
    qrCodeUrl: string | null;
    userId: number;         // For internal checks
    arrivalAgencyId: number; // For internal checks
}
