# Backlog de Mise à Jour des Diagrammes

Ce document sert de feuille de route pour la mise à jour de tous les diagrammes et sections de documentation nécessaires dans le "Dossier d'Analyse - ColisApp NEW.txt" afin de les aligner avec l'implémentation actuelle du projet Next.js.

---

## I. Analyse Technique (Modèle de Données)

- [ ] **1. Mettre à jour la Documentation du MPD (Section 9.3)**
  - **Objectif :** Remplacer la description des tables par une version à jour et complète basée sur `prisma/schema.prisma`. C'est la tâche la plus fondamentale.

- [ ] **2. Remplacer la Modélisation des Données (Sections 4.1.1 à 4.1.4)**
  - **Objectif :** Générer un nouveau diagramme Entité-Relation (ERD) à partir de `prisma/schema.prisma` pour remplacer les anciens schémas MCD, MLD et MPD.

- [ ] **3. Remplacer les Diagrammes de Classe (Sections 4.1.5 à 4.1.13)**
  - **Objectif :** Supprimer les diagrammes de classe de style Java et les remplacer par une présentation textuelle des modèles Prisma les plus importants (User, Envoi, Agency, etc.).

- [ ] **4. Créer le Diagramme des Pages Frontend (Section 4.1.14)**
  - **Objectif :** Créer un schéma de l'arborescence des pages de `src/app` pour visualiser la structure de l'interface utilisateur.

---

## II. Analyse Fonctionnelle (Flux Utilisateur)

- [ ] **5. Refaire le Diagramme de Séquence - Simulation d’un Envoi (Section 3.7.4.1)**
  - **Objectif :** Illustrer le flux Next.js moderne : interaction avec le formulaire React, appel à l'API Route `POST /api/v1/simulations`, création de l'envoi en base, et redirection.

- [ ] **6. Refaire le Diagramme de Séquence - Suivi d’un Envoi (Section 3.7.4.2)**
  - **Objectif :** Montrer comment la page de suivi (`/client/tracking/[trackingNum]`) récupère et affiche les données via les Server Components et les services backend.

- [ ] **7. Mettre à jour le Cas d’utilisation - Suivi de colis (Section 3.7.3.12)**
  - **Objectif :** Détailler le cas d'utilisation pour qu'il corresponde au diagramme de séquence mis à jour.

- [ ] **8. Mettre à jour le Cas d’utilisation - Fermeture de compte (Section 3.7.3.13)**
  - **Objectif :** Aligner le processus sur une suppression logique (soft delete) initiée depuis le profil de l'utilisateur.

---

## III. Documentation API

- [ ] **9. Réécrire la Documentation d'API (Section 9.4)**
  - **Objectif :** Remplacer complètement la documentation existante par une nouvelle, basée sur les API Routes actuelles dans `src/app/api/v1/`. Pour chaque route, documenter la méthode HTTP, le but, les paramètres/body et un exemple de réponse.
