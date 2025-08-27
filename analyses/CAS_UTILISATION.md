# Liste des Cas d'Utilisation (Use Cases) - ColisApp

Ce document recense l'ensemble des cas d'utilisation identifiés pour l'application ColisApp. Il a pour vocation d'être une référence vivante, mise à jour au fil de l'évolution du projet.

---

## Acteur : Visiteur (Non authentifié)

- `UC-VIS-01`: Consulter les pages d'information (Accueil, Services, Tarifs, Contact) [TODO]
- `UC-VIS-02`: Simuler le tarif d'un envoi [DONE]
- `UC-VIS-03`: Initier le processus d'inscription [DONE]
- `UC-VIS-04`: Initier le processus de connexion [TODO]
- `UC-VIS-05`: Envoyer un message via le formulaire de contact [DONE]

### Acteur : Destinataire

- `UC-DEST-01`: Suivre un envoi par son numéro de suivi [DONE]
- `UC-DEST-02`: Consulter l'historique des événements d'un envoi [FUSIONNÉ DANS UC-DEST-01]

### Cas d'Utilisation Détaillé : Suivre un Envoi par son Numéro de Suivi

*   **ID :** `UC-DEST-01`
*   **Nom :** Suivre un Envoi par son Numéro de Suivi
*   **Acteur(s) Principal(aux) :** Destinataire, Client, Visiteur (tout utilisateur ayant un numéro de suivi)
*   **Description :** Permet à un utilisateur de consulter le statut actuel et l'historique détaillé des événements d'un envoi en fournissant un numéro de suivi valide.
*   **Préconditions :**
    *   L'utilisateur a accès à l'application (via le site web ou une application mobile).
    *   L'utilisateur dispose d'un numéro de suivi d'envoi.
*   **Flux Normal des Événements :**
    1.  L'utilisateur accède à la page de suivi des envois.
    2.  Le système affiche un champ de saisie pour le numéro de suivi.
    3.  L'utilisateur saisit le numéro de suivi et valide.
    4.  Le système recherche les informations de l'envoi et son historique dans la base de données.
    5.  Le système affiche les détails de l'envoi (statut actuel, informations de base) et la liste chronologique des événements de suivi (date, heure, description de l'événement, localisation).
*   **Flux Alternatifs :**
    *   **A1 : Numéro de Suivi Invalide ou Envoi Non Trouvé :**
        1.  À l'étape 3 du flux normal, le numéro de suivi saisi est invalide ou ne correspond à aucun envoi dans le système.
        2.  Le système affiche un message d'erreur approprié (ex: "Numéro de suivi invalide" ou "Envoi non trouvé").
        3.  Le cas d'utilisation se termine.
*   **Postconditions :**
    *   L'utilisateur a consulté les informations de suivi de l'envoi.
    *   Aucune modification n'est apportée aux données de l'envoi.

### Acteur : Client (Hérite des cas du Visiteur)

- **Gestion de Compte**
  - `UC-CLI-01`: S'inscrire et créer un compte [DONE]
  - `UC-CLI-02`: Valider son adresse e-mail [DONE]
  - `UC-CLI-03`: Se connecter [TODO]
  - `UC-CLI-04`: Se déconnecter [DONE]
  - `UC-CLI-05`: Réinitialiser son mot de passe (via e-mail) [DONE]
  - `UC-CLI-06`: Consulter son profil [TODO]
  - `UC-CLI-07`: Modifier ses informations personnelles [TODO]
  - `UC-CLI-08`: Gérer son carnet d'adresses (ajouter, modifier, supprimer) [TODO]
- **Gestion des Envois**
  - `UC-CLI-11`: Créer un nouvel envoi (depuis une simulation) [DONE]
  - `UC-CLI-12`: Ajouter/Sélectionner un destinataire [DONE]
  - `UC-CLI-13`: Consulter le récapitulatif d'un envoi avant paiement [DONE]
  - `UC-CLI-14`: Consulter son historique d'envois [DONE]
  - `UC-CLI-15`: Consulter les détails d'un envoi spécifique [TODO]
  - `UC-CLI-16`: Suivre le statut détaillé de ses envois [TODO]
  - `UC-CLI-17`: Annuler un envoi (si les conditions le permettent) [TODO]
