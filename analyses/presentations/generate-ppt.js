/*
 Generates a PowerPoint presentation for the ColisApp project.
 Output: analyses/presentations/ColisApp_Presentation.pptx
 Usage: npm run ppt:generate
*/

const fs = require('fs');
const path = require('path');
const PptxGenJS = require('pptxgenjs');

function slideTitle(pptx, title, subtitle) {
  const slide = pptx.addSlide();
  slide.addText(title, { x: 0.5, y: 0.8, w: 9, h: 1, fontSize: 36, bold: true, color: '203040' });
  if (subtitle) {
    slide.addText(subtitle, { x: 0.5, y: 1.7, w: 9, h: 0.8, fontSize: 18, color: '44546A' });
  }
  return slide;
}

function slideBullets(pptx, title, bullets, options = {}) {
  const slide = pptx.addSlide();
  if (title) {
    slide.addText(title, { x: 0.5, y: 0.6, w: 9, h: 0.6, fontSize: 28, bold: true, color: '203040' });
  }
  const text = bullets.map((b) => ({ text: b, options: { bullet: true, fontSize: 16, color: '2F2F2F' } }));
  slide.addText(text, { x: 0.7, y: options.top || 1.4, w: 8.6 });
  return slide;
}

function slideTwoCols(pptx, title, col1Title, col1Items, col2Title, col2Items) {
  const slide = pptx.addSlide();
  slide.addText(title, { x: 0.5, y: 0.6, w: 9, h: 0.6, fontSize: 28, bold: true, color: '203040' });
  slide.addText(col1Title, { x: 0.6, y: 1.2, w: 4.3, h: 0.4, fontSize: 16, bold: true, color: '203040' });
  slide.addText(
    col1Items.map((t) => ({ text: t, options: { bullet: true, fontSize: 14, color: '2F2F2F' } })),
    { x: 0.6, y: 1.6, w: 4.3 }
  );
  slide.addText(col2Title, { x: 5.1, y: 1.2, w: 4.3, h: 0.4, fontSize: 16, bold: true, color: '203040' });
  slide.addText(
    col2Items.map((t) => ({ text: t, options: { bullet: true, fontSize: 14, color: '2F2F2F' } })),
    { x: 5.1, y: 1.6, w: 4.3 }
  );
  return slide;
}

