// path: src/app/client/simulation

import MultiStepSimulationForm from "@/components/forms/SimulationForms/MultiStepSimulationForm";
import Simulation from "@/components/forms/SimulationForms/Simulation";
import React from "react";
import SimulationFormWizard from '@/components/forms/SimulationForms/SimulationFormWizard';

const SimulationPage = () => {
    return (
        <div className="container mx-auto max-w-2xl ">
            {/* <MultiStepSimulationForm /> */}
            {/* <Simulation /> */}
            <SimulationFormWizard />

        </div>
    )
}
export default SimulationPage

