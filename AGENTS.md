# AGENTS.md — ohbangit

## Project Overview

React frontend application built with Vite, TypeScript, and Tailwind CSS v4.

- **Runtime**: Node.js 18+
- **Package Manager**: yarn (v1 classic)
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS v4 (via `@tailwindcss/vite` plugin)
- **State/Data (planned)**: Zustand, TanStack Query
- **Linting**: ESLint 9 (flat config) + Prettier

---

## Agent Personas

These personas define how AI agents and contributors should approach work in
this codebase.

### @dev-agent

**Focus**: React components, hooks, state design, and maintainable code.

- Prioritize type safety, reusability, and accessibility.
- Prefer component composition over large monoliths.
- Avoid inline styles; use Tailwind utilities.
- Consider performance impact for re-renders and data fetching.

### @test-agent

**Focus**: User-centric tests with Vitest and React Testing Library.

- Test behavior, not implementation details.
- Cover error and loading states.
- Prefer `screen` queries and `userEvent` where appropriate.

### @security-agent

**Focus**: Frontend security hardening and safe patterns.

- Validate and sanitize user inputs.
- Avoid dangerous HTML injection patterns.
- Keep secrets in `.env.local`, never in source.

### @performance-agent

**Focus**: Rendering and loading performance.

- Use lazy loading and code splitting when suitable.
- Avoid unnecessary re-renders and heavy synchronous work.
- Optimize images and large assets.

---

## Build / Dev / Lint Commands

```bash
yarn dev              # Start dev server (Vite HMR)
yarn build            # Type-check (tsc -b) + production build (vite build)
yarn lint             # ESLint on entire project
yarn format           # Prettier — auto-fix all src files
yarn format:check     # Prettier — check only (CI)
yarn preview          # Preview production build locally
```

### Type Checking Only

```bash
npx tsc -b            # Full type-check without emitting
```

### No Test Runner Yet

Testing is not configured. When adding tests, use Vitest (recommended for Vite projects):