async function generate() {
  const outDir = path.join(process.cwd(), 'analyses', 'presentations');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const pptx = new PptxGenJS();
  pptx.title = 'ColisApp - Présentation Projet';
  pptx.author = 'Équipe ColisApp';
  pptx.company = 'ColisApp';
  pptx.subject = 'Présentation technique et produit';
  pptx.layout = 'LAYOUT_16x9';

  // Brand palette
  // Primary: #203040, Accent: #3B82F6, Muted: #44546A

  // 1) Cover
  slideTitle(
    pptx,
    'ColisApp — Présentation Complète',
    'Next.js (App Router) • Prisma • PostgreSQL • shadcn + Tailwind v4'
  );

  // 2) Agenda
  slideBullets(pptx, 'Agenda', [
    'Contexte & Vision produit',
    'Architecture & Stack technique',
    'Structure du code & conventions',
    'Fonctionnalités clés (Admin / Client / Simulation)',
    'API & DAL (Prisma)',
    'Sécurité & Configuration',
    'Build, Dev & Docker',
    'Tests & Qualité',
    'Feuille de route'
  ]);

  // 3) Contexte / Vision
  slideBullets(pptx, 'Contexte & Vision', [
    'Plateforme de gestion de colis avec portail client et back‑office admin',
    'App Router Next.js 13+, front réactif avec shadcn/UI + Tailwind v4',
    'Persistance via Prisma/PostgreSQL et séparation claire UI/Services/DAL',
    'Orientation qualité: typage strict TypeScript, DTOs, conventions de commit',
  ]);

  // 4) Architecture haute-niveau
  slideBullets(pptx, 'Architecture (haute‑niveau)', [
    'Frontend: Next.js (App Router), composants réutilisables, hooks',
    'Backend: Route Handlers (API v1) + logique domaine (services)',
    'DAL: Repositories et Prisma ORM pour l’accès DB',
    'Séparation des responsabilités: UI / Services / DAL / DTOs / Utils',
  ]);

  // 5) Structure du projet
  slideBullets(pptx, 'Structure du projet', [
    '`src/app`: routes Next.js (pages + API)',
    '`src/components`: composants réutilisables (shadcn + Tailwind)',
    '`src/services`: DAL, repositories, services front, DTOs',
    '`src/utils`, `src/types`, `src/data`: outils, types partagés, données',
    '`prisma`: schéma, migrations, seed',
    '`public`: assets statiques',
    '`analyses`: documentation/diagrammes/presentations',
  ]);

  // 6) Stack technique
  slideTwoCols(
    pptx,
    'Stack technique',
    'Frontend',
    [
      'Next.js (App Router), React, TypeScript',
      'shadcn/ui + Tailwind CSS v4',
      'Hooks, composants modulaires',
    ],
    'Backend & Infra',
    [
      'API Routes (Route Handlers) v1',
      'Prisma ORM + PostgreSQL',
      'Docker + Nginx (déploiement)',
    ]
  );

  // 7) Fonctionnalités — Admin
  slideBullets(pptx, 'Fonctionnalités — Espace Admin', [
    'Tableau de bord administrateur',
    'Gestion des utilisateurs: liste, création, édition, visualisation',
    'Pages clés: `src/app/admin/page.tsx`, `src/app/admin/users/[id]/edit/page.tsx`, `src/app/admin/users/[userId]/view/page.tsx`',
    'Formulaires: `src/components/forms/admins/UsersForm.tsx`',
  ]);

  // 8) Fonctionnalités — Client
  slideBullets(pptx, 'Fonctionnalités — Espace Client', [
    'Consultation et mise à jour du profil',
    'Page: `src/app/client/profile/page.tsx`',
    'Composant principal: `src/components/client-specific/profile/ProfileComponent.tsx`',
  ]);

  // 9) Fonctionnalités — Simulation
  slideBullets(pptx, 'Fonctionnalités — Simulation', [
    'Assistant multi‑étapes pour scénarios (ex. estimation, flux de colis)',
    'Composant: `src/components/forms/SimulationForms/SimulationFormWizard.tsx`',
    'Gestion d’état, validations, UX guidée',
  ]);

  // 10) API v1
  slideBullets(pptx, 'API v1 (Route Handlers)', [
    'Organisation sous `src/app/api/v1/*`',
    'Exemple: `src/app/api/v1/users/all/routes.ts`',
    'Validation côté serveur (Zod recommandé)',
    'Retour DTOs typés pour cohérence front/back',
  ]);

  // 11) DAL/Repositories/DTOs
  slideTwoCols(
    pptx,
    'DAL, Repositories & DTOs',
    'Accès aux données (Prisma)',
    [
      'DAL sous `src/services/dal`',
      'Repositories: `src/services/repositories/AdminDashboardRepository.ts`',
      'Séparation lecture/écriture selon besoins',
    ],
    'Contrats & Services',
    [
      'DTOs: `src/services/dtos/users/UserDto.ts`',
      'Services front: `src/services/frontend-services/UserService.ts`',
      'Interopérabilité stricte grâce aux types TS',
    ]
  );

  // 12) Sécurité & Config
  slideBullets(pptx, 'Sécurité & Configuration', [
    'Variables d’environnement requises (DB, AUTH, Stripe, Cloudinary, mail)',
    'Secrets: jamais committés; utiliser `.env` / secrets CI',
    'Guards serveur, policies par rôle; validation Zod côté API',
    'Rate limiting et logs structurés (à renforcer)',
  ]);

  // 13) Base de données (Prisma)
  slideBullets(pptx, 'Base de données (Prisma)', [
    'Schéma, migrations et seed sous `prisma/`',
    'URL: `DATABASE_URL` (PostgreSQL), ex. `.env` actif',
    'Workflow: modifier schéma → `prisma migrate` → générer client',
    'Adapter DAL/Repos après migrations',
  ]);

  // 14) Développement & Build
  slideBullets(pptx, 'Développement & Build', [
    '`npm run dev` (Turbopack) → http://localhost:3000',
    '`npm run build` (Prisma generate + Next build)',
    '`npm start` (prod local)',
    '`npm run lint` (eslint Next.js)',
    '`npm run seed` / `npm run reset` (DB)',
    'Docker: `docker compose up --build`',
  ]);

  // 15) Qualité & Conventions
  slideBullets(pptx, 'Qualité & Conventions', [
    'TypeScript, indentation 2 espaces, exports nommés',
    'Nommage: PascalCase (composants/types), camelCase (fonctions/vars), hooks `use*`',
    'Commits: Conventional Commits (feat, fix, docs, chore, refactor, test)',
    'Linting stricte avant push',
  ]);

  // 16) Tests
  slideBullets(pptx, 'Tests', [
    'Runner non configuré par défaut',
    'Ajouter sous `test/` avec Jest ou Vitest',
    'Cibler en priorité: API routes et DAL',
    'Couverture des flux critiques: auth, paiements, tracking, simulations',
  ]);

  // 17) Déploiement & Opérations
  slideBullets(pptx, 'Déploiement & Opérations', [
    'CI/CD: lint + build + migrations Prisma; seed staging si besoin',
    'Infra: Docker (Nginx en frontal), PostgreSQL managé',
    'Observabilité: logs, métriques, tracing (à outiller)',
  ]);

  // 18) Feuille de route (proposée)
  slideBullets(pptx, 'Feuille de route (proposée)', [
    'Auth & rôles robustes avec guards SSR/API',
    'Tests d’intégration (Vitest + Prisma test env)',
    'Gestion d’erreurs centralisée et logging',
    'Durcissement sécurité (rate limiting, Zod exhaustif)',
    'Documentation API (OpenAPI/Swagger)',
  ]);

  // 19) Annexes / Références
  slideBullets(pptx, 'Annexes & Références', [
    'Dossiers clés: `src/app`, `src/components`, `src/services`, `prisma`, `analyses`',
    'Exemples de fichiers: routes API, UsersForm, ProfileComponent, Repositories, DTOs',
    'Contact équipe & guides internes (si disponibles)',
  ]);

  const outFile = path.join(outDir, 'ColisApp_Presentation.pptx');
  await pptx.writeFile({ fileName: outFile });
  console.log(`Présentation générée: ${outFile}`);
}

generate().catch((err) => {
  console.error('Erreur génération PPTX:', err);
  process.exit(1);
});

