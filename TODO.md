# TODO List for ColisApp Project

## Class Diagrams to Create/Finalize:

- [x] **Domaine Paiement (`Payment`)**
  - *Action:* Enregistrer le diagramme généré (class_diagram_payment_domain.puml).

- [x] **Domaine Suivi (`Tracking`)**
  - *Action:* Analyser les fichiers et générer le diagramme de classe.

- [x] **Domaine Notifications (`Notification`)**
  - *Action:* Analyser les fichiers et générer le diagramme de classe.

- [x] **Domaine Tarifs (`Tarifs`)** (Optionnel, à discuter)
  - *Action:* Analyser les fichiers et générer le diagramme de classe.

- [x] **Domaine Transport (`Transport`)** (Optionnel, à discuter)
  - *Action:* Analyser les fichiers et générer le diagramme de classe.

- [x] **Domaine Rendez-vous (`Appointment`)** (Optionnel, à discuter)
  - *Action:* Analyser les fichiers et générer le diagramme de classe.

- [x] **Domaine Utilisateur & Authentification** (Décomposé en sous-diagrammes)
  - *Action:* Le diagramme global a été analysé et sera décomposé pour plus de clarté.
  - [x] **Sous-domaine: Gestion du profil utilisateur et CRUD de base**
    - *Action:* Créer le diagramme de classe pour le modèle `User` et les opérations CRUD de base.
  - [x] **Sous-domaine: Flux d'authentification (Connexion, Inscription, NextAuth.js)**
    - *Action:* Créer le diagramme de classe pour les flux d'authentification.
  - [x] **Sous-domaine: Relations utilisateur et rôles**
    - *Action:* Créer le diagramme de classe pour les relations `AgencyClients`, `AgencyStaff`, `ClientDestinataire` et les rôles.
  - [x] **Sous-domaine: Gestion des adresses utilisateur**
    - *Action:* Créer le diagramme de classe pour `UserAddress`, `Address`, `City`, `Country`, `VatRate`, `Timezone`.
    - *Note:* Le modèle `UserAddress` est présent dans `prisma/schema.prisma` mais est commenté comme "REMOVED". Une clarification est nécessaire.
- [x] **Domaine Coupons** (À discuter)
  - *Action:* Analyser les modèles `Coupon`, `UserCoupon`, `EnvoiCoupon` et générer le diagramme de classe.
- [x] **Domaine Colis (`Parcel`)** (À discuter)
  - *Action:* Analyser le modèle `Parcel` et générer le diagramme de classe.
- [x] **Domaine Planification Transport (`TransportSchedule`)** (À discuter)
  - *Action:* Analyser le modèle `TransportSchedule` et générer le diagramme de classe.

## General Diagrams:

- [x] **Diagramme de Classe Général et Abstrait**
  - *Action:* Créer un diagramme de classe de haut niveau pour l'ensemble de l'application.

## Frontend Diagrams:

- [x] **Diagramme Abstrait du Frontend**
  - *Action:* Créer un diagramme abstrait de l'architecture frontend.

## Pending Actions:

- [ ] **Domaine Agence (`Agency`)**
  - *Action:* Créer manuellement le fichier `analyses/UML/class_diagram_agency_domain.puml` avec le contenu fourni précédemment, car l'outil n'a pas pu le faire automatiquement.
