# Lock In

A study-focus app prototype — pomodoro timer, streaks, goals, and achievements.
This is the **single-user core**: login is cosmetic, group study is a v2 stub, and
data does not persist yet (it resets on refresh).

Built with React + Vite.

## Run it locally

You need [Node.js](https://nodejs.org) installed (LTS version is fine).

```bash
npm install      # download dependencies (creates node_modules/)
npm run dev      # start the dev server, then open the printed localhost URL
```

`npm run build` produces a production build in `dist/`.

## Project layout

```
lockin/
├── index.html        entry point — mounts the app into <div id="root">
├── package.json      project name, scripts, and dependency list
├── vite.config.js    build tool config
├── .gitignore        files Git should never track (node_modules, dist, ...)
└── src/
    ├── main.jsx      renders <LockInApp /> into the page
    └── App.jsx       the entire app (all screens live here for now)
```

## Push it to GitHub

1. On github.com, create a **new empty repository** named `lockin`
   (do NOT add a README or .gitignore there — this folder already has them).
2. In a terminal, from inside this folder:

```bash
git init
git add .
git commit -m "Initial commit: LockIn prototype"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/lockin.git
git push -u origin main
```

The `.gitignore` keeps `node_modules/` out of the repo — that folder is huge and
gets rebuilt by `npm install`, so it should never be committed.

## Roadmap

- Persist data (swap in-memory state for localStorage), then add a web app
  manifest so it installs to a phone home screen (PWA).
- Real authentication (backend + OAuth).
- Live group study (real-time backend).
