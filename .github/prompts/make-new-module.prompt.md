---
mode: edit
description: Create a new module with the specified name and description.
---

# 🧠 Prompt para GitHub Copilot - Proyecto boilerplate-ts (Hexagonal + Vertical Slice)

El proyecto es un boilerplate en TypeScript con NestJS, organizado con arquitectura hexagonal (Ports & Adapters) y enfoque Vertical Slice por feature. Se divide en dos objetivos principales:

## 1. Estructura esperada

- **core/** → Núcleo puro (sin NestJS ni frameworks)
  - `core/{feature}/domain/` → entidades, interfaces (puertos), errores
  - `core/{feature}/application/use-cases/{action}/` → casos de uso, DTOs, tests
  - `core/{feature}/application/services/` → interfaces como `EncryptionService`, `TokenGenerator`

- **app/** → Adaptadores (entrada y salida) + módulos NestJS
  - `app/{feature}/controllers/` → controladores HTTP
  - `app/{feature}/infrastructure/` → implementaciones de puertos
  - `app/{feature}/{feature}.module.ts` → módulo NestJS

## 2. Tareas esperadas por Copilot

1. Crear carpeta: `core/{featureName}/domain/`
2. Crear carpeta: `core/{featureName}/application/`
3. Generar:
   - `*.interactor.ts` con clase `XxxInteractor`
   - `*.dto.ts` con entrada/salida del caso de uso
   - `*.interactor.spec.ts` con pruebas unitarias usando mocks

4. Crear carpeta: `core/{featureName}/application/services/`
   - Interfaces de servicios (`EncryptionService`, `TokenGenerator`)

5. Crear carpeta: `app/{featureName}/controllers/`
   - Controlador NestJS mapeado al interactor

6. Crear carpeta: `app/{featureName}/infrastructure/`
   - Implementaciones de puertos (`PrismaRepo`, `JWT`, `Argon`)

7. Crear archivo: `app/{featureName}/{featureName}.module.ts`
   - Importa controlador, infraestructura, y provee interactores

## 3. Reglas clave

- Controladores solo llaman interactores (nunca lógica de negocio directa)
- Prisma, JWT, Argon están en `infra/`, no en `core/`
- El core (casos de uso y entidades) es 100% libre de frameworks
- Tests unitarios se hacen en el core, usando mocks de interfaces

