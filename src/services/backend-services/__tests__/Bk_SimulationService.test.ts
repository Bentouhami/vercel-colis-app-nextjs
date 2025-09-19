
// src/services/backend-services/__tests__/Bk_SimulationService.test.ts

import { createSimulation } from '../Bk_SimulationService';
import { agencyRepository } from '@/services/repositories/agencies/AgencyRepository';
import { simulationRepository } from '@/services/repositories/simulations/SimulationRepository';
import { CreateSimulationRequestDto } from '@/services/dtos';

// Mock the repositories
jest.mock('@/services/repositories/agencies/AgencyRepository');
jest.mock('@/services/repositories/simulations/SimulationRepository');

// Cast the mocked repositories to the correct type to access their methods
const mockedAgencyRepository = agencyRepository as jest.Mocked<typeof agencyRepository>;
const mockedSimulationRepository = simulationRepository as jest.Mocked<typeof simulationRepository>;

describe('Bk_SimulationService - createSimulation', () => {

  // Clear mocks before each test to ensure a clean state
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a simulation successfully when valid data is provided', async () => {
    // Arrange
    const simulationData: CreateSimulationRequestDto = {
      departureAgencyId: 1,
      arrivalAgencyId: 2,
      parcels: [{ weight: 1, length: 10, width: 10, height: 10 }],
      // other necessary fields...
    };

    const mockAgency = {
      id: 1,
      address: { city: { name: 'Test City', country: { name: 'Test Country' } } },
    };

    const mockCreatedSimulation = {
      id: 123,
      verificationToken: 'some-token',
      // ... other fields
    };

    mockedAgencyRepository.getAgencyById.mockResolvedValue(mockAgency as any);
    mockedSimulationRepository.createSimulation.mockResolvedValue(mockCreatedSimulation as any);

    // Act
    const result = await createSimulation(simulationData);

    // Assert
    expect(mockedAgencyRepository.getAgencyById).toHaveBeenCalledTimes(2);
    expect(mockedAgencyRepository.getAgencyById).toHaveBeenCalledWith(1);
    expect(mockedAgencyRepository.getAgencyById).toHaveBeenCalledWith(2);
    expect(mockedSimulationRepository.createSimulation).toHaveBeenCalledWith(simulationData);
    expect(result).toEqual(mockCreatedSimulation);
  });

  it('should throw an error if departure agency is not found', async () => {
    // Arrange
    const simulationData: CreateSimulationRequestDto = {
      departureAgencyId: 1,
      arrivalAgencyId: 2,
      parcels: [{ weight: 1, length: 10, width: 10, height: 10 }],
    };

    // Mock departure agency not found, but arrival agency is found
    mockedAgencyRepository.getAgencyById.mockImplementation((id) => {
        if (id === 1) return Promise.resolve(null);
        if (id === 2) return Promise.resolve({ id: 2, address: { city: { name: 'Arrival City', country: { name: 'Arrival Country' } } } } as any);
        return Promise.resolve(null);
    });

    // Act & Assert
    await expect(createSimulation(simulationData)).rejects.toThrow('Departure agency not found');
    expect(mockedSimulationRepository.createSimulation).not.toHaveBeenCalled();
  });

  it('should throw an error if arrival agency is not found', async () => {
    // Arrange
    const simulationData: CreateSimulationRequestDto = {
      departureAgencyId: 1,
      arrivalAgencyId: 2,
      parcels: [{ weight: 1, length: 10, width: 10, height: 10 }],
    };

    // Mock departure agency is found, but arrival agency is not
     mockedAgencyRepository.getAgencyById.mockImplementation((id) => {
        if (id === 1) return Promise.resolve({ id: 1, address: { city: { name: 'Departure City', country: { name: 'Departure Country' } } } } as any);
        if (id === 2) return Promise.resolve(null);
        return Promise.resolve(null);
    });

    // Act & Assert
    await expect(createSimulation(simulationData)).rejects.toThrow('Arrival agency not found');
    expect(mockedSimulationRepository.createSimulation).not.toHaveBeenCalled();
  });


  it('should throw an error for invalid simulation data (missing parcels)', async () => {
    // Arrange
    const simulationData = {
      departureAgencyId: 1,
      arrivalAgencyId: 2,
      parcels: [], // Invalid: empty parcels array
    } as CreateSimulationRequestDto;

    // Act & Assert
    await expect(createSimulation(simulationData)).rejects.toThrow('Invalid simulation data: Missing required fields');
    expect(mockedAgencyRepository.getAgencyById).not.toHaveBeenCalled();
    expect(mockedSimulationRepository.createSimulation).not.toHaveBeenCalled();
  });
});
