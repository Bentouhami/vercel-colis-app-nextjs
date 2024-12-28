// src/utils/constants.ts
export const PASSWORD_MIN_LENGTH = 8;
export const PHONE_REGEX = /^\+?\d{1,3}[ -]?\d{9,12}$/;
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/;
// Maximum allowed parcels per shipment
export const COLIS_MAX_PER_ENVOI = 5;

// Maximum allowed weight per shipment (in kilograms)
export const MAX_ENVOI_WEIGHT = 70;

// Maximum total dimensions per shipment (in cm³ or L + W + H < 360)
export const MAX_ENVOI_VOLUME = 360;

// Constraints for transport
export const MAX_TRANSPORT_WEIGHT = 15000; // Maximum truck weight (in kilograms)
export const MAX_TRANSPORT_VOLUME = 42000000; // Maximum truck volume (in cm³)

// Production and development domains
const PRODUCTION_DOMAIN = "https://vercel-colis-app-nextjs.vercel.app";

// Local development domain for testing purposes
const DEVELOPMENT_DOMAIN = "http://localhost:3000";

// Domain for the current environment
export const DOMAIN = process.env.NODE_ENV === 'production'
    ? PRODUCTION_DOMAIN
    : DEVELOPMENT_DOMAIN;


// URLs for payment success and cancel
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


// Cloudinary constants
export const QR_CODES_FOLDER = "qr_codes";