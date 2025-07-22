# Copilot Instructions for boilerplate-ts

## Architecture Overview
- **Hexagonal (Ports & Adapters) + Vertical Slice by Feature**
- Two main layers:
  - `core/`: Pure business logic, no frameworks. Contains domain entities, interfaces (ports), use cases (interactors), DTOs, and unit tests.
  - `app/`: NestJS modules, controllers, and infrastructure (adapters for ports, e.g., Prisma, JWT, Argon).
- Each feature is isolated: e.g., `core/user`, `app/user`.

## Key Conventions
- **Controllers** only call interactors (never business logic directly).
- **Infrastructure** (Prisma, JWT, Argon) lives in `infra/`, never in `core/`.
- **Core** is 100% framework-free and only depends on TypeScript.
- **Unit tests** are written in `core/`, using Jest and mocks for interfaces.
- **Interactors** are the main entry point for business logic. Always create a `*.interactor.ts` and a corresponding `*.interactor.spec.ts`.
- **Service interfaces** (e.g., `EncryptionService`, `TokenGenerator`) go in `core/{feature}/application/services/`.

## Developer Workflows
- **Setup:** Run `setup.sh` to install dependencies and Husky hooks. Requires a `.env` file.
- **Build:** `yarn build` (uses NestJS CLI)
- **Start:**
  - Dev: `yarn start:dev`
  - Prod: `yarn start:prod`
- **Test:**
  - Unit: `yarn test`
  - E2E: `yarn test:e2e`
  - Coverage: `yarn test:cov`
- **Lint/Format:** `yarn lint`, `yarn format`, `yarn format:all`

## Patterns & Examples
- **Feature Structure Example:**
  - `core/user/domain/` — entities, interfaces, errors
  - `core/user/application/interactors/` — use cases (e.g., `login.interactor.ts`)
  - `core/user/application/services/` — service interfaces
  - `app/user/controllers/` — NestJS controllers
  - `app/user/infrastructure/` — adapters (e.g., `prisma-user.repository.ts`)
  - `app/user/user.module.ts` — NestJS module
- **Testing Interactors:**
  - Use `jest.fn()` and `jest.spyOn()` to mock repository/service methods
  - Example:
    ```typescript
    let repo: jest.Mocked<UserRepository>;
    beforeEach(() => {
      repo = { findById: jest.fn(), save: jest.fn() } as any;
    });
    it('should call save', async () => {
      const spy = jest.spyOn(repo, 'save').mockResolvedValue(user);
      await interactor.execute(...);
      expect(spy).toHaveBeenCalled();
    });
    ```

## Integration Points
- **Prisma**: DB access via repositories in `app/{feature}/infra/`
- **JWT/Argon**: Auth logic in `infra/`, injected via NestJS providers
- **Config**: Use `ConfigService` from NestJS, config files in `app/config/config/`

## Project-Specific Rules
- Never import infrastructure or NestJS code into `core/`
- Always keep business logic in interactors, not controllers or infrastructure
- New features should follow the vertical slice structure: create all needed folders/files for both `core` and `app`

---
For unclear conventions or missing patterns, ask for clarification or review `.github/prompts/make-new-module.prompt.md` for more details.
