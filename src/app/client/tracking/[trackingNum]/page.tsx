// path: src/app/client/tracking/[trackingNum]/page.tsx

import TrackingComponent from "@/components/tracking/TrackingComponent";

// Définir le type pour params
interface TrackingPageParams {
    params: Promise<{
        trackingNum: string;
    }>;
}

export default async function TrackingPage(props: TrackingPageParams) {
    const params = await props.params;
    return (
        <div className={"container"}>
            <h1 className={"text-center container-fluid p-5 text-6xl mt-5 rounded-top-5 shadow max-w-6xl w-full"}>
                Code de suivi: {params.trackingNum}
            </h1>
            <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">
                <div className="h-full rounded-lg bg-gray-200 p-5">
                    <TrackingComponent trackingNum={params.trackingNum}/>
                    <div className={"mt-5 mb-5 text-center justify-center flex flex-col"}>
                        <h1 className={"text-xl"}>Détails de l&apos;envoi: </h1>
                    </div>
                </div>
                <div className="h-full rounded-lg bg-gray-200 lg:col-span-2">
                    MAP
                </div>
            </div>
        </div>
    );
}
