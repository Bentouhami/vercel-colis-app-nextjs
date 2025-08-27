# Résumé des Points d'Accès API Clés de ColisApp

Ce document fournit un résumé des points d'accès API RESTful les plus importants de l'application ColisApp, organisés par domaine fonctionnel. Pour une documentation complète et détaillée, veuillez vous référer au fichier OpenAPI (`analyses/OpenAPI_ColisApp.yaml`) ou à l'interface Swagger UI hébergée.

## 1. Utilisateurs (Users)

| Point d'Accès API | Méthode | Description |
| :---------------- | :------ | :---------- |
| `/api/v1/users` | `GET` | Récupère la liste des utilisateurs (filtrée par rôle). |
| `/api/v1/users/{id}` | `GET` | Récupère les détails d'un utilisateur spécifique par ID. |
| `/api/v1/users/{id}` | `DELETE` | Supprime logiquement un utilisateur par ID. |
| `/api/v1/users/{id}/profile` | `GET` | Récupère le profil d'un utilisateur par ID. |
| `/api/v1/users/{id}/profile` | `PUT` | Met à jour le profil d'un utilisateur par ID. |
| `/api/v1/users/register` | `POST` | Enregistre un nouvel utilisateur (flux personnalisé). |
| `/api/v1/users/login` | `POST` | Authentifie un utilisateur et génère un token JWT (flux personnalisé). |
| `/api/v1/users/logout` | `GET` | Déconnecte l'utilisateur en supprimant le cookie de session. |
| `/api/v1/users/verify` | `POST` | Vérifie l'adresse email d'un utilisateur avec un token. |
| `/api/v1/users/destinataires` | `POST` | Crée ou associe un destinataire à l'utilisateur actuel. |
| `/api/v1/users/list` | `GET` | Récupère la liste des utilisateurs (accès Admin). |
| `/api/v1/users/all` | `GET` | Récupère tous les utilisateurs (accès Admin). |

## 2. Authentification (Authentication - NextAuth.js)

