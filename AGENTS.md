# Repository Guidelines

## Project Structure & Modules
- `src/app`: Next.js App Router routes (`page.tsx`, `layout.tsx`) and API routes under `src/app/api/*`.
- `src/components`: Reusable React components (PascalCase files). UI uses shadcn + Tailwind.
- `src/services`: Data access layer (`src/services/dal`) and domain logic.
- `src/utils`, `src/types`, `src/data`: Helpers, shared types, and seed/static data.
- `prisma`: Database schema (`schema.prisma`), migrations, and `seed.js`.
- `public`: Static assets (SVG, themes).
- `analyses`: TFE analysis, UML, and documentation artifacts.

## Build, Test, and Development
- `npm run dev`: Start Next.js in dev with Turbopack at `http://localhost:3000`.
- `npm run build`: Generate Prisma client then build the app.
- `npm start`: Run the production build locally.
- `npm run lint`: Lint all TS/TSX/JS files.
- `npm run seed`: Seed DB via `prisma/seed.js` (requires DB envs).
- `npm run reset`: Reset Prisma database (destructive).
- Docker: `docker compose up --build` to run app (and Nginx) using `.env`.

## Coding Style & Naming
- TypeScript throughout; 2‑space indent; prefer named exports.
- Components: PascalCase files in `src/components/*`. Hooks start with `use*`.
- Routes: Lowercase segment folders in `src/app/*` with `page.tsx`/`route.ts`.
- Utilities/types: camelCase for functions/vars; PascalCase for types and enums.
- Linting: `eslint` with Next.js config; fix issues before pushing. Tailwind v4 utilities for styling.

## Testing Guidelines
- No test runner is configured yet. Add tests under `test/` using Jest or Vitest when contributing features.
- Name tests `*.test.ts` or `*.spec.ts`. Prefer integration tests around API routes and DAL.
- Aim for coverage on critical flows: auth, payments, tracking, simulations.

## Commit & Pull Requests
- Use Conventional Commits: `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`.
- Commits: imperative mood, concise subject, include scope when helpful (e.g., `feat(api): add tracking lookup`).
- PRs: clear description, linked issue (if any), screenshots for UI, notes on DB/migrations, and testing steps.
- Include `.env` variable notes when adding new configuration.

## Security & Configuration
- Required envs: `DATABASE_URL`, `AUTH_SECRET/NEXTAUTH_SECRET`, Stripe keys, Cloudinary, mail settings (see `docker-compose.yml`).
- Never commit secrets. Use `.env`/CI secrets. Validate inputs with Zod and server‑side guards in API routes.

