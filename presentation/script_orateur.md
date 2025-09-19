# Script orateur — ColisApp (12–18 min)

Format: 14–16 minutes, 12–14 slides. Rester concret, visuel d’abord, texte en appui. Prévoir 1–2 min de marge.

## Slide 1 — Titre & Contexte (0:45)

- Message: ColisApp — plateforme d’envoi, paiement et suivi Belgique ↔ Maroc.
- Public: particuliers et agences.
- Note: Objectif d’ensemble: parcours unifié du calcul de prix au suivi.

## Slide 2 — Motivation & Justification (1:30)

- Constats: coûts opaques, process fragmentés, faible traçabilité.
- Valeur: transparence, efficacité, confiance agence–client.
- Note: Problème réel rencontré par utilisateurs et agences partenaires.

## Slide 3 — Problématique de base (1:15)

- Formulation: comment offrir un parcours continu et fiable: simulation → création → paiement → suivi.
- Contraintes: sécurité, RGPD, multi-rôles.

## Slide 4 — Objectifs & Périmètre (1:00)

- MVP: simulation, création d’envoi, paiement Stripe (test), tracking, multi‑agences.
- Hors scope immédiat: app mobile native, analytics avancées (perspectives).

## Slide 5 — Démarche du chercheur (1:30)

- Analyse: UML/MCD, OpenAPI (voir `analyses/` et `analyses/OpenAPI_ColisApp.yaml`).
- Itérations: maquettes → composants shadcn/Tailwind → validations Zod.
- Méthodo: cycles courts concevoir → implémenter → valider → documenter.

## Slide 6 — Architecture (1:45)

- Stack: Next.js 15 (App Router + API), Prisma/PostgreSQL, Auth.js, Stripe, Cloudinary, Nginx (Docker).
- Rôle: front+API unifiés, DAL typé, intégrations sécurisées.
- Visuel: `analyses/architecture_nextjs.puml` (export PNG).

## Slide 7 — Modèle de données (1:15)

- Entités: User, Agency, Parcel/Envoi, Payment, Appointment, Notification.
- Traçabilité: numéro de tracking, statuts d’envoi.
- Visuels: `prisma/schema.prisma`, `analyses/UML/class_diagram_parcel_domain.puml`.

## Slide 8 — Sécurité & RGPD (1:00)

- Auth.js, RBAC (CLIENT/AGENCY_ADMIN/SUPER_ADMIN), validation serveur (Zod).
- Secrets: `.env`, `docker-compose.yml` (jamais commités).
- Réf: `analyses/Annexe_RBAC_RGPD.md`.

## Slide 9 — API & Flux métier (1:30)

- Endpoints v1: users, envois, tracking, payment; Swagger `src/app/api/swagger/route.ts`.
- Principe: contrats stables, idempotence sur opérations sensibles.
- Visuel: UI Swagger + extrait d’endpoint (ex. `src/app/api/v1/tracking/[trackingNumber]/route.ts`).

## Slide 10 — Démo scénarisée (2:30–3:00)

- Parcours: 1) Simulation → 2) Connexion → 3) Création envoi → 4) Paiement test → 5) Suivi.
- Mettre en avant: skeletons de chargement, toasts, mails.
- Prépa: `npm run seed`, carte Stripe test `4242 4242 4242 4242`.

## Slide 11 — Résultats & Limites (1:00)

- Résultats: UX fluide, archi modulaire, performances bonnes (Turbopack dev).
- Limites: tests auto à étoffer (intégration/E2E), observabilité.

## Slide 12 — Conclusion personnelle (1:00)

- Acquis: Next.js 15, Prisma, Stripe, Auth.js, rigueur RGPD.
- Méthodo: itératif, documentation continue.
- Suite: notifications push, i18n complète, appli mobile.

## Slide 13 — Questions (buffer 1–2 min)

- Garder 1–2 min; slide minimaliste.

---

Conseils de livraison

- Ratio 16:9, 3–5 bullets/slide, mots‑clés en gras.
- Captures: préparer dossier `presentation/shots` avec fichiers numérotés.
- Démarrage démo: `npm run dev` ou `docker compose up --build` (voir `docker-compose.yml`).
