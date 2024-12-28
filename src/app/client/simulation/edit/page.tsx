// path: src/app/client/simulation/edit
import {Suspense} from "react";

import SimulationEditForm from "@/components/forms/SimulationForms/SimulationEditForm";

export default function WrappedSimulationResults() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <div className="d-flex justify-content-around">
                <SimulationEditForm/>
            </div>

        </Suspense>
    );
}
