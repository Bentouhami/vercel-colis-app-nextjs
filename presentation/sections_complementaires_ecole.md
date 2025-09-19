# Sections complémentaires — ColisApp (15–20 min)

Objectif: compléter la présentation existante avec les éléments exigés par l’école, en s’alignant sur le dossier d’analyse (`analyses/TFE- Dossier d'Analyse - ColisApp NEW.txt`) et le support PDF (`presentation/ColisApp.pdf`). Plan calibré pour 15–20 minutes.

## Plan minute-by-minute (15–20 min)

- 0:00–0:45 — Introduction rapide (rappel du contexte et du périmètre)
- 0:45–3:00 — Justification & Motivation (AA1)
- 3:00–4:30 — Problématique de base (AA1)
- 4:30–8:00 — Démarche du chercheur (AA1)
- 8:00–16:00 — Points importants du travail écrit (AA2/AA6)
- 16:00–17:30 — Conclusion personnelle (AA3)
- 17:30–20:00 — Questions / buffer et transition démo si souhaitée (AA5)

---

## Justification & Motivation (AA1)

- Constat terrain (BE ↔ MA): coûts opaques, process fragmentés, traçabilité faible, paiements majoritairement en espèces (cf. 1.1 Contexte Problématique du dossier d’analyse).
- Besoin utilisateur: estimer le prix avant déplacement; suivre un colis en temps réel; être notifié aux jalons clés.
- Besoin agence: centraliser la gestion (envois, paiements, statuts), réduire les échanges informels et erreurs.
- Proposition de valeur de ColisApp: parcours unifié simulation → création → paiement → suivi; transparence, efficacité, confiance.
- Motivation personnelle: problème réellement vécu par l’étudiant et par des agences contactées; opportunité d’impact concret et d’apprentissage full‑stack moderne.

Notes orateur

- Relier 2–3 anecdotes courtes aux puces (ex.: estimation de prix uniquement par téléphone; absence d’ETA).
- Faire le lien avec le marché cible (petites agences + particuliers) et l’avantage compétitif « simplicité + traçabilité ».

## Problématique de base (AA1)

- Question de recherche: « Comment concevoir une plateforme web sécurisée et évolutive permettant à des particuliers et à des agences d’orchestrer de bout en bout l’envoi de colis BE ↔ MA (simulation → paiement → suivi), avec transparence des coûts et traçabilité temps réel, dans le respect du RGPD et d’un contrôle d’accès multi‑rôles ? »
- Contraintes clés: sécurité (Auth.js, RBAC, validations Zod), conformité (RGPD), UX simple pour profils variés, intégrations (Stripe, Cloudinary), déploiement conteneurisé (Nginx/Docker).

Notes orateur

- Situer le « hors périmètre » pour rester focalisé (app mobile native, analytics avancées — cf. slides existants).

## Démarche du chercheur (AA1)

- Étude de l’existant et SWOT: pratiques actuelles (agences non centralisées), alternatives du marché; identification des gaps (transparence, suivi, paiement en ligne).
- Cadrage: cahier des charges, objectifs stratégiques/fonctionnels, périmètre IN/OUT, hypothèses et contraintes.
- Modélisation: MCD/MPD (Prisma); cas d’utilisation (simulation, paiement, suivi, admin); séquences clés (simulation, suivi).
- Conception API: OpenAPI (`analyses/OpenAPI_ColisApp.yaml`), contrats stables, idempotence sur opérations sensibles.
- Implémentation incrémentale: Next.js 15 (App Router + API), DAL Prisma, Auth.js, Stripe, Cloudinary; UI shadcn + Tailwind.
- Validation continue: schémas Zod côté serveur, guards sur routes API, seed et scénarios de test par service (voir Annexe plan de test).

Notes orateur

- Illustrer à l’écran: diagrammes `analyses/` (UML, architecture), extraits `prisma/schema.prisma`, extrait d’endpoint tracking.

## Points importants du travail écrit (AA2/AA6)

- Cahier des charges et objectifs
  - Stratégiques: transparence des coûts, automatisation du suivi/paiement, solution adaptable multi‑pays.
  - Fonctionnels: simulateur, création d’envoi, paiement en ligne, suivi par numéro de tracking, administration multi‑agences.
- Périmètre et hypothèses
  - IN: parcours MVP complet, emailing de confirmation + lien de suivi.
  - OUT: mobile natif, analytics avancées (perspectives), monitoring avancé.
- Modèle de données et persistance
  - Entités: User, Agency, Envoi/Parcel, Payment, Appointment, Notification.
  - Génération et usage du `trackingNumber`; harmonisation EnvoiStatus ↔ TrackingEventStatus.
- API et flux métier
  - Endpoints v1 pour envois, paiements, tracking; Swagger exposé.
  - Exemple tracking: `src/app/api/v1/tracking/[trackingNumber]/route.ts` (GET events), `src/app/api/v1/envois/[id]/status/route.ts` (sync statut → événement).
- Sécurité et conformité
  - Auth.js, RBAC (CLIENT/AGENCY_ADMIN/SUPER_ADMIN), validations Zod, gestion des secrets via `.env`.
  - Respect du RGPD (données minimales, droits d’accès, mails informatifs).
- Implémentation et intégrations
  - Stripe (paiement test; emails de confirmation avec lien de suivi), Cloudinary (médias/documents), Nginx/Docker (déploiement local).
- Qualité et documentation
  - OpenAPI versionné, dossiers `analyses/` complets, plan de test par service; style TypeScript, lint Next.js.

Notes orateur

- Afficher 1–2 captures de l’UI (simulation → paiement → suivi) et la page Swagger.
- Rappeler les choix technologiques et leur justification (maturité, écosystème, rapidité de dev, typage).

## Conclusion personnelle (AA3)

- Acquis techniques: Next.js 15 (App Router + API), Prisma, Auth.js, Stripe, intégration RGPD, Docker/Nginx.
- Acquis méthodologiques: itérations courtes, conception pilotée par les cas d’usage, documentation continue.
- Difficultés rencontrées: modélisation statuts/événements, cohérence API, gestion des secrets et emails, seed et scénarios.
- Limites actuelles: tests d’intégration/E2E à étoffer, observabilité/monitoring, performance en prod à valider.
- Pistes futures: notifications push, i18n complète, app mobile, metrics/alerting, couverture de tests accrue.

Notes orateur

- Faire le lien avec la grille d’évaluation (AA1–AA6) et la soutenance: structure, timing, réponses aux questions.

---

## Artefacts conseillés à montrer (chemins du repo)

- `analyses/architecture_nextjs.puml` (export image pour le slide)
- `analyses/OpenAPI_ColisApp.yaml` (Swagger UI via `src/app/api/swagger/route.ts` si présent)
- `prisma/schema.prisma` (extrait des entités Envoi/Payment/Tracking)
- `src/app/api/v1/tracking/[trackingNumber]/route.ts` (GET timeline de suivi)
- `src/app/api/v1/envois/[id]/status/route.ts` (mapping EnvoiStatus → TrackingEventStatus)
- `presentation/shots/` (captures UI préparées)

## Recommandations timing et delivery (AA5)

- 3–5 points par slide, mots‑clés concis; privilégier les schémas/captures.
- Garder 2 minutes de marge pour questions; répéter la « problématique » en fil rouge.
- Vérifier la démo: `npm run seed`, carte Stripe test `4242 4242 4242 4242`.
