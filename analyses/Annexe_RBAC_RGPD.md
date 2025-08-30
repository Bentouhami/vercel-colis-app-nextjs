# Annexe — Contrôle d’accès (RBAC) et RGPD

Ce document regroupe les éléments transverses relatifs à la sécurité (RBAC) et à la conformité RGPD pour ColisApp. Il est destiné à figurer en annexe du dossier d’analyse.

## 1) Contrôle d’accès (RBAC)

Objectif: définir qui peut accéder à quelles ressources (routes/pages/API) et comment l’application applique ces règles.

- Rôles supportés
  - Client: `CLIENT`
  - Destinataire: `DESTINATAIRE`
  - Administrateurs: `SUPER_ADMIN`, `AGENCY_ADMIN`, `ACCOUNTANT`

- Stratégie générale
  - Utilisateur non authentifié: accès aux routes publiques uniquement (accueil, simulation publique, suivi public, pages d’infos, endpoints publics).
  - Authentifié côté client (CLIENT/DESTINATAIRE): accès aux routes « client » (profil, envois de l’utilisateur, paiements, simulations authentifiées) et aux routes publiques. Accès interdit aux routes d’administration.
  - Administrateurs (SUPER_ADMIN, AGENCY_ADMIN, ACCOUNTANT): accès strictement limité aux routes d’administration. Accès bloqué au reste (client/public) pour limiter les erreurs de contexte et renforcer l’isolement des profils administratifs.

- Application et point d’enforcement
  - Middleware Edge Next.js: vérification centralisée du rôle et de l’état de session, redirections et blocages selon les routes ciblées.
    - Public et routes d’authentification: autorisées sans session.
    - Redirection des utilisateurs déjà connectés hors des pages d’authentification.
    - Redirection d’accueil selon le rôle (client → `/client`, admin → `/admin`).
    - Blocage explicite des accès interdits avec redirection vers pages « unauthorized » dédiées.

- Sessions et identité
  - Authentification NextAuth avec stratégie JWT (Credentials + OAuth Google/GitHub).
  - Enrichissement des claims JWT (id, prénom/nom, email, rôle, image, etc.) exposés à la session.
  - Pour certaines APIs personnalisées, un cookie JWT applicatif est aussi utilisé (lecture/validation côté serveur).

- Bonnes pratiques implémentées
  - Listes explicites des routes par catégorie (public, auth, client, admin) évaluées avec prise en charge des routes dynamiques.
  - Refus par défaut pour les accès hors liste du rôle concerné (principe de moindre privilège).
  - Empêchement d’énumération basique (messages d’erreur génériques à la connexion).

- Améliorations recommandées (prochaines itérations)
  - Limitation de débit (rate limiting) sur les endpoints sensibles (login, contact, paiements).
  - Journalisation centralisée et alerting (p. ex. Sentry) pour les accès refusés et erreurs critiques.
  - Tests d’intégration sur le middleware pour valider les chemins d’accès critiques.

## 2) RGPD — Cookies et consentement

Objectif: informer, obtenir et tracer le consentement de l’utilisateur pour les cookies non nécessaires et documenter les pratiques de protection des données.

- Bannière de consentement (FR)
  - Affichée à la première visite, avec trois actions: « Tout accepter », « Tout refuser », « Gérer les préférences ».
  - Panneau de préférences: catégories « Nécessaires » (obligatoires), « Analyse », « Marketing ». Les « Nécessaires » restent activés et non modifiables.
  - Lien vers la Politique de confidentialité depuis la bannière et le pied de page (à relier à la page légale dédiée).

- Catégories et base légale
  - Nécessaires: intérêt légitime (fonctionnement du service: sécurité, session, simulation).
  - Analyse/Marketing: consentement explicite (opt-in), désactivés par défaut.

- Traçabilité du consentement
  - Cookie `cookie_consent` (JSON versionné), durée: 6 mois, attributs: `SameSite=Lax`, `Secure` en production, `Path=/`.
  - Évènement `window` émis lors de la mise à jour (`cookie-consent:updated`) pour conditionner le chargement d’outils (ex. analytics) au consentement.

- Cookies nécessaires (exemples)
  - Authentification: cookie de session NextAuth et/ou cookie JWT applicatif (`COOKIE_NAME`).
  - Simulation: `SIMULATION_COOKIE_NAME` (transport d’état chiffré/ signé par JWT côté serveur).
  - Attributs recommandés: `HttpOnly` (si lecture côté client inutile), `Secure` (prod), `SameSite=Strict` ou `Lax` selon besoins de navigation.

- Droits des personnes et transparence
  - Droit d’accès, rectification, suppression; procédure de retrait/modification du consentement (réouverture des préférences via un lien dans le footer/paramètres compte).
  - Documentation des finalités, durées de conservation, destinataires/tiers (ex. Stripe, Cloudinary, éventuel outil d’analytics), et coordonnées de contact.

- Exemples de durées de conservation en place
  - Jeton de réinitialisation de mot de passe: 2 heures.
  - Consentement cookies: 6 mois.

- Améliorations recommandées (prochaines itérations)
  - Page « Politique de confidentialité / cookies » dédiée et mise à jour continue (finalités, tiers, mesures de sécurité, modalités d’exercice des droits).
  - Chargement conditionnel des scripts d’analytics/marketing via un « loader » qui écoute le consentement.
  - Journalisation des consentements (si besoin de preuve renforcée côté serveur).

---

Notes de mise en œuvre (références code, non exhaustives):

- RBAC/Middleware: `src/middleware.ts`
- Auth NextAuth (JWT, OAuth): `src/auth/auth.ts`, `src/auth/auth-edge.ts`
- JWT applicatif (cookies): `src/utils/generateToken.ts`, `src/utils/verifyToken.ts`, `src/lib/simulationCookie.ts`
- Bannière de consentement: `src/components/privacy/CookieConsent.tsx` (intégrée via `src/app/layout.tsx`)
