// path: src/app/client/simulation

import SimulationForm from "@/components/forms/SimulationForms/SimulationForm";
import React from "react";

const SimulationPage = () => {
    return (
        <div className="container mx-auto max-w-2xl ">
            <h1 className="text-center mt-3 text-6xl">Faire une Simulation d&apos;un Envoi</h1>
            <SimulationForm/>

        </div>
    )
}
export default SimulationPage
