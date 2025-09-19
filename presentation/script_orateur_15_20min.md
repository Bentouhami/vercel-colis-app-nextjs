# Script orateur — ColisApp (15–20 min)

> Objectif : suivre le plan des 22 slides de `ColisApp_presentation_outline.txt`. Durée cible ~17 min + 2–3 min Q&A.

---

## Slide 1 — Titre & contexte (0:40)

- Accroche personnelle : « ColisApp est né d’une difficulté vécue pour envoyer un colis de Bruxelles vers Rabat. »
- Situer le projet : plateforme full-stack unifiant simulation, paiement, suivi et back-office agences.
- Mentionner l’école / encadrant, merci rapide, annoncer la durée (15–20 min) et la place de la démo.

## Slide 2 — Agenda (0:30)

- Lire rapidement les 7 axes : motivation, vision/périmètre, démarche, sécurité, architecture & démo, résultats, conclusion.
- Indiquer que les notes détaillées seront disponibles pour le jury.
- Transition : « Commençons par la motivation et la problématique. »

## Slide 3 — Motivation & problématique (1:40)

- Partager l'expérience personnelle : « Depuis Mons, j’ai cherché une agence pour envoyer un colis vers Rabat. Aucun site ne listait clairement les agences, leurs prix ou les dates de départ. J’ai dû appeler des amis, noter une adresse dans Google Maps, puis me déplacer jusqu’à Charleroi parce que personne ne répondait au téléphone. Sur place, paiement en liquide et aucune nouvelle pendant des jours. »
- Expliquer que cette situation est courante pour la communauté marocaine installée en Belgique et que les petites agences manquent d’outils digitaux.
- Poser la question centrale : comment proposer un parcours fiable de bout en bout (simulation → création → paiement → suivi) en respectant la sécurité des données et la réglementation ?
- Souligner l’impact attendu : redonner confiance aux clients, faire gagner du temps aux agences et fiabiliser la comptabilité.

## Slide 4 — Vision produit (1:00)

- Expliquer l’expérience utilisateur cible : simulateur transparent, paiement en ligne, suivi temps réel.
- Mentionner les interfaces adaptées aux rôles (client, destinataire, admin agence, comptable, super admin).
- Insister sur la promesse : « un seul outil pour envoyer, payer, suivre et piloter ». Relier aux enjeux identifiés slide précédente.

## Slide 5 — Vision business & marché (1:20)

- Segmenter les cibles : diaspora, agences indépendantes, commerces voulant proposer un service d’envoi.
- Décrire la proposition de valeur : service clé en main, transparence, automatisation.
- Exposer le modèle économique : commissions (2–5 %) + abonnement agence (29 €/mois) + options premium (assurance, express, boutique accessoires).
- SWOT condensé : forces (UX moderne), faiblesses (notoriété à construire), opportunités (nouveaux corridors UE/AFN), menaces (acteurs globaux).
- Conclure : « Le produit répond précisément aux irritants identifiés : opacité, lenteur, risque d’erreur ».

## Slide 6 — Périmètre & hypothèses (1:10)

- Rappeler ce qui est livré : simulation multi-étapes, paiement Stripe test, suivi QR, gestion rôles, e-mails, dashboards.
- Préciser ce qui reste partiel ou hors scope : reporting annuel, webhook Stripe, étiquettes PDF, suivi GPS, app mobile.
- Énoncer les hypothèses critiques : connexion stable, SMTP opérationnel, données seed préchargées, utilisateurs acceptant Stripe.
- Conditionner la mise en production : branchement webhook Stripe + monitoring/observabilité.

## Slide 7 — Analyse fonctionnelle (1:20)

- Expliquer la démarche : identité des parties prenantes, user stories, ateliers avec encadrant/agences.
- Citer quelques user stories clés : simulation sans compte, mise à jour statut par admin, consultation paiements par comptable.
- Mentionner les diagrammes produits (cas d’utilisation, séquences) et le backlog structuré.
- Transition vers modélisation : « pour implémenter cela, il fallait une base de données solide ».

## Slide 8 — Modélisation & données (1:00)

- Décrire le passage MCD → MLD → schema.prisma (source de vérité).
- Lister les entités (User, Agency, Parcel/Envoi, Payment, Tracking, Appointment) et leurs relations.
- Insister sur les validations Zod partagées entre frontend et backend.
- Évoquer la traçabilité via statut + événements tracking + QR code.

## Slide 9 — Sécurité & conformité (1:10)

