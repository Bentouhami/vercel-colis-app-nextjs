# Liste des Diagrammes de Séquence à Réaliser - ColisApp

Ce document recense les diagrammes de séquence clés à développer pour approfondir l'analyse des processus critiques de l'application ColisApp. Chaque diagramme détaillera les interactions chronologiques entre les acteurs et les composants du système.

---

## 1. Authentification Utilisateur (Connexion / Inscription)

**Description :** Ce diagramme illustrera le flux complet de connexion et d'inscription d'un utilisateur, incluant la validation des identifiants, la gestion des sessions et l'interaction avec les services d'authentification.

**Acteurs / Composants Clés :**

- Utilisateur (Client, Admin, etc.)
- Frontend (Pages de connexion/inscription)
- API d'authentification (`/api/auth`, `/api/v1/users/login`, `/api/v1/users/register`)
- Auth.js (NextAuth.js)
- Services Backend (ex: `Bk_UserService`)
- Base de données (Prisma)

---

## 2. Gestion des Utilisateurs par le Super Admin (Création / Modification)

**Description :** Ce diagramme montrera les étapes impliquées lorsqu'un Super Admin crée ou modifie un compte utilisateur, y compris la définition des rôles et des informations personnelles.

**Acteurs / Composants Clés :**

- Super Admin
- Frontend (Interface d'administration des utilisateurs)
- API de gestion des utilisateurs (`/api/v1/users`)
- Services Backend (`Bk_UserService`)
- Base de données (Prisma)

---

## 3. Mise à Jour du Statut d'un Envoi

**Description :** Ce diagramme détaillera le processus de mise à jour du statut d'un envoi par un administrateur d'agence ou un Super Admin, incluant l'enregistrement de l'événement de suivi et la notification du client.

**Acteurs / Composants Clés :**

- Admin d'Agence / Super Admin
- Frontend (Interface de gestion des envois)
- API de gestion des envois (`/api/v1/envois`)
- Services Backend (`Bk_EnvoiService`)
- Base de données (Prisma)
- Service de notification (pour l'envoi d'emails/SMS)

---

## 4. Réinitialisation du Mot de Passe

**Description :** Ce diagramme couvrira le flux de réinitialisation du mot de passe, depuis la demande initiale de l'utilisateur jusqu'à la confirmation de la mise à jour du mot de passe, en passant par l'envoi et la validation du token.

**Acteurs / Composants Clés :**

- Utilisateur
- Frontend (Pages de réinitialisation du mot de passe)
- API d'authentification (`/api/v1/auth/forgot-password`, `/api/v1/auth/reset-password`)
- Services Backend (`Bk_UserService`)
- Service de mailer (`src/lib/mailer.ts`)
- Base de données (Prisma)

---

## 5. Soumission du Formulaire de Contact

**Description :** Ce diagramme simple illustrera le processus d'envoi d'un message via le formulaire de contact public, montrant l'interaction avec l'API et le service d'envoi d'emails.

**Acteurs / Composants Clés :**

- Visiteur
- Frontend (Page "Contact Us")
- API de contact (`/api/v1/contact`)
- Service de mailer (`src/lib/mailer.ts`)

---
