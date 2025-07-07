# Résumé du Projet ColisApp

Ce document fournit un résumé concis du projet ColisApp, une application full-stack basée sur Next.js. Il sera mis à jour au fur et à mesure de l'avancement de l'analyse et du développement.

## 1. Objectif du Projet

ColisApp est une application de gestion des expéditions et de la logistique, conçue pour faciliter le suivi des colis, la gestion des agences, des utilisateurs, des paiements et des simulations d'envoi.

## 2. Technologies Clés

- **Frontend**: Next.js (React), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, TypeScript
- **Base de Données**: PostgreSQL
- **ORM**: Prisma
- **Authentification**: Auth.js (NextAuth.js)

## 3. Architecture Générale

L'application suit une architecture en couches bien définie, comprenant :

- **Couche de Présentation**: Gère l'interface utilisateur et le routage côté client.
- **Couche API**: Expose les points d'accès RESTful pour la communication entre le frontend et le backend.
- **Couche de Services**: Contient la logique métier principale de l'application.
- **Couche d'Accès aux Données**: Gère les interactions avec la base de données via Prisma.
- **Couche d'Utilitaires/Helpers**: Fournit des fonctions et des configurations partagées.

## 4. Modèle de Données (Prisma Schema)

Le schéma Prisma (`prisma/schema.prisma`) définit les entités clés telles que `User`, `Agency`, `Envoi` (Expédition), `Payment`, `TrackingEvent`, `Address`, `City`, `Country`, etc. Il inclut des relations bien définies et des enums pour assurer la cohérence des données.

## 5. Routes API

Les routes API sont organisées sous `src/app/api/v1/` et couvrent la gestion des utilisateurs, des agences, des expéditions, des adresses, des paiements, des simulations, du suivi, etc.

## 6. Routes des Pages

Les pages sont structurées sous `src/app/`, avec une séparation claire entre les sections `admin` et `client`, ainsi que des pages dédiées à l'authentification et aux informations générales.

## 7. Authentification (Auth.js)

L'authentification est gérée par Auth.js, avec le support des identifiants (email/mot de passe), Google et GitHub. L'intégration avec Prisma assure la persistance des données d'authentification. Les rôles (`CLIENT`, `SUPER_ADMIN`, `AGENCY_ADMIN`, `ACCOUNTANT`, `DESTINATAIRE`) sont utilisés pour le contrôle d'accès basé sur les rôles.

---

*Ce résumé sera complété et affiné au fur et à mesure de l'analyse approfondie du projet.*