# Documentation Complète des Cas d'Utilisation - ColisApp

Ce document détaille l'ensemble des cas d'utilisation de l'application ColisApp, conformément au diagramme général. Les cas sont organisés par rôle ou espace d'interaction.

---

## 1. Espace Public & Destinataire

Actions disponibles pour les visiteurs non authentifiés et les destinataires d'envois.

| ID du Cas | Nom du Cas d'Utilisation | Description |
| :--- | :--- | :--- |
| **UC-VIS-01** | Consulter pages info | Permet à tout visiteur de naviguer et de lire le contenu des pages informatives (ex: "À propos", "Services", "Contact"). |
| **UC-VIS-02** | Simuler tarif envoi | Permet à un visiteur d'utiliser l'outil de simulation pour estimer le coût d'un envoi sans être connecté. |
| **UC-VIS-03** | Initier inscription | Permet à un visiteur de commencer le processus de création de compte. |
| **UC-VIS-04** | Initier connexion | Permet à un utilisateur déjà inscrit d'accéder à la page de connexion. |
| **UC-VIS-05** | Envoyer message contact | Permet à tout visiteur d'envoyer une demande ou un message à l'équipe via le formulaire de contact. |
| **UC-DEST-01**| Suivre envoi par N° | Permet à toute personne (client, destinataire, visiteur) de suivre le statut d'un colis en utilisant son numéro de suivi. |
| **UC-DEST-02**| Consulter historique événements | Après un suivi, permet de voir la liste détaillée des événements et des étapes de l'acheminement du colis. |

---

## 2. Espace Client

Fonctionnalités accessibles aux utilisateurs authentifiés avec le rôle "CLIENT".

### Gestion de Compte
| ID du Cas | Nom du Cas d'Utilisation | Description |
| :--- | :--- | :--- |
| **UC-CLI-01** | S'inscrire & créer compte | Processus complet de création de compte où l'utilisateur fournit ses informations et définit ses identifiants. |
| **UC-CLI-02** | Valider email | Permet à l'utilisateur de confirmer son adresse e-mail via un lien de validation pour activer son compte. |
| **UC-CLI-03** | Se connecter | Permet à un client de s'authentifier pour accéder à son espace personnel. |
| **UC-CLI-04** | Se déconnecter | Permet au client de mettre fin à sa session de manière sécurisée. |
| **UC-CLI-05** | Réinitialiser mot de passe | Permet à un client qui a oublié son mot de passe de le réinitialiser via son adresse e-mail. |
| **UC-CLI-06** | Consulter profil | Permet au client de visualiser les informations de son compte. |
| **UC-CLI-07** | Modifier infos persos | Permet au client de mettre à jour ses informations personnelles (nom, téléphone, etc.). |
| **UC-CLI-08** | Gérer carnet adresses | Permet au client d'ajouter, modifier ou supprimer des adresses de destinataires pour les réutiliser facilement. |
| **UC-CLI-09** | Gérer notifications | Permet au client de configurer ses préférences de notification (e-mail, SMS, etc.). |
| **UC-CLI-10** | Fermer compte | Permet au client de clôturer définitivement son compte. |

### Gestion des Envois et Paiements
| ID du Cas | Nom du Cas d'Utilisation | Description |
| :--- | :--- | :--- |
| **UC-CLI-11** | Créer nouvel envoi | Permet à un client connecté de démarrer le processus de création d'un nouvel envoi. |
| **UC-CLI-12** | Ajouter/Sélectionner destinataire | Permet de renseigner les informations du destinataire, soit manuellement, soit en le choisissant depuis le carnet d'adresses. |
| **UC-CLI-13** | Consulter récap envoi | Affiche un résumé complet de l'envoi (détails, coût) avant la confirmation et le paiement. |
| **UC-CLI-14** | Consulter historique envois | Permet au client de voir la liste de tous ses envois passés et en cours. |
| **UC-CLI-15** | Consulter détails envoi | Permet de visualiser toutes les informations détaillées d'un envoi spécifique depuis l'historique. |
| **UC-CLI-16** | Suivre statut détaillé | Permet au client de suivre l'état d'avancement de ses envois avec des informations détaillées. |
| **UC-CLI-17** | Annuler envoi | Permet au client d'annuler un envoi, si son statut le permet (ex: avant la prise en charge). |
| **UC-CLI-18** | Payer envoi | Permet de procéder au paiement en ligne sécurisé pour finaliser un envoi. |
| **UC-CLI-19** | Consulter historique paiements | Permet au client de consulter la liste de toutes ses transactions et de télécharger les factures. |
| **UC-CLI-20** | Recevoir confirmation paiement | Le système envoie une confirmation (e-mail) au client après un paiement réussi. |

---

## 3. Espace Admin d'Agence

Fonctionnalités pour les utilisateurs avec le rôle "AGENCY_ADMIN".

| ID du Cas | Nom du Cas d'Utilisation | Description |
| :--- | :--- | :--- |
| **UC-AGADM-01**| Se connecter admin | Permet à un admin d'agence de s'authentifier. |
| **UC-AGADM-02**| Consulter dashboard agence | Affiche une vue d'ensemble des statistiques et activités clés de son agence. |
| **UC-AGADM-03**| Gérer personnel agence | Permet d'ajouter, modifier ou supprimer les comptes du personnel de sa propre agence. |
| **UC-AGADM-04**| Gérer envois agence | Permet de gérer les colis qui transitent par son agence (réception, expédition, mise à jour de statut). |
| **UC-AGADM-05**| Gérer clients agence | Permet de consulter et gérer les clients enregistrés via son agence. |
| **UC-AGADM-06**| Consulter journaux activité agence | Permet de visualiser les logs des actions effectuées par le personnel de son agence. |

