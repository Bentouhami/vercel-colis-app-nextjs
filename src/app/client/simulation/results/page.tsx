// path: src/app/client/simulation/[id]/page.tsx

import {Suspense} from "react";
import SimulationResults from "@/components/client-specific/simulation/SimulationResults";

export default function WrappedSimulationResults() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <div className="d-flex justify-content-around">
                <SimulationResults/>
            </div>

        </Suspense>
    );
}
