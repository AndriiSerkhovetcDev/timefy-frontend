# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

```
timefy-frontend
├─ .prettierrc
├─ eslint.config.js
├─ index.html
├─ package-lock.json
├─ package.json
├─ postcss.config.mjs
├─ public
│  └─ vite.svg
├─ README.md
├─ src
│  ├─ app
│  │  ├─ providers
│  │  └─ router
│  ├─ App.css
│  ├─ App.tsx
│  ├─ assets
│  │  └─ react.svg
│  ├─ entities
│  │  ├─ booking
│  │  ├─ organization
│  │  ├─ service
│  │  └─ user
│  ├─ features
│  │  ├─ auth
│  │  ├─ booking
│  │  ├─ organizations
│  │  ├─ servises
│  │  ├─ shedule
│  │  └─ staff
│  ├─ index.css
│  ├─ layouts
│  │  ├─ DashboardLayout
│  │  └─ PublicLayout
│  │     ├─ Footer.tsx
│  │     ├─ Header.tsx
│  │     ├─ MobileMenu.tsx
│  │     └─ PublicLayout.tsx
│  ├─ main.tsx
│  ├─ pages
│  │  └─ Home
│  │     ├─ componets
│  │     │  └─ Hero.tsx
│  │     └─ HomePage.tsx
│  └─ shared
│     ├─ api
│     ├─ hooks
│     ├─ lib
│     └─ ui
├─ tsconfig.app.json
├─ tsconfig.json
├─ tsconfig.node.json
└─ vite.config.ts

```

```
timefy-frontend
├─ .prettierrc
├─ eslint.config.js
├─ index.html
├─ package-lock.json
├─ package.json
├─ postcss.config.mjs
├─ public
│  └─ vite.svg
├─ README.md
├─ src
│  ├─ app
│  │  ├─ providers
│  │  └─ router
│  ├─ App.css
│  ├─ App.tsx
│  ├─ assets
│  │  └─ react.svg
│  ├─ entities
│  │  ├─ booking
│  │  ├─ organization
│  │  ├─ service
│  │  └─ user
│  ├─ features
│  │  ├─ auth
│  │  ├─ booking
│  │  ├─ organizations
│  │  ├─ schedule
│  │  ├─ services
│  │  └─ staff
│  ├─ index.css
│  ├─ layouts
│  │  ├─ DashboardLayout
│  │  └─ PublicLayout
│  │     └─ PublicLayout.tsx
│  ├─ main.tsx
│  ├─ pages
│  │  └─ Home
│  │     ├─ models
│  │     └─ ui
│  │        ├─ Hero.tsx
│  │        └─ HomePage.tsx
│  ├─ shared
│  │  ├─ api
│  │  ├─ hooks
│  │  ├─ lib
│  │  └─ ui
│  │     ├─ icons
│  │     │  ├─ BurgerIcon.tsx
│  │     │  └─ XIcon.tsx
│  │     └─ index.ts
│  └─ widgets
│     ├─ Footer.tsx
│     └─ Header
│        ├─ index.ts
│        ├─ model
│        │  ├─ constans.ts
│        │  └─ types.ts
│        └─ ui
│           ├─ Header.tsx
│           ├─ MobileNav.tsx
│           └─ NavItem.tsx
├─ tsconfig.app.json
├─ tsconfig.json
├─ tsconfig.node.json
└─ vite.config.ts

```