# Documentation des Diagrammes

Ce document centralise la documentation détaillée des différents diagrammes UML et autres représentations visuelles du projet ColisApp.

---

## Diagramme de Séquence : Séquence de Simulation d'Envoi

### Titre du Diagramme : Séquence de Simulation d'Envoi Simplifiée et Corrigée

**Objectif :**
Ce diagramme de séquence décrit le flux principal des interactions entre un utilisateur, l'application ColisApp et la base de données lors du processus de simulation d'un envoi, de la saisie des informations initiales jusqu'à la confirmation de la simulation et le début du processus de paiement, en incluant la gestion de l'authentification de l'utilisateur.

**Acteurs Impliqués :**

* **User (Utilisateur) :** L'acteur humain qui interagit avec l'interface de l'application.
* **Application :** Représente le système ColisApp dans son ensemble, incluant l'interface utilisateur (UI), les services front-end et back-end, les API et la logique métier. C'est le point central de traitement des requêtes utilisateur.
* **Database (Base de Données) :** Le système de persistance des données où sont stockées toutes les informations relatives aux envois, aux utilisateurs, aux agences, etc.

**Flux des Événements :**

1. **Accès à la Page de Simulation :**
    * L'utilisateur accède à la page de simulation de l'envoi.
    * L'Application récupère les données nécessaires (ex: agences disponibles) depuis la Base de Données.
    * L'Application affiche la page de simulation à l'utilisateur.

2. **Saisie des Informations de l'Envoi :**
    * L'utilisateur saisit les informations de l'envoi (poids, dimensions, type d'envoi) dans l'interface.
    * L'Application traite ces informations et enregistre la simulation en tant que brouillon dans la Base de Données.
    * L'Application affiche les résultats de la simulation à l'utilisateur (prix, destinations départ/arrivée, dates d'estimation).

3. **Confirmation de la Simulation et Authentification :**
    * L'utilisateur clique sur "Confirmer la simulation".
    * **Condition (Utilisateur connecté) :**
        * Si l'utilisateur est déjà connecté, l'Application met à jour le statut de la simulation dans la Base de Données.
        * L'Application redirige l'utilisateur vers la page d'ajout du destinataire.
    * **Condition (Utilisateur non connecté) :**
        * Si l'utilisateur n'est pas connecté, l'Application affiche une modale de connexion.
        * L'utilisateur se connecte via la modale.
        * L'Application redirige l'utilisateur vers la page d'ajout du destinataire.

4. **Saisie et Stockage des Informations du Destinataire :**
    * L'utilisateur saisit les informations du destinataire.
    * L'Application stocke ces informations dans la Base de Données.
    * L'Application redirige l'utilisateur vers la page de récapitulatif ou de paiement.

5. **Processus de Paiement :**
    * L'utilisateur procède au paiement.
    * **Condition (Paiement réussi) :**
        * L'Application traite le paiement.
        * L'Application met à jour le statut de l'envoi (payé) dans la Base de Données.
        * L'Application affiche la confirmation de paiement à l'utilisateur.
    * **Condition (Paiement échoué) :**
        * L'Application affiche un message d'erreur de paiement à l'utilisateur.

---

## Diagramme de Séquence : Séquence de Suivi d'un Envoi

### Titre du Diagramme : Séquence de Suivi d'un Envoi

**Objectif :**
Ce diagramme de séquence décrit le flux des interactions entre un utilisateur, l'application ColisApp et la base de données lors du processus de suivi d'un envoi, de la saisie du numéro de suivi jusqu'à l'affichage des informations de l'envoi ou d'un message d'erreur.

**Acteurs Impliqués :**

* **User (Utilisateur) :** L'acteur humain qui interagit avec l'interface de l'application.
* **Application :** Représente le système ColisApp dans son ensemble, incluant l'interface utilisateur (UI), les services front-end et back-end, les API et la logique métier. C'est le point central de traitement des requêtes utilisateur.
* **Database (Base de Données) :** Le système de persistance des données où sont stockées toutes les informations relatives aux envois, aux utilisateurs, aux agences, etc.

**Flux des Événements :**

1. **Accès à la Page de Suivi :**
    * L'utilisateur accède à la page dédiée au suivi des envois.
    * L'Application affiche un champ de saisie pour le numéro de suivi.

2. **Saisie et Recherche du Numéro de Suivi :**
    * L'utilisateur saisit le numéro de suivi dans le champ prévu à cet effet.
    * L'Application envoie une requête à la Base de Données pour rechercher les informations de l'envoi et son historique de suivi correspondant au numéro fourni.

3. **Affichage des Résultats de la Recherche :**
    * **Condition (Envoi trouvé) :**
        * La Base de Données retourne les détails de l'envoi et l'historique de suivi à l'Application.
        * L'Application affiche ces informations à l'utilisateur.
    * **Condition (Envoi non trouvé / Numéro invalide) :**
        * La Base de Données indique à l'Application que l'envoi n'a pas été trouvé ou que le numéro est invalide.
        * L'Application affiche un message d'erreur approprié à l'utilisateur (ex: "Envoi non trouvé" ou "Numéro invalide").
