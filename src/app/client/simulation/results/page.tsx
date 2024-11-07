// path: src/app/client/simulation/[id]/page.tsx

import {Suspense} from "react";
import SimulationResults from "@/components/forms/SimulationResults";
import PricingComponent from "@/components/pricing";

export default function WrappedSimulationResults()
{
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <div className="d-flex justify-content-around">
                <SimulationResults />
                {/*<PricingComponent  />*/}

            </div>

        </Suspense>
    );
}
