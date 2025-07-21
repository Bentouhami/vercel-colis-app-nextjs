# Audit d'Avancement des Fonctionnalités - ColisApp

Ce document a pour but de suivre l'état d'implémentation de chaque fonctionnalité clé du projet ColisApp. Il sert de feuille de route pour identifier le travail restant et prioriser les développements.

## Méthodologie d'Évaluation

Chaque fonctionnalité est évaluée selon l'échelle suivante :

- **0%** : Non implémenté. Aucune trace de la fonctionnalité dans le code.
- **20%** : Début d'implémentation. Des fichiers (API, routes, composants) ont été créés, mais la logique est absente ou non fonctionnelle.
- **50%** : Fonctionnalité partielle. L'API et le frontend sont connectés et la fonctionnalité est utilisable, mais présente des bugs majeurs ou des manques évidents.
- **80%** : Presque terminé. La fonctionnalité est pleinement opérationnelle, mais nécessite des améliorations mineures (UI/UX, gestion d'erreurs, refactoring).
- **100%** : Terminé. La fonctionnalité est complète, testée, et répond à tous les critères définis.

---

## Tableau d'Audit

| N° | Module | Acteur(s) | Fonctionnalité | État d'Implémentation | Notes |
|:---|:---|:---|:---|:---:|:---|
| **A** | **Public & Simulation** | | | | |
| A.1 | | Visiteur | Consulter les pages informatives | **50%** | Accueil (100%), Services (20%), Tarifs (20%), À propos (80% mais lien dans footer). |
| A.2 | | Visiteur | Envoyer un message via le formulaire de contact | **100%** | Page, API et envoi d'email fonctionnels. |
| A.3 | | Visiteur, Destinataire | Suivre un envoi par son numéro de suivi | **30%** | Page de saisie + page de détail existent. Affiche les données initiales (statut CRÉÉ, map vide). Logique de mise à jour des statuts manquante. |
| A.4 | | Visiteur | Simuler le tarif d'un envoi (processus complet) | **100%** | Pages de simulation et de résultats, ainsi que l'API, sont fonctionnelles. |
| **B** | **Authentification & Compte Client** | | | | |
| B.1 | | Visiteur, Client | Inscription d'un nouveau client | **100%** | Page et API d'inscription fonctionnelles. |
| B.2 | | Client | Validation du compte par e-mail | **100%** | Page, API et service d'envoi d'e-mails fonctionnels. |
| B.3 | | Client, Admins | Connexion (Email/Password, Google, GitHub) | **50%** | Connexion par Email/Password (Credentials) fonctionnelle à 100%. Google et GitHub non implémentés. |
| B.4 | | Client | Déconnexion | **100%** | Fonctionnalité de déconnexion opérationnelle. |
| B.5 | | Client | Réinitialisation du mot de passe (processus complet) | **100%** | Pages, API et service d'envoi d'e-mails fonctionnels. |
| B.6 | | Client | Consulter son profil | **50%** | API du profil (50%). Sous-pages : Livraisons (100%), Profil principal (100%), Paramètres (80%), Rendez-vous (10%), Notifications (10%), Adresses (0%), Paiements (0%). |
| B.7 | | Client | Modifier ses informations personnelles | **50%** | Page de paramètres existante (80%). API de profil partiellement implémentée (50%). |
| B.8 | | Client | Gérer son carnet d'adresses (CRUD) | **0%** | Page frontend dédiée absente. API générale pour adresses existe, mais pas de routes CRUD spécifiques par ID. |
| B.9 | | Client | Gérer ses préférences de notification | **10%** | Page frontend existante (10%), mais API backend pour la gestion des préférences manquante ou très limitée. |
| **C** | **Gestion des Envois (Client)** | | | | |
| C.1 | | Client | Créer un nouvel envoi (finalisation de la simulation) | **100%** | Pages de simulation et de récapitulatif, ainsi que l'API de création d'envoi, sont fonctionnelles. |
| C.2 | | Client | Consulter son historique d'envois (liste) | **100%** | Page frontend (Deliveries) et API fonctionnelles. |
| C.3 | | Client | Consulter les détails d'un envoi spécifique | **10%** | Modal client fonctionnel (100%). Page admin dédiée (`/client/envois/details`) à 10% (placeholder). API de récupération des détails à vérifier. |
| C.4 | | Client | Annuler un envoi (si statut le permet) | **10%** | API d'annulation existante, mais pas d'option frontend pour déclencher l'annulation depuis la page des livraisons. |
| C.5 | | Client | Payer un envoi (intégration Stripe) | **100%** | Intégration Stripe complète (pages, API, succès/échec). |
| C.6 | | Client | Consulter son historique de paiements | **0%** | Page frontend dédiée absente. API générale pour paiements existe, mais pas de route spécifique pour l'historique utilisateur. |
| C.7 | | Client | Recevoir les e-mails de confirmation (paiement, envoi, etc.) | **10%** | Service d'envoi d'e-mails fonctionnel pour inscription, reset password, contact-us. Non implémenté pour paiement et changements de statut d'envoi. |
| **D** | **Administration - Super Admin** | | | | |
| D.1 | | Super Admin | Consulter le dashboard global | **50%** | Page admin principale (`/admin`) existe avec titre et 3 cards, mais sans données backend (chiffres). Pages `/admin/stats` et `/admin/reports` à 10%. |
| D.2 | | Super Admin | Gérer les agences (CRUD) | **100%** | Pages de liste (`/admin/agencies`) et de création (`/admin/agencies/new`) fonctionnelles. APIs de création et mise à jour fonctionnelles. |
| D.3 | | Super Admin | Gérer les utilisateurs (CRUD, changer rôle, bloquer) | **50%** | Page de liste (`/admin/users`) à 100%. Page de création (`/admin/users/new`) à 50% (logique de création client et solution mot de passe à implémenter). |
| D.4 | | Super Admin | Gérer tous les envois du système | **10%** | Page de liste (`/admin/envois`) existe. Page de détails/suivi et APIs pour la liste et les détails des envois manquantes ou non fonctionnelles. |
| D.5 | | Super Admin | Gérer les paramètres généraux de l'application | **0%** | Page frontend existante, mais APIs backend pour la lecture/écriture des paramètres manquantes. |
| **E** | **Administration - Admin d'Agence** | | | | |
| E.1 | | Admin Agence | Consulter le dashboard de son agence | **10%** | Dashboard à 10%, données d'agences à 50%. |
| E.2 | | Admin Agence | Gérer le personnel de son agence (CRUD) | **50%** | Pages frontend dédiées et APIs spécifiques non trouvées, mais l'évaluation à 50% suggère une implémentation partielle ou via des routes/pages génériques. |
| E.3 | | Admin Agence | Gérer les envois de son agence (créer, modifier, màj statut) | **50%** | Pages frontend dédiées et APIs spécifiques non trouvées, mais l'évaluation à 50% suggère une implémentation partielle ou via des routes/pages génériques. |
| E.4 | | Admin Agence | Consulter les journaux d'activité de son agence | **0%** | Pages frontend dédiées et APIs spécifiques non trouvées. |
| **F** | **Administration - Comptable** | | | | |
| F.1 | | Comptable | Consulter le dashboard financier | **10%** | Pages frontend dédiées et APIs spécifiques non trouvées. |
| F.2 | | Comptable | Gérer et valider les paiements (surtout "Cash") | **0%** | Pages frontend dédiées et APIs spécifiques non trouvées. |
| F.3 | | Comptable | Gérer la facturation | **0%** | Pages frontend dédiées et APIs spécifiques non trouvées. |
| F.4 | | Comptable | Exporter des données financières | **0%** | Page frontend existante, mais APIs backend pour la génération de rapports manquantes. |
| F.5 | | Comptable | Gérer les grilles tarifaires (CRUD) | **0%** | Page frontend dédiée absente. API générale pour tarifs existe, mais pas de routes CRUD spécifiques par ID. |
| **G** | **Fonctionnalités Avancées (Futures)** | | | | |
| G.1 | | Client | Planifier un enlèvement de colis | **0%** | Page frontend pour les rendez-vous existe (10%), mais pas de page spécifique pour initier un nouvel enlèvement. APIs backend pour la gestion des rendez-vous manquantes. |
| G.2 | | Client | Gérer un retour ou déclarer un litige | **0%** | Pages frontend dédiées et APIs spécifiques non trouvées. |
| G.3 | | Admin Agence | Gérer le stock en agence (scan QR Code) | **0%** | Pages frontend dédiées et APIs spécifiques non trouvées. |
| G.4 | | Admin Agence | Générer un manifeste de transport | **0%** | Pages frontend dédiées et APIs spécifiques non trouvées. |
| G.5 | | Comptable | Gérer les coupons de réduction (CRUD) | **0%** | Pages frontend dédiées et APIs spécifiques non trouvées. |
