# 오뱅잇 (OhBangIt) - 치지직 스트리밍 스케줄

A React + TypeScript + Vite application for viewing Chzzk streaming schedules.

## Features

- 📅 Daily, weekly, and monthly streaming schedules
- 🔍 Detailed stream information
- 🎨 Light/Dark theme support
- 📱 Responsive design with Tailwind CSS
- 📊 Vercel Web Analytics integration

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 4
- **Routing**: React Router
- **State Management**: TanStack React Query
- **Analytics**: Vercel Web Analytics
- **SEO**: React Helmet Async

## Getting Started

### Prerequisites

- Node.js (LTS version recommended)
- Yarn package manager

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   yarn install
   ```

### Development

Run the development server:

```bash
yarn dev
```

The application will be available at `http://localhost:5173`

### Building

Build for production:

```bash
yarn build
```

Preview the production build:

```bash
yarn preview
```

### Code Quality

Format code:

```bash
yarn format
```

Check formatting:

```bash
yarn format:check
```

Lint code:

```bash
yarn lint
```

## Analytics

This project uses Vercel Web Analytics for tracking visitor data and page views. See [VERCEL_ANALYTICS.md](./VERCEL_ANALYTICS.md) for detailed information about the analytics implementation and how to use it.

## Project Structure

```
src/
├── app/              # Application core (App component, layouts)
├── assets/           # Static assets (images, fonts, etc.)
├── features/         # Feature-based modules
├── hooks/            # Custom React hooks
├── lib/              # Utility functions and libraries
├── index.css         # Global styles
└── main.tsx          # Application entry point
```

## Vite Configuration

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```
