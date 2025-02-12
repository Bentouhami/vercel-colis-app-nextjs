// path src/components/client-specific/profile/DeliveriesList.tsx

"use client";

import React, { useEffect, useState } from "react";
import { getCurrentUserId } from "@/lib/auth";
import {EnvoiDto} from "@/services/dtos";
import {fetchUserDeliveries} from "@/services/frontend-services/envoi/EnvoiService";

export default function DeliveriesList() {
    const [deliveries, setDeliveries] = useState<EnvoiDto[]>([]);

    useEffect(() => {
        (async () => {
            const userId = await getCurrentUserId();
            if (!userId) return;
            const data = await fetchUserDeliveries(userId);
            setDeliveries(data);
        })();
    }, []);

    return (
        <ul>
            {deliveries.map((delivery) => (
                <li key={delivery.id}>
                    {delivery.arrivalAgency?.name}
                    {delivery.departureAgency?.name}
                    {delivery.totalWeight}
                    {delivery.totalVolume}
                    {delivery.totalPrice}
                    {/*{delivery.arrivalDate}*/}
                    {/*{delivery.departureDate}*/}
                    {delivery.envoiStatus}
                    {delivery.simulationStatus}
                    {delivery.paid}
                    {delivery.comment}
                    {delivery.trackingNumber}
                    {delivery.qrCodeUrl}
                    {delivery.userId}
                    {delivery.destinataireId}
                    {delivery.transportId}
                    {delivery.departureAgencyId}
                    {delivery.arrivalAgencyId}
                     {delivery?.parcels?.map((parcel) => (
                        <li key={parcel.id}>
                            {parcel.height}
                            {parcel.weight}
                            {parcel.width}
                            {parcel.length}
                        </li>
                    ))}
                    <button onClick={() => console.log("clicked")}>click</button>


                </li>

            ))}

        </ul>
        );
}
