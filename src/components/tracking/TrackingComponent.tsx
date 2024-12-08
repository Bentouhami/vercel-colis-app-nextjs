// path: src/components/tracking/TrackingComponent.tsx

interface TrackingProps {
    trackingNum: string;
}

export default function TrackingComponent({trackingNum}: TrackingProps) {
    return (
        <div className={"text-center justify-center flex flex-col"}>
            <p className={"text-xl"}>Tracking code: </p>
            <p className={"text-4xl font-bold"}>{trackingNum}</p>
        </div>
    );
}

