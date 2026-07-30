# Umutcan Algan - Personal Portfolio

A React portfolio site that pulls live repository data from the GitHub API.
Built with Vite, styled with Tailwind, deployed to GitHub Pages via GitHub
Actions.

**[Live site](https://ucanalgan.github.io/personalWeb/)** ·
[Email](mailto:umutcanalgan91@gmail.com) ·
[LinkedIn](https://linkedin.com/in/umutcanalgan)

## Tech stack

| | |
|---|---|
| Framework | React 19 |
| Build | Vite 8 (Rolldown) |
| Styling | Tailwind CSS 3.4, PostCSS, cssnano |
| Linting | ESLint 9, lint-staged + husky pre-commit hook |
| Hosting | GitHub Pages, deployed by GitHub Actions |

Repository data comes from the public GitHub REST API at runtime and is cached
in `localStorage` for five minutes, so the projects and stats sections stay
current without a rebuild.

## Requirements

- Node.js ≥ 20.19
- npm ≥ 10

## Getting started

```bash
git clone https://github.com/ucanalgan/personalWeb.git
cd personalWeb
npm install
npm run dev
```

The dev server runs at http://localhost:3000.

## Scripts

| Command | What it does |
|---------|--------------|
| `npm run dev` | Start the dev server (runs `lint` first) |
| `npm run build` | Production build into `dist/` (runs `lint:check` first) |
| `npm run preview` | Serve the production build at http://localhost:4173 |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Run ESLint and apply fixes |
| `npm run lint:check` | Run ESLint, failing on any warning |

Deployment is handled by `.github/workflows/deploy.yml` on every push to
`master` — there is no manual deploy step.

## Project structure

```
src/
├── components/
│   ├── common/      Button, ScrollToTop, ThemeToggle
│   ├── layout/      Header
│   └── sections/    Hero, About, Skills, Projects, GitHub, Contact, Footer
├── contexts/        GitHubContext (API + cache), ThemeContext
├── styles/          see below
├── utils/           analytics, animations, helpers
└── App.jsx
```

### Styles

Loaded in order from `styles.css`; each layer overrides the one before it.

| File | Role |
|------|------|
| `design-system.css` | Base tokens: spacing, shadows, legacy scales |
| `typography.css` | Font loading and base text styles |
| `cobalt.css` | Colour palette — the source of truth for theme tokens |
| `type-scale.css` | Type scale and vertical rhythm |

## Design system

The palette is a single accent hue on blue-biased neutrals. Status colours
(success, warning, error) are kept independent of the accent so state never
reads as branding. Language and technology chips keep their conventional
colours, since those encode data rather than brand.

```css
/* Dark (default) */
--bg-primary:   #0C1119;
--bg-secondary: #141C28;
--brand-primary-500: #4C8DFF;
--text-primary: #E9EFF7;
--border-color: #2B3A4E;

/* Light re-weights the same hue for contrast on a pale ground */
--bg-primary:   #FAFBFD;
--brand-primary-500: #2E6FE0;
--text-primary: #101722;
```

Colours are exposed to Tailwind as bare RGB channels
(`rgb(var(--rgb-primary) / <alpha-value>)`) so opacity modifiers such as
`bg-background/85` work in both themes.

Headings use JetBrains Mono, body copy uses Inter, on a six-step fluid scale.
Both themes are supported: the site follows the system preference and the
header has a toggle to override it.

## Build output

Measured on the current build:

| Asset | Raw | gzip |
|-------|-----|------|
| JavaScript (all chunks) | ~304 kB | ~94 kB |
| CSS | ~63 kB | ~12 kB |

Section components are lazy-loaded behind `React.lazy`, so the initial payload
is a fraction of the total.

## License

MIT — see [LICENSE](LICENSE).