- **Gestion des Paiements**
  - `UC-CLI-18`: Payer un envoi (par Carte, Cash) [DONE]
  - `UC-CLI-19`: Consulter son historique de paiements [TODO]
  - `UC-CLI-20`: Recevoir une confirmation de paiement [TODO]

### Acteur : Admin d'Agence (AGENCY_ADMIN)

- `UC-AGADM-01`: Se connecter au tableau de bord d'administration [TODO]
- `UC-AGADM-02`: Consulter le tableau de bord de son agence (statistiques clés) [TODO]
- `UC-AGADM-03`: Gérer le personnel de son agence (inviter, modifier, supprimer) [TODO]
- `UC-AGADM-04`: Gérer les envois de son agence (créer, modifier, mettre à jour le statut) [TODO]

### Acteur : Comptable (ACCOUNTANT)

- `UC-ACC-01`: Se connecter au tableau de bord d'administration [TODO]
- `UC-ACC-02`: Consulter le tableau de bord financier [TODO]

### Acteur : Super Admin (SUPER_ADMIN)

- `UC-SADM-01`: Se connecter au tableau de bord d'administration [TODO]
- `UC-SADM-02`: Consulter le tableau de bord global (statistiques de toutes les agences) [TODO]
- **Gestion des Agences**
  - `UC-SADM-03`: Créer une nouvelle agence [DONE]
  - `UC-SADM-04`: Modifier les informations d'une agence [DONE]
  - `UC-SADM-05`: Consulter la liste de toutes les agences [DONE]
  - `UC-SADM-06`: Activer/Désactiver une agence [DONE]
- **Gestion des Utilisateurs**
  - `UC-SADM-07`: Créer un nouvel utilisateur (tous rôles) [TODO]
  - `UC-SADM-08`: Modifier les informations et le rôle d'un utilisateur [TODO]
  - `UC-SADM-09`: Consulter la liste de tous les utilisateurs [TODO]
  - `UC-SADM-10`: Bloquer/Débloquer un utilisateur [TODO]
- **Gestion Globale**
  - `UC-SADM-11`: Consulter et gérer tous les envois du système [TODO]

---

## Évolutions Futures (Fonctionnalités Post-TFE)

Ces cas d'utilisation sont identifiés pour des développements ultérieurs et ne feront pas partie de l'implémentation pour le TFE.

### Acteur : Client

- `UC-CLI-09`: Gérer ses notifications [FUTURE]
- `UC-CLI-10`: Fermer son compte [FUTURE]
- `UC-CLI-21`: Gérer un retour d'envoi [FUTURE]
- `UC-CLI-22`: Déclarer un litige [FUTURE]
- `UC-CLI-23`: Planifier un enlèvement [FUTURE]

### Acteur : Admin d'Agence (AGENCY_ADMIN) (Future)

- `UC-AGADM-05`: Gérer les clients associés à son agence [FUTURE]
- `UC-AGADM-06`: Consulter les journaux d'activité de son agence [FUTURE]
- `UC-AGADM-07`: Générer un manifeste de transport [FUTURE]
- `UC-AGADM-08`: Gérer le stock de colis en agence (check-in/check-out) [FUTURE]
- `UC-AGADM-09`: Assigner des envois à un transport [FUTURE]

### Acteur : Comptable (ACCOUNTANT) (Future)

- `UC-ACC-03`: Gérer et valider les paiements [FUTURE]
- `UC-ACC-04`: Gérer la facturation [FUTURE]
- `UC-ACC-05`: Exporter des données financières et des rapports [FUTURE]
- `UC-ACC-06`: Consulter et gérer les grilles tarifaires [FUTURE]
- `UC-ACC-07`: Gérer les remboursements [FUTURE]
- `UC-ACC-08`: Gérer les coupons de réduction [FUTURE]

### Acteur : Super Admin (SUPER_ADMIN) (Future)

- `UC-SADM-12`: Consulter tous les journaux d'activité [FUTURE]
- `UC-SADM-13`: Gérer les paramètres généraux de l'application [FUTURE]
- `UC-SADM-14`: Consulter les rapports de performance [FUTURE]
- `UC-SADM-15`: Gérer les données de référence (Pays, Villes, etc.) [FUTURE]