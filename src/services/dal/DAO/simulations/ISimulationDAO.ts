// path: src/services/dal/DAO/simulations/ISimulationDAO.ts


interface ISimulationDAO {
    getSimulationById(id: number): Promise<any>;
}