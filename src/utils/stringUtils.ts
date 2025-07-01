// src/app/utils/stringUtils.ts

// Fonction pour mettre en majuscule la première lettre et tout le reste en minuscule
export function capitalizeFirstLetter(str: string): string {
    if (!str) return '';
    return str.trim().charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

//  Fonction pour supprimer les espaces et les retours à la ligne
export function removeSpacesAndNewLines(str: string): string {
    if (!str) return '';
    return str.replace(/\s/g, '').replace(/\n/g, '');
}

// Fonction pour mettre tout en minuscule
export function toLowerCase(str: string): string {
    if (!str) return '';
    return str.trim().toLowerCase();
}
