# AGENTS.md

## 1. Project Overview

Personal portfolio with public pages at `/` and `/my-story`, plus everyday tools accessible from `/admin`: money management, rental-room listings, a stocks calculator, and profile settings.

The application uses Next.js App Router, React Server Components by default, strict TypeScript, Tailwind CSS, Zod, and Prisma with MongoDB. Authentication uses usernames and bcrypt password hashes, with JWTs signed and verified through `jose`. Admin routes require authentication; `/admin/login` is the public sign-in exception.

## 2. Repository Structure

| Path                                     | Purpose                                                                            |
| ---------------------------------------- | ---------------------------------------------------------------------------------- |
| `src/app/`                               | App Router pages, layouts, global styles, and route-local components and actions.  |
| `src/app/admin/`                         | Admin home, login, profile, `money/`, `rent-rooms/`, and `stocks-calculator/`.     |
| `src/components/`, `src/app/components/` | Shared UI and public portfolio components.                                         |
| `src/services/`                          | Authentication, sessions, shared Prisma client, and application services.          |
| `src/features/money/`                    | Money calculations, date handling, filters, validation, and action-result helpers. |
| `src/repositories/`                      | Rental-room database access.                                                       |
| `src/proxy.ts`                           | Request-level protection for `/admin/:path*`.                                      |
| `src/constants/cookies.constants.ts`     | Session and redirect cookie names and session options.                             |
| `prisma/`, `prisma.config.ts`            | MongoDB schema, seed, and Prisma environment/configuration helpers.                |
| `scripts/`, `scripts/lib/`               | Standalone TypeScript scripts, runner, and supporting utilities.                   |
| `tests/`                                 | Existing Node.js suites: `money.test.ts` and `scripts.test.ts`.                    |
| `public/`, `src/assets/`                 | Static assets and portfolio content.                                               |

Source code lives under `src/`. There is no root `app/` or shared `src/lib/` directory, and there are currently no API route handlers.

## 3. Build & Development Commands

Run commands from the repository root. Use the pnpm version declared in `package.json#packageManager` and maintain `pnpm-lock.yaml`.

| Command                  | Purpose                                                     |
| ------------------------ | ----------------------------------------------------------- |
| `pnpm install`           | Install dependencies; `postinstall` runs `prisma generate`. |
| `pnpm dev`               | Start the Next.js development server.                       |
| `pnpm exec tsc --noEmit` | Check TypeScript without emitting files.                    |
| `pnpm lint`              | Run ESLint.                                                 |
| `pnpm build`             | Create the production build.                                |
| `pnpm start`             | Serve an existing production build.                         |
| `pnpm format`            | Run `prettier . --write`; this modifies files.              |
| `pnpm prisma generate`   | Regenerate the Prisma client.                               |
| `pnpm prisma db push`    | Synchronize the MongoDB schema with the selected database.  |
| `pnpm db:seed`           | Create default money records.                               |
| `pnpm script`            | Run the root `scripts/` file selected by `SCRIPT_NAME`.     |

After dependencies are installed, `npx prisma generate` and `npx prisma db push` are equivalent invocations of the installed Prisma CLI.

Provide `DATABASE_URL` before installation because Prisma generation loads `prisma.config.ts`. The Prisma/seed loader explicitly reads `.env.production.local` and `.env.development.local`; development takes precedence only when `NODE_ENV=development`, otherwise production is first. Existing environment variables take precedence. Do not assume `.env.local` alone configures this loader. Confirm the intended development database before schema writes or seeding.

Use `db push` for this MongoDB project, not SQL migration commands. MongoDB must support transactions. The seed creates Unclassified, Cash, and the primary money account; it does not create an admin user.

## 4. Code Style & Conventions

