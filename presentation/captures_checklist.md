# Captures — Checklist et nommage

Format conseillé: 1920×1080 (16:9), PNG. Masquer infos sensibles (emails, IDs, clés).
Créer un dossier `presentation/shots/` et respecter les noms ci‑dessous.

## Fichiers à produire

- 01-accueil-client.png — `src/app/client/page.tsx` (hero + navigation)
- 02-simulation-form.png — `src/app/client/simulation/edit/page.tsx` (formulaire complet)
- 03-recap-envoi.png — `src/app/client/envois/recapitulatif/page.tsx`
- 04-paiement.png — `src/app/client/payment/page.tsx`
- 05-paiement-success.png — `src/app/client/payment/payment-success/page.tsx`
- 06-tracking.png — `/client/tracking/<trackingNumber>` (envoi réel)
- 07-profil-client.png — `src/app/client/profile/page.tsx`
- 08-admin-dashboard.png — `src/app/admin/page.tsx`
- 09-admin-envois.png — `src/app/admin/envois/page.tsx`
- 10-swagger.png — `/api/swagger` (UI Swagger)
- 11-architecture.png — export PNG de `analyses/architecture_nextjs.puml`
- 12-uml-parcel.png — export PNG de `analyses/UML/class_diagram_parcel_domain.puml`
- 13-prisma-schema.png — extrait relationnel de `prisma/schema.prisma`
- 14-env-securite.png — extrait flouté de `docker-compose.yml` (variables)

## Conseils de prise de vue

- Plein écran, zoom 100%, thème clair cohérent.
- Recadrer pour mettre en avant l’élément clé de la slide.
- Pour tracking: utiliser un numéro réel issu d’un envoi seedé.

## Préparation technique

- Installer/démarrer: `npm install && npm run dev` ou `docker compose up --build`.
- Données: `npm run seed`.
- Stripe test: carte `4242 4242 4242 4242`, date future, CVC 3 chiffres.
