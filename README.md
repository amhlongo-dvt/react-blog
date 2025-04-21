# React Blog

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)  
![npm version](https://img.shields.io/npm/v/react-blog.svg)

A fast, customizable blog starter built with React, Vite, Tailwind CSS, Markdown support, and Storybook.  
Ideal for developers who want a modern, extensible personal or project blog.

---

## Table of Contents

1. [Features](#features)  
2. [Prerequisites](#prerequisites)  
3. [Installation](#installation)  
4. [Available Scripts](#available-scripts)  
5. [Project Structure](#project-structure)  
6. [Configuration](#configuration)  
7. [Styling & Theming](#styling--theming)  
8. [Storybook](#storybook)  
9. [Linting & Formatting](#linting--formatting)  
10. [Testing](#testing)  
11. [Commit Hooks](#commit-hooks)  
13. [Contributing](#contributing)  
14. [License](#license)

---

## Features

- ⚡️ **Vite** for blazingly fast dev and build  
- 📄 Markdown-based posts with `react-quill` / `quill` support  
- 🎨 Tailwind CSS + `@tailwindcss/forms` + `prettier-plugin-tailwindcss`  
- 🌙 Light / dark theme switch via `next-themes`  
- 🔍 Client‑side routing with `react-router-dom`  
- 🧩 UI components & icons: Radix UI, Heroicons, Lucide  
- 🚀 Data fetching & caching with React Query  
- 🔐 JWT decode + form validation with `react-hook-form` + Zod  
- 🧪 Unit & integration testing via Vitest & Playwright  
- 📖 Component explorer using Storybook  
- 🧹 ESLint + Prettier + lint-staged + Husky for code quality  

---

## Prerequisites

- Node.js >= 18  
- npm >= 9.x or Yarn >= 1.x  

Verify you have them installed:

```bash
node -v
npm -v
# or
yarn -v
```

---

## Installation

Clone the repo:

```bash
git clone https://github.com/your-username/react-blog.git
cd react-blog
```

Install dependencies:

```bash
npm install
# or
yarn install
```

Initialize Husky hooks:

```bash
npm run prepare
```

---

## Available Scripts

From the project root, run:

```bash
npm run dev
```

Starts Vite dev server on [http://localhost:5173](http://localhost:5173).

```bash
npm run build
```

Builds production assets into `dist/`.

```bash
npm run preview
```

Serves the production build locally.

```bash
npm run lint
```

Runs ESLint on `src/` and auto‑fixes issues.

```bash
npm run storybook
```

Launches Storybook on [http://localhost:6006](http://localhost:6006).

```bash
npm run build-storybook
```

Builds the static Storybook site.

---

## Project Structure

```
react-blog/
├── .husky/                  # Git hooks
│   ├── commit-msg
│   └── pre-commit
├── .storybook/              # Storybook configuration
│   ├── main.js
│   └── preview.js
├── backend/                 # Backend logic (API, DB, services)
│   ├── __tests__/           # Backend tests
│   ├── db/                  # Database config or models
│   ├── middleware/          # Express middleware
│   ├── routes/              # API routes
│   ├── services/            # Business logic
│   ├── test/                # Additional backend tests
│   ├── app.js
│   ├── example.js
│   └── index.js
├── public/                  # Static assets
│   ├── pic1.jpg
│   └── vite.svg
├── src/                     # Frontend source
│   ├── api/                 # API utilities
│   ├── assets/              # Images, fonts, etc.
│   ├── components/          # Reusable UI components
│   ├── contexts/            # React context providers
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility functions/libraries
│   ├── pages/               # Page components
│   ├── stories/             # Storybook stories
│   ├── App.css
│   ├── App.jsx
│   └── main.jsx
├── vitest.setup.ts         # Vitest setup
├── vitest.workspace.js     # Vitest config for workspaces
├── components.json          # Custom config (possibly for Storybook or dynamic imports)
├── index.html               # App HTML template
├── jsconfig.json            # JS/TS project config
├── package.json
├── package-lock.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.js           # Vite config
├── .env
├── .commitlintrc.json
├── .eslintrc.json
├── .eslintignore
├── .prettierrc.json
├── .prettierignore
├── .gitignore
├── README.md
├── jest.config.json
├── nodemon.json
```


---

## Configuration

If you need API endpoints, feature flags, etc., create a `.env` file in the root:

```ini
VITE_API_URL=https://api.example.com
```

Vite will expose any `VITE_` prefixed variables to your client code.

---

## Styling & Theming

- Tailwind CSS is configured via `tailwind.config.js`
- Utility‑first styling with optional `class‑variance‑authority`
- Light/dark theme toggle powered by `next-themes`

---

## Storybook

Your component library and UI states live in Storybook:

- Run `npm run storybook` to develop in isolation
- Run `npm run build-storybook` to generate a static site for review
- Chromatic support is preconfigured via `@chromatic-com/storybook`

---

## Linting & Formatting

- ESLint configuration in `.eslintrc.js`
- Prettier configuration in `.prettierrc` + `prettier-plugin-tailwindcss`
- `lint-staged` auto‑formats and lints on git commit

---

## Testing

**Vitest** for unit & snapshot tests:

```bash
npx vitest
```

**Playwright** for end‑to‑end/browser tests:

```bash
npx playwright test
```

---

## Commit Hooks

- Husky installs Git hooks on `npm run prepare`
- Commitlint enforces Conventional Commits
- `lint-staged` runs Prettier & ESLint on staged files

---

## Contributing

- Fork the repository  
- Create a feature branch  
- Commit your changes (`feat`, `fix`, `docs`, etc.)  
- Push to your branch  
- Open a Pull Request  

Please follow our Code of Conduct.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
