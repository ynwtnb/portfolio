# Portfolio (React)

This is a React + Vite conversion of the original static HTML portfolio.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Deploy

The site is served from the `gh-pages` branch at <https://ynwtnb.github.io/portfolio/>. That branch only holds build output, so don't edit or merge into it by hand.

From an up-to-date `main`:

```bash
git checkout main
git pull
npm install
npm run deploy
```

`npm run deploy` builds the site into `dist/` and pushes the contents of `dist/` to `gh-pages`. It uses your working tree, so commit your changes first to keep the live site in sync with `main`. The update can take a few minutes to appear.

If the deploy fails with `fatal: A branch named 'gh-pages' already exists`, clear the cache and rerun it:

```bash
npx gh-pages-clean
npm run deploy
```

## Notes

- Original CSS lives in `public/CSS/` and images in `public/img/`.
- Each route dynamically loads the CSS it originally used (`style.css` for home, `projects.css` for project pages).
- Routes:
  - `/` (home)
  - `/heartview`, `/synchrobot`, `/openrbsync`, `/tleap`, `/virtual-coembodiment`, `/pseudo`, `/bdrum`