- Présenter le RBAC : middleware Edge, rôles CLIENT, DESTINATAIRE, AGENCY_ADMIN, ACCOUNTANT, SUPER_ADMIN.
- Expliquer la bannière de consentement cookies (trois choix, cookie versionné 6 mois) et la gestion RGPD.
- Planifier les améliorations : rate limiting, journalisation centralisée (Sentry), webhook Stripe en prod, politique de confidentialité dédiée.
- Souligner la conformité aux secrets `.env` et la séparation des responsabilités (Auth.js vs API).

## Slide 10 — Parcours utilisateur (1:10)

- Décrire le flux client : simulation → création → paiement → suivi → notifications par e-mail.
- Mettre en avant le suivi public disponible pour destinataires sans compte.
- Préparer la démo : annoncer les captures/vidéo qui illustreront ce flux dans la partie démonstration.

## Slide 11 — Défis techniques & solutions (1:20)

- App Router Next.js : adoption des server components par défaut, fallback client pour formulaires interactifs.
- Auth.js en environnement Edge : dissociation vérification session vs rôles pour performance.
- Prisma : utilisation de `include` + `select` pour limiter la donnée, transactions lors création utilisateur/agence.
- Mentionner validations Zod et gestion des erreurs pour robustesse.

## Slide 12 — Planning & démarche (1:00)

- Balayer la frise : S1–S2 cadrage/benchmark, S3–S4 analyse & modélisation, S5–S8 implémentation, S9 tests/démo.
- Souligner l’apport de l’encadrant et des feedbacks agences pilotes.
- Expliquer la revue hebdo du backlog et la documentation continue (OpenAPI, annexes RBAC/RGPD).

## Slide 13 — Architecture App Router (admin) (0:50)

- Expliquer le layout admin : accès filtré par rôle, chargement data côté serveur, dashboards revenus/clients.
- Mentionner l’usage de Recharts et tables shadcn.
- Transition vers l’espace client.

## Slide 14 — Architecture App Router (clients) (0:50)

- Layout client : routes protégées, formulaires typés (react-hook-form + Zod), historique d’envois.
- Mettre en avant l’expérience responsive et les skeleton loaders.
- Préparer slide API.

## Slide 15 — Architecture App Router (API) (0:50)

- Décrire la structure REST v1 : dossiers par domaine, validations serveur, réponses typées.
- Exemple : `POST /api/v1/admin/users/create`, `GET /api/v1/tracking/[code]`.
- Séparation endpoints publics vs protégés (middleware RBAC).

## Slide 16 — Scénario liste d’envois (0:45)

- Illustrer comment la requête Prisma récupère les envois avec `include` ciblé.
- Présenter les colonnes affichées, le tri et la pagination.
- Mentionner le lien vers la fiche de suivi détaillée.

## Slide 17 — Requête naïve vs optimisée (0:45)

- Expliquer le problème de la requête naïve (data inutile, risque sécurité, performance).
- Montrer la version optimisée et les bénéfices concrets (1 requête SQL, charge réduite).
- Souligner l’apprentissage technique : « écrire des requêtes intentionnelles ».

## Slide 18 — Démonstration (2:30)

- Script démo :
  1. Simulation publique (montrer transparence prix).
  2. Connexion client test (email + mot de passe seed).
  3. Création d’un envoi (formulaire multi-étapes).
  4. Paiement Stripe test (carte 4242).
  5. Confirmation e-mail + QR code + suivi public.
- Conseils : lancer `npm run seed`, avoir boîtes mail test prêtes, zoomer sur toasts/UX.

## Slide 19 — Résultats & limites (1:00)

- Résultats : parcours bout-à-bout opérationnel, UI cohésive, architecture modulaire.
- Limites : tests auto partiels, observabilité à mettre en place, webhook Stripe en attente.
- Actions prévues : automatisation QA, monitoring (Sentry/Logtail), i18n, application mobile.

## Slide 20 — Conclusion & apports (1:10)

- Synthèse : problème résolu, solution technique/business, vision future.
- Apports personnels : maîtrise Next.js 15, Prisma, Auth.js, Stripe, RGPD.
- Remerciements encadrant, agences pilotes, équipe pédagogique.
- Invite : « Je suis prêt pour les questions et la démo live si le temps le permet. »

## Slide 21 — Q&A (buffer 1–2 min)

- Rappeler brièvement : « sujets possibles : architecture, sécurité, roadmap business ».
- Prévoir réponses : webhook Stripe (intégration prochaine), monitoring (Sentry, metrics), extension marché.
- Clôturer : remercier à nouveau.

---

## Annexes personnelles

- Fiches rapides avec liens vers deuxt trois fichiers clés (`src/app/api/v1/...`, `prisma/schema.prisma`, `analyses/Annexe_RBAC_RGPD.md`).
- Check-list démo (serveur démarré, .env complet, seed exécuté, carte test Stripe).
