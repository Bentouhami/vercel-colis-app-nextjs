// path : src/app/client/unauthorized/page.tsx

import React from 'react';
import Link from "next/link";

export default function UnauthorizedPage() {


    return (
        <div className="d-flex items-center justify-center h-screen">
            <h1 className="text-4xl font-bold">Accès refusé</h1>
            <p className="mt-4">Vous n&apos;avez pas les droits suffisants pour accéder à cette page.</p>

            <p className="mt-4">
                Redirecting to home page... in <span id="redirect-timer">5</span> seconds

            </p>
            {/*<Link href="/client/login" className="btn btn-primary mt-4">*/}
            {/*    Retourner à la page de connexion*/}
            {/*</Link>*/}
        </div>
    );
}
