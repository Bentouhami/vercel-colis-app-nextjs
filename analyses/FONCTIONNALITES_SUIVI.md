# Suivi des Fonctionnalités - Projet ColisApp

Ce document sert de feuille de route pour suivre l'état d'avancement du projet, en distinguant les fonctionnalités déjà implémentées de celles à prioriser pour la finalisation du projet et l'évaluation.

---

## 1. Fonctionnalités Implémentées (Base Actuelle)

Cette section liste les fonctionnalités déjà fonctionnelles dans le code, constituant le socle de l'application.

### ✅ Fonctionnalités Publiques / Visiteur

- **Navigation & Information** : Consultation des pages statiques (Accueil, Services, Tarifs, Contact, etc.).
- **Simulation de Coût** : Formulaire complet pour estimer le prix d'un envoi sans être connecté.
- **Suivi de Colis** : Page permettant de suivre un envoi avec un numéro de suivi.
- **Formulaire de Contact** : Envoi de messages au support.

### ✅ Fonctionnalités du Client (Authentifié)

- **Gestion de Compte** :
  - Inscription (Email/Mot de passe & Tiers Google/GitHub).
  - Connexion / Déconnexion.
  - Vérification d'email après inscription.
  - Réinitialisation de mot de passe.
- **Gestion de Profil** :
  - Modification des informations personnelles.
  - Gestion d'un carnet d'adresses.
- **Gestion des Envois** :
  - Création d'un envoi à partir d'une simulation.
  - Consultation de l'historique et des détails des envois.
  - Annulation d'un envoi.
- **Paiement en Ligne** :
  - Processus de paiement via une solution externe (Stripe).
  - Pages de confirmation (succès/échec).
- **Notifications & Rendez-vous** :
  - Sections dédiées dans le profil utilisateur.

### ✅ Fonctionnalités de l'Administration (Espace `/admin`)

- **Accès par Rôles** : Système de rôles fonctionnel (Super Admin, Admin d'Agence, Comptable).
- **Dashboard Admin** : Vue d'ensemble avec statistiques.
- **Gestion des Utilisateurs** : CRUD complet sur les utilisateurs et leurs rôles (Super Admin).
- **Gestion des Agences** : CRUD complet sur les agences (Super Admin).
- **Gestion des Envois** : Suivi et mise à jour du statut des envois.
- **Comptabilité** : Pages pour les rapports et l'export de données financières.

---

## 2. Améliorations et Prochaines Étapes (Priorisé)

Cette section liste les tâches à prioriser pour répondre aux exigences de la grille d'évaluation et finaliser le projet.

### 🔴 Haute Priorité (Critique pour l'évaluation)

- **[ ] Mettre en place une stratégie de tests (AA2)** :
  - **Objectif** : Démontrer la robustesse et la qualité du code.
  - **Actions** :
    - Rédiger des tests unitaires pour les services critiques (ex: `Bk_EnvoiService`, `Bk_UserService`).
    - Rédiger des tests d'intégration pour les routes d'API principales (ex: création d'envoi, paiement).
    - Documenter la stratégie de test dans votre rapport.

- **[ ] Finaliser la documentation technique (AA2, AA6)** :
  - **Objectif** : Aligner votre dossier d'analyse avec l'implémentation actuelle (Next.js).
  - **Actions** :
    - Mettre à jour les diagrammes d'architecture et de classes pour refléter l'architecture Next.js.
    - Documenter les routes d'API actuelles (endpoints, DTOs, réponses) dans la section `9.4` de votre dossier.
    - Ajouter des extraits de code pertinents et commentés dans le rapport pour illustrer les points techniques clés.

- **[ ] Finaliser les fonctionnalités marquées "à refaire"** :
  - **Objectif** : Compléter les cas d'utilisation décrits dans votre analyse.
  - **Actions** :
    - **Suivi de colis** : Revoir et valider le parcours utilisateur pour le suivi détaillé.
    - **Fermeture de compte** : Implémenter la logique de suppression de compte utilisateur.

- **[ ] Renforcer la sécurité (AA2)** :
  - **Objectif** : Assurer que le contrôle d'accès est correctement appliqué partout.
  - **Action** :
    - Auditer toutes les routes d'API de l'espace `/admin` pour vérifier que le rôle de l'utilisateur est bien vérifié avant d'exécuter l'action.

### 🟡 Moyenne Priorité (Améliorations et Finitions)

- **[ ] Améliorer l'expérience utilisateur (UI/UX)** :
  - **Objectif** : Offrir une application plus professionnelle et agréable à utiliser.
  - **Actions** :
    - Revoir la cohérence des composants graphiques.
    - Améliorer la gestion des états de chargement (`loading`) et des erreurs côté client.
    - S'assurer que l'application est entièrement responsive.

- **[ ] Rédiger la section "Difficultés rencontrées" (AA3)** :
  - **Objectif** : Démontrer une capacité d'analyse et de réflexion sur votre travail.
  - **Action** :
    - Documenter les problèmes techniques que vous avez eus (ex: configuration de NextAuth.js, gestion des états avec React, etc.) et comment vous les avez résolus.

- **[ ] Compléter l'étude financière (AA4)** :
  - **Objectif** : Répondre aux critères d'évaluation sur la gestion de projet.
  - **Action** :
    - Finaliser les sections sur le budget, le planning et le business model dans votre dossier.
