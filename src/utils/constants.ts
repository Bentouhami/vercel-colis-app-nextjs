// src/utils/constants.ts

export const COLIS_MAX_PER_ENVOI = 5;

const PRODUCTION_DOMAIN = "https://vercel-colis-app-nextjs.vercel.app";
// const PRODUCTION_DOMAIN = "http://localhost:3000";
const DEVELOPMENT_DOMAIN = "http://localhost:3000";

export const DOMAIN = process.env.NODE_ENV === 'production'
    ? PRODUCTION_DOMAIN
    : DEVELOPMENT_DOMAIN;


export const successUrl =
    `${DOMAIN}/client/payment/payment-success`;
export const cancelUrl =
    `${DOMAIN}/client/payment/payment-cancel`;
// export const CLOUD_NAME = "dksb7fler";


// Liste des origines autorisées
export const ALLOWED_ORIGINS =
    process.env.NODE_ENV === "production"
        ? [PRODUCTION_DOMAIN]
        : [DEVELOPMENT_DOMAIN];
