// path src/app/client/profile/deliveries/page.tsx

import React from "react";
import DeliveriesList from "@/components/client-specific/profile/DeliveriesList";

export default function DeliveriesPage() {

    return (
        <div className="w-full max-w-3xl">
            <h1 className="  text-2xl font-bold mb-4">Envois</h1>
            <DeliveriesList />
        </div>
    );
}