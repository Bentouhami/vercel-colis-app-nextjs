// // src/app/simulation/results/page.tsx

import {Suspense} from "react";
import SimulationResults from "@/components/forms/SimulationResults";

export default function WrappedSimulationResults() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SimulationResults />
        </Suspense>
    );
}