---

## 4. Espace Comptable

Fonctionnalités pour les utilisateurs avec le rôle "ACCOUNTANT".

| ID du Cas | Nom du Cas d'Utilisation | Description |
| :--- | :--- | :--- |
| **UC-ACC-01** | Se connecter comptable | Permet à un comptable de s'authentifier. |
| **UC-ACC-02** | Consulter dashboard financier | Affiche une vue d'ensemble des transactions, revenus et autres indicateurs financiers. |
| **UC-ACC-03** | Gérer & valider paiements | Permet de vérifier, valider ou marquer les paiements reçus (notamment pour les paiements hors ligne). |
| **UC-ACC-04** | Gérer facturation | Permet de générer, consulter et gérer les factures pour les clients ou les agences. |
| **UC-ACC-05** | Exporter données financières | Permet de générer et télécharger des rapports financiers (CSV, PDF) pour l'analyse comptable. |
| **UC-ACC-06** | Consulter & gérer tarifs | Permet de visualiser et de modifier les grilles tarifaires de l'application. |

---

## 5. Espace Super Admin

Fonctionnalités pour les utilisateurs avec le rôle "SUPER_ADMIN", ayant un contrôle total sur l'application.

| ID du Cas | Nom du Cas d'Utilisation | Description |
| :--- | :--- | :--- |
| **UC-SADM-01**| Se connecter super admin | Permet au super admin de s'authentifier. |
| **UC-SADM-02**| Consulter dashboard global | Affiche une vue d'ensemble de toute l'activité de la plateforme (toutes les agences, utilisateurs, etc.). |
| **UC-SADM-03**| Créer agence | Permet d'ajouter une nouvelle agence au réseau. |
| **UC-SADM-04**| Modifier agence | Permet de mettre à jour les informations d'une agence existante. |
| **UC-SADM-05**| Consulter liste agences | Permet de visualiser la liste de toutes les agences du réseau. |
| **UC-SADM-06**| Activer/Désactiver agence | Permet de rendre une agence opérationnelle ou de suspendre son activité sur la plateforme. |
| **UC-SADM-07**| Créer utilisateur (tous rôles) | Permet de créer manuellement un compte utilisateur avec n'importe quel rôle (Client, Admin, Comptable...). |
| **UC-SADM-08**| Modifier infos & rôle utilisateur | Permet de changer les informations et le rôle de n'importe quel utilisateur. |
| **UC-SADM-09**| Consulter liste utilisateurs | Permet de visualiser la liste de tous les utilisateurs de la plateforme. |
| **UC-SADM-10**| Bloquer/Débloquer utilisateur | Permet de suspendre ou de réactiver l'accès d'un utilisateur à la plateforme. |
| **UC-SADM-11**| Gérer tous les envois | Permet d'accéder à et de gérer n'importe quel envoi sur la plateforme, sans restriction d'agence. |
| **UC-SADM-12**| Consulter tous journaux activité | Permet de visualiser l'ensemble des logs d'activité de toute l'application. |
| **UC-SADM-13**| Gérer paramètres généraux | Permet de configurer les options et paramètres globaux de l'application. |

---

## 6. Cas d'utilisation à ajouter

### Acteur : Client (CLIENT)
| ID du Cas | Nom du Cas d'Utilisation | Description |
| :--- | :--- | :--- |
| **UC-CLI-21** | Gérer un retour d'envoi | Permet à un client d'initier une demande de retour pour un envoi livré, de suivre le processus de retour et d'obtenir un remboursement ou un avoir. |
| **UC-CLI-22** | Déclarer un litige | Permet à un client de signaler un problème avec un envoi (ex: colis endommagé, perdu, retard important) et de suivre la résolution du litige. |
| **UC-CLI-23** | Planifier un enlèvement | Permet au client de choisir un créneau horaire pour qu'un transporteur vienne récupérer son colis à une adresse spécifiée. |

### Acteur : Admin d'Agence (AGENCY_ADMIN)
| ID du Cas | Nom du Cas d'Utilisation | Description |
| :--- | :--- | :--- |
| **UC-AGADM-07** | Générer un manifeste de transport | Permet de créer une "feuille de route" ou un manifeste pour un transporteur, listant tous les colis à enlever ou à livrer pour une tournée donnée. |
| **UC-AGADM-08** | Gérer le stock de colis en agence | Permet de scanner les QR codes des colis à leur arrivée (`check-in`) et à leur départ (`check-out`) de l'agence pour un suivi précis en temps réel. |
| **UC-AGADM-09** | Assigner des envois à un transport | Permet à l'admin d'affecter manuellement un ou plusieurs envois à un véhicule/transport spécifique. |

### Acteur : Comptable (ACCOUNTANT)
| ID du Cas | Nom du Cas d'Utilisation | Description |
| :--- | :--- | :--- |
| **UC-ACC-07** | Gérer les remboursements | Permet de traiter et de valider les remboursements suite à une annulation, un retour ou un litige résolu en faveur du client. |
| **UC-ACC-08** | Gérer les coupons de réduction | Permet de créer, modifier, et suivre l'utilisation des coupons de réduction. |

### Acteur : Super Admin (SUPER_ADMIN)
| ID du Cas | Nom du Cas d'Utilisation | Description |
| :--- | :--- | :--- |
| **UC-SADM-14** | Consulter les rapports de performance | Générer et visualiser des rapports avancés sur les performances globales (délais de livraison moyens, taux de litiges, performance par agence, etc.). |
| **UC-SADM-15** | Gérer les données de référence | Permet d'importer ou de gérer manuellement les listes de pays, villes, et fuseaux horaires. |