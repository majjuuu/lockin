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


## Roadmap

- Persist data (swap in-memory state for localStorage), then add a web app
  manifest so it installs to a phone home screen (PWA).
- Real authentication (backend + OAuth).
- Live group study (real-time backend).