| Point d'Accès API | Méthode | Description |
| :---------------- | :------ | :---------- |
| `/api/auth/[...nextauth]` | `GET`/`POST` | Gère les flux d'authentification NextAuth.js (OAuth, Credentials). |
| `/api/auth/status` | `GET` | Vérifie si l'utilisateur est authentifié. |
| `/api/auth/verify-credentials` | `POST` | Valide les identifiants pour le Credentials Provider de NextAuth.js. |
| `/(auth)/check-reset-token` | `GET` | Vérifie la validité d'un token de réinitialisation de mot de passe. |
| `/(auth)/forgot-password` | `POST` | Demande la réinitialisation du mot de passe (envoi d'email). |
| `/(auth)/reset-password` | `POST` | Réinitialise le mot de passe de l'utilisateur avec un token. |

## 3. Agences (Agencies)

| Point d'Accès API | Méthode | Description |
| :---------------- | :------ | :---------- |
| `/api/v1/agencies` | `GET` | Récupère les agences par ville. |
| `/api/v1/agencies` | `POST` | Crée une nouvelle agence. |
| `/api/v1/agencies/{id}` | `GET` | Récupère les détails d'une agence par ID. |
| `/api/v1/agencies/{id}` | `PUT` | Met à jour une agence par ID. |
| `/api/v1/agencies/admin-agencies` | `GET` | Récupère les agences pour l'administrateur (filtré par rôle). |
| `/api/v1/agencies/create-agency` | `POST` | Crée une nouvelle agence (accès Admin). |
| `/api/v1/agencies/findAgency` | `GET` | Trouve l'ID d'une agence par ses détails (pays, ville, nom). |
| `/api/v1/agencies/get-agency-by-id` | `GET` | Récupère les détails d'une agence par ID (accès Admin). |
| `/api/v1/agencies/light` | `GET` | Récupère une liste allégée d'agences. |
| `/api/v1/agencies/summary` | `GET` | Résumé de l'agence (placeholder). |
| `/api/v1/agencies/update-agency` | `PUT` | Met à jour une agence existante. |

## 4. Envois (Shipments)

| Point d'Accès API | Méthode | Description |
| :---------------- | :------ | :---------- |
| `/api/v1/envois` | `POST` | Crée un nouvel envoi. |
| `/api/v1/envois/{id}` | `GET` | Récupère un envoi par ID. |
| `/api/v1/envois/{id}` | `PUT` | Met à jour un envoi par ID. |
| `/api/v1/envois/{id}/status` | `PUT` | Met à jour le statut d'un envoi par ID (accès Admin). |
| `/api/v1/envois/cancel` | `POST` | Annule une simulation d'envoi. |
| `/api/v1/envois/user/{userId}` | `GET` | Récupère les envois par ID utilisateur. |

## 5. Paiements (Payments)

| Point d'Accès API | Méthode | Description |
| :---------------- | :------ | :---------- |
| `/api/v1/payment` | `POST` | Crée une session de paiement Stripe. |
| `/api/v1/payment/complete-payment` | `GET` | Finalise le processus de paiement après redirection. |

## 6. Simulations (Simulations)

| Point d'Accès API | Méthode | Description |
| :---------------- | :------ | :---------- |
| `/api/v1/simulations` | `POST` | Crée une nouvelle simulation. |
| `/api/v1/simulations` | `GET` | Récupère les détails de la simulation à partir du cookie. |
| `/api/v1/simulations` | `PUT` | Met à jour une simulation existante. |
| `/api/v1/simulations/{id}` | `GET` | Récupère les détails de la simulation par ID. |
| `/api/v1/simulations/{id}/payment-amount` | `GET` | Récupère le montant du paiement de la simulation. |
| `/api/v1/simulations/delete-cookies` | `GET` | Supprime les cookies de simulation. |
| `/api/v1/simulations/edit` | `PUT` | Met à jour une simulation existante (version d'édition). |

## 7. Suivi (Tracking)

| Point d'Accès API | Méthode | Description |
| :---------------- | :------ | :---------- |
| `/api/v1/tracking/{trackingNumber}` | `GET` | Récupère les événements de suivi par numéro de suivi. |
| `/api/v1/tracking` | `POST` | Ajoute un événement de suivi (accès Admin). |

## 8. Transports (Transports)

| Point d'Accès API | Méthode | Description |
| :---------------- | :------ | :---------- |
| `/api/v1/transports` | `GET` | Récupère la liste des transports. |
| `/api/v1/transports` | `PUT` | Met à jour un transport. |

## 9. Adresses (Addresses)

| Point d'Accès API | Méthode | Description |
| :---------------- | :------ | :---------- |
| `/api/v1/addresses` | `GET` | Récupère toutes les adresses. |
| `/api/v1/addresses` | `POST` | Crée une nouvelle adresse. |
| `/api/v1/addresses/{id}` | `GET` | Récupère une adresse par ID. |
| `/api/v1/addresses/{id}` | `PUT` | Met à jour une adresse par ID. |
| `/api/v1/addresses/{id}` | `DELETE` | Supprime une adresse par ID. |

## 10. Villes (Cities)

| Point d'Accès API | Méthode | Description |
| :---------------- | :------ | :---------- |
| `/api/v1/cities` | `GET` | Récupère les villes avec agences par pays. |
| `/api/v1/cities/{countryId}` | `GET` | Récupère les villes pour un ID de pays donné. |

## 11. Pays (Countries)

| Point d'Accès API | Méthode | Description |
| :---------------- | :------ | :---------- |
| `/api/v1/countries/all` | `GET` | Récupère tous les pays. |
| `/api/v1/countries` | `GET` | Récupère les pays distincts avec agences. |

## 12. Tableau de Bord (Dashboard)

| Point d'Accès API | Méthode | Description |
| :---------------- | :------ | :---------- |
| `/api/v1/dashboard/super-admin` | `GET` | Récupère les statistiques du tableau de bord Super Admin. |

## 13. Tarifs (Tarifs)

| Point d'Accès API | Méthode | Description |
| :---------------- | :------ | :---------- |
| `/api/v1/tarifs` | `GET` | Récupère les tarifs de tarification. |

## 14. Rendez-vous (Appointments)

| Point d'Accès API | Méthode | Description |
| :---------------- | :------ | :---------- |
| `/api/v1/users/appointments/book` | `POST` | Réserve un rendez-vous pour un envoi payé. |
| `/api/v1/users/appointments/envoi-paye` | `GET` | Récupère le dernier envoi payé sans rendez-vous. |

## 15. Contact (Contact)

| Point d'Accès API | Méthode | Description |
| :---------------- | :------ | :---------- |
| `/api/v1/contact` | `POST` | Envoie un message via le formulaire de contact. |
| `/api/v1/contact` | `OPTIONS` | Gère les requêtes pré-vol CORS pour le formulaire de contact. |