- Keep pages and layouts as Server Components unless browser APIs, state, effects, or event handlers require a `"use client"` boundary.
- Keep Server Actions in route-local `actions.ts` files marked `"use server"`. Reuse application services and the shared client from `@/services/prisma-service`; preserve existing `server-only` boundaries.
- **Validate the parameters of every action created or modified with Zod on the server.** Cover IDs, bound arguments, form fields, and structured inputs. Use parsed values before passing input to business/database logic. TypeScript annotations, casts, and client validation do not replace runtime validation.
- If adding API endpoints, use App Router `route.ts` handlers under `src/app/api/`; validate request input and authenticate protected operations explicitly.
- Preserve strict TypeScript. Do not introduce `any`; use `unknown` with narrowing. Reuse generated Prisma types/enums from `@prisma/client` and inferred Zod types. Use the `@/*` alias for `src/*`.
- Await asynchronous route `params` and `searchParams` where used, following existing pages.
- Prefer Tailwind utilities and existing components. Tailwind configuration uses `@tailwindcss/postcss` and the import/`@theme` declarations in `src/app/globals.css`; existing SCSS modules remain in use.
- Follow `.prettierrc` and `eslint.config.mts`: two-space indentation, double quotes, semicolons, and an 80-character print width.
- Reuse money helpers for integer cents, amount limits, and Singapore date/time handling. Preserve category/archive rules and protected default records.
- For money mutations, authenticate before `runMoneyAction`, preserve its typed result contract, and revalidate affected routes after successful writes.

## 5. Testing Strategy

Tests live in the root `tests/` directory and use `node:test` with `node:assert/strict`, executed through `tsx`.

| Command             | Existing coverage                                                              |
| ------------------- | ------------------------------------------------------------------------------ |
| `pnpm test:money`   | Money precision/limits, dates, filters, category policies, and budgets.        |
| `pnpm test:scripts` | Environment loading, script selection, argument forwarding, and exit behavior. |

Both suites run without a database. There is no generic `pnpm test` script; use the named scripts.

**Never generate new test cases unless the user explicitly requests them.** Run relevant existing suites when their behavior is affected. Do not remove, disable, or weaken existing tests to hide failures.

## 6. Automation & Verification Workflow

After any modifications to the codebase, run these commands in this exact order:

1. `pnpm lint` — fix reported lint issues and rerun successfully before continuing.
2. `pnpm build` — resolve build/compilation errors and rerun successfully before continuing.
3. `pnpm format` — complete formatting and inspect the resulting diff.

If resolving a later failure requires further code changes, repeat the sequence from lint. Review repository-wide formatter changes and keep the final diff relevant to the task.

Do not skip a step or claim success without running it. If an environment, dependency, or access problem blocks verification, report the blocked command and reason; do not bypass checks or alter credentials to force a pass.

## 7. Security & Guardrails

- Never commit, expose, or log credentials, JWTs, password hashes, or real environment values. Protect `.env`, `.env.local`, and environment-specific files; use placeholders in `.env.example`. Do not overwrite existing environment configuration without a task requirement. The current `.gitignore` ignores `.env*.local`, not plain `.env`.
- Preserve `src/proxy.ts` protection and the exact `/admin/login` exception. The proxy verifies JWTs; it does not check the database session version.
- Use `authService.requireAuthenticatedUser()` for protected actions and server-side data entry points. It checks the current user and `sessionVersion`. Route protection and hidden UI alone are insufficient.
- Preserve bcrypt hashing and verification; never store plaintext passwords. Profile updates must check the current password, increment the session version, and issue a replacement session.
- Preserve JWT algorithm, issuer, audience, expiration, and payload verification in `session-service.ts`. `AUTH_SECRET` must contain at least 32 characters; tokens currently expire after seven days. Never replace verification with decoding alone.
- Preserve session-cookie `httpOnly`, `sameSite: "strict"`, production-only `secure`, and matching lifetime. Keep login redirects restricted to local admin destinations.
- Derive saved-filter ownership from the authenticated user and retain `adminUserId` scoping. Never trust a client-supplied user ID for authorization.
- Keep database access and secrets out of Client Components. Preserve `force-dynamic` rendering in the admin layout, and the security headers and private/no-store admin responses in `next.config.ts`.
- Do not perform destructive database operations or production schema/data changes without explicit user authorization.

## 8. Maintenance Agreement

Review this root `AGENTS.md` while working. Update it whenever project structure, scripts, authentication, database setup, or conventions become stale. Verify changes against the implementation and configuration; do not document planned behavior as existing behavior. Preserve the mandatory verification order and the prohibition on new tests unless the user changes those requirements.