```bash
yarn add -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

Then add to `vite.config.ts`:

```ts
/// <reference types="vitest" />
export default defineConfig({
  test: { environment: 'jsdom', globals: true },
})
```

Run: `yarn vitest` (watch) or `yarn vitest run` (single run).

#### Testing Guide (when tests are introduced)

- Use **Vitest** + **React Testing Library** + **jsdom**.
- Prefer user-centric tests over implementation details.
- New features should include tests for success, error, and loading states.
- Suggested structure: `tests/unit/`, `tests/integration/`, `tests/e2e/`
  (Playwright if added later).

---

## Project Structure

```
src/
├── assets/         # Static assets (images, fonts, icons)
├── components/     # Reusable UI components
├── hooks/          # Custom React hooks
├── pages/          # Page-level components (route targets)
├── styles/         # Global/shared styles
├── types/          # Shared TypeScript type definitions
├── utils/          # Utility/helper functions
├── App.tsx         # Root component
├── main.tsx        # Entry point
└── index.css       # Tailwind CSS entry (@import "tailwindcss")
```

---

## Code Style Guidelines

### Formatting (Prettier — enforced)

- **No semicolons** (`semi: false`)
- **Single quotes** (`singleQuote: true`)
- **Trailing commas** everywhere (`trailingComma: "all"`)
- **80 char line width**
- **4-space indentation**
- **LF line endings**
- **Always parentheses** on arrow function params (`arrowParens: "always"`)

Run `yarn format` before committing. All `.ts`, `.tsx`, `.css` files are formatted.

### TypeScript

- **Strict mode** is ON (`strict: true` in tsconfig)
- `noUnusedLocals: true` — no unused variables
- `noUnusedParameters: true` — no unused function params
- `noFallthroughCasesInSwitch: true` — switch cases must break/return
- **NEVER** use `as any`, `@ts-ignore`, or `@ts-expect-error`
- Prefer `interface` for object shapes, `type` for unions/intersections
- Export types from `src/types/` for shared definitions

### Imports

- Use ES module imports (project uses `"type": "module"`)
- Order: React/external libs → internal modules → types → styles
- Use path aliases if configured (currently none — use relative paths)
- No `.tsx` extension in imports (bundler resolves automatically)

### React Components

- **Function components only** (no class components)
- Use `export default` for page components
- Use **named exports** for reusable components
- File naming: `PascalCase.tsx` for components, `camelCase.ts` for utils/hooks
- One component per file (collocate sub-components only if tightly coupled)
- Prefer `useState`/`useReducer` for local state
- Custom hooks go in `src/hooks/` with `use` prefix

### Styling (Tailwind CSS v4)

- Tailwind v4 uses `@import "tailwindcss"` (NOT the old `@tailwind` directives)
- Configuration is CSS-based via `@theme` blocks (NOT `tailwind.config.js`)
- Use utility classes directly in JSX `className`
- For complex/repeated patterns, extract to components (not CSS classes)
- Avoid inline `style={}` — prefer Tailwind utilities

### Naming Conventions

| Item             | Convention                  | Example              |
| ---------------- | --------------------------- | -------------------- |
| Components       | PascalCase                  | `UserProfile.tsx`    |
| Hooks            | camelCase with `use` prefix | `useAuth.ts`         |
| Utils            | camelCase                   | `formatDate.ts`      |
| Types/Interfaces | PascalCase                  | `interface UserData` |
| Constants        | UPPER_SNAKE_CASE            | `const API_URL`      |
| CSS files        | camelCase or kebab-case     | `index.css`          |
| Folders          | kebab-case                  | `user-profile/`      |

### Error Handling

- Never use empty catch blocks `catch(e) {}`
- Always handle or rethrow errors with meaningful messages
- Use error boundaries for component-level error recovery
- For async operations, handle both loading and error states

---

## Agent Boundaries

### Always

- Define TypeScript types for props and function signatures
- Consider accessibility (WCAG 2.1 AA) in UI changes
- Handle error and loading states in async flows
- 모든 커뮤니케이션은 한국어로 작성한다
- UI/UX 디자인은 토스, 카카오, 당근마켓의 UI/UX 철학을 참고한다
- 기능 추가/수정 시 `docs/SPEC.md` 기획문서에 해당 내용을 동일하게 반영한다 (기능 명세, 컴포넌트 구조, 인터랙션 등)
- 사용자의 요청이 개선 여지가 있으면 더 나은 방향을 간단히 제안한다

### Ask First

- Adding or changing dependencies
- Changing state management strategy or routing structure
- Modifying build configuration or lint rules

### Never

- Use `any`, `@ts-ignore`, or `@ts-expect-error`
- Rely on inline styles for component styling
- Manipulate the DOM directly

### ESLint Rules (Active)

- `react-hooks/rules-of-hooks` — enforced
- `react-hooks/exhaustive-deps` — enforced
- `react-refresh/only-export-components` — warn (allows constant exports)
- All `typescript-eslint/recommended` rules
- Prettier conflicts disabled via `eslint-config-prettier`

---

## Git Conventions

- `.gitignore` covers: `node_modules`, `dist`, `.env*`, editor files, logs
- Commit messages: conventional commits preferred (`feat:`, `fix:`, `chore:`, etc.)
- Do NOT commit `.env` files or secrets

---

## Key Config Files

| File                 | Purpose                                |
| -------------------- | -------------------------------------- |
| `vite.config.ts`     | Vite + React + Tailwind plugins        |
| `tsconfig.json`      | Root TS config (references app + node) |
| `tsconfig.app.json`  | App source TS config (strict, ES2020)  |
| `tsconfig.node.json` | Node-side TS config (Vite config etc.) |
| `eslint.config.js`   | ESLint flat config                     |
| `.prettierrc`        | Prettier formatting rules              |
| `index.html`         | Vite HTML entry point                  |

---

## Environment Variables

- Prefix with `VITE_` for client-side access: `VITE_API_URL`
- Access via `import.meta.env.VITE_API_URL`
- Store in `.env.local` (gitignored)
