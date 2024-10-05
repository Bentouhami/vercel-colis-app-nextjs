// page.tsx : Page de simulation d'envoi
// api/v1/simulation/route.ts : Route de simulation d'envoi
import SimulationForm from "@/components/forms/SimulationForms/SimulationForm";
import React from "react";

const SimulationPage = () => {
    return (
        <div className="container mx-auto ">
            <h1 className="text-center mt-3 text-6xl">Faire une Simulation d&apos;un Envoi</h1>
            <div className="d-flex flex-column flex-md-row align-items-center justify-content-center">
                <div className=" d-flex flex-column b align-items-center justify-content-center">
                    <SimulationForm results/>
                </div>
            </div>

        </div>
    )
}
export default SimulationPage
