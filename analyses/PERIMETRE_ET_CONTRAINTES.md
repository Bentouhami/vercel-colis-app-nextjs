# 2.3. Périmètre du projet et 2.4. Hypothèses/Contraintes

Cette note affine le périmètre et les contraintes du projet ColisApp en l’état actuel du code et des fonctionnalités.

## 2.3. Périmètre du projet

Cette section précise ce que couvre ColisApp dans sa version actuelle, ce qui est partiellement couvert et ce qui n’est pas inclus.

### 2.3.1. Fonctionnalités incluses

- **Simulation d’envoi**: calcul du prix en fonction pays/ville/agence, caractéristiques des colis; parcours multi‑étapes, sélecteurs avec recherche.
- **Gestion d’agences et rattachements**: création/sélection d’agences; rattachement obligatoire pour Admin d’agence et Comptable; filtrage des envois par agence pour les Admins d’agence.
- **Comptes et rôles**: authentification NextAuth (credentials + providers prêts), rôles (Client, Destinataire, Admin d’agence, Comptable, Super Admin) avec middleware d’accès précis.
- **Création d’utilisateurs par Super Admin**: flux « invitation » sans mot de passe, envoi d’un lien de définition via e‑mail (reset token).
- **Adresses et profils**: formulaires réutilisables (pays/ville/rue), bibliothèque de saisie de téléphone avec indicatif pays.
- **Paiement en ligne (Stripe)**: session de paiement, finalisation, mise à jour de l’envoi et enregistrement d’un paiement « PAID ».
- **Suivi des colis**: génération de numéro de suivi, événements de tracking, QR code (généré et stocké).
- **Notifications e‑mail**: vérification e‑mail, réinitialisation mot de passe, confirmation de paiement (incluant N° de suivi + lien direct), template HTML compatible clients e‑mail.
- **Tableaux de bord**: agrégations « semaine/mois » (montants payés, nouveaux clients), widgets et graphiques; « Revenus total » et séries temporelles.
- **API structurée**: endpoints REST v1 (users, agencies, simulations, envois, tracking, payment, auth…), DTO/validation côté serveur et client (zod).

### 2.3.2. Fonctionnalités partiellement implémentées

- **Reporting/Comptabilité avancée**: indicateurs clés présents (total revenus, revenus journaliers, clients/jour), mais analyses approfondies (annuel, marge, TVA détaillée, export multi‑formats) limitées. Vue « Année » en préparation.
- **Sécurité paiement**: intégration Stripe basée sur retour success/cancel. Webhook d’attestation (anti‑fraude/anti‑manip) non encore branché en production.
- **Gestion documentaire/logistique**: QR codes et suivi présents; pas encore d’étiquettes complètes (PDF multi‑formats), ni de scan opérationnel en agences.

### 2.3.3. Fonctionnalités hors périmètre

- Suivi GPS temps réel des colis.
- Tarifs personnalisés par agence (les tarifs restent centralisés en base par l’administrateur général).
- Application mobile native (web responsive uniquement).
- Notifications SMS / push (e‑mail uniquement).
- Multi‑devise / multi‑pays fiscal (EUR uniquement, logique TVA simplifiée).
- Gestion des remboursements/chargebacks Stripe et litiges avancés.

## 2.4. Hypothèses et contraintes

### 2.4.1. Hypothèses

- **Connectivité**: les utilisateurs disposent d’une connexion Internet stable.
- **Paiement**: les clients acceptent de payer via Stripe; les montants sont en EUR.
- **E‑mails**: SMTP correctement configuré (envoi, délivrabilité, anti‑spam de base).
- **Données de référence**: listes pays/villes/agences initialisées et maintenues (via seed/BO).
- **Charge**: montée en charge progressive compatible avec l’hébergement serverless (Vercel).
- **Conformité**: les utilisateurs acceptent les CGU et la politique de confidentialité.

### 2.4.2. Contraintes techniques

- **Sécurité & RGPD**: minimisation des données personnelles, chiffrement en transit, silotage des rôles, gestion des tokens (reset/verification), pas de stockage de CB (Stripe).
- **Authentification**: NextAuth en mode JWT; sessions côté client, middleware Next.js pour RBAC.
- **Paiement**: intégration Stripe checkout; besoin d’ajouter un webhook de confirmation pour sécuriser définitivement la comptabilisation des paiements en production.
- **Architecture**: Next.js (app router, serverless), Prisma + PostgreSQL, Nodemailer pour e‑mails, hébergement Vercel; endpoints REST v1.
- **Observabilité**: logs d’erreurs côté serveur; pas de traçage distribué ni d’APM.
- **Performance**: appels agrégés pour dashboards « semaine/mois »; filtrage agence côté BDD pour les Admins d’agence; pas de caching global encore activé.
- **Frontend**: composants UI (shadcn), formulaires typés zod, inputs téléphoniques avec indicatif pays, charting Recharts; UI principalement en français.
- **Internationalisation**: non activée (français par défaut).
- **Fichiers & médias**: QR codes stockés via utilitaire; pas de gestion de storage volumineux (photos, scan) dans ce périmètre.
- **Tests & déploiement**: exécution en environnements .env; sensibilité aux variables (EMAIL_SERVER_HOST, STRIPE_SECRET_KEY, DATABASE_URL, AUTH_SECRET…).

### 2.4.3. Pré‑requis & points d’attention opérationnels

- **Variables d’environnement obligatoires**: accès SMTP, Stripe, BDD, auth; failover prévu en cas d’absence (dégradation contrôlée).
- **Données de base**: agences/cités/pays doivent être disponibles pour les formulaires.
- **Sécurité paiement**: passage en production à condition d’ajouter le webhook Stripe et de durcir les validations (idempotence, signature).
- **Gouvernance des rôles**: Super Admin peut créer tous les rôles; Admin d’agence/Comptable doivent être rattachés à une agence; middleware déjà strict (accès public/admin/client).
- **Templates e‑mail**: utiliser systématiquement des templates tables + styles inline pour compatibilité clients.
