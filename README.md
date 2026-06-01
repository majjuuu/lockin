# Lock In

A study-focus app prototype — pomodoro timer, streaks, goals, and achievements.
This is the **single-user core**: login is cosmetic, group study is a v2 stub, and
data does not persist yet (it resets on refresh).

Built with React + Vite.


<img width="358" height="706" alt="Screenshot 2026-06-01 at 21 44 15" src="https://github.com/user-attachments/assets/afbcb219-0274-4fb5-93c5-f0e746a40403" />
<img width="350" height="707" alt="Screenshot 2026-06-01 at 21 44 39" src="https://github.com/user-attachments/assets/75469e41-c772-4690-b682-33f7d99033f5" />
<img width="346" height="699" alt="Screenshot 2026-06-01 at 21 44 59" src="https://github.com/user-attachments/assets/d62a07df-841d-4805-8d76-cc29d055671e" />
<img width="363" height="705" alt="Screenshot 2026-06-01 at 21 45 10" src="https://github.com/user-attachments/assets/892a48f3-f9a3-4915-ae20-3422f146842a" />
<img width="349" height="706" alt="Screenshot 2026-06-01 at 21 45 31" src="https://github.com/user-attachments/assets/cb85c6e8-becd-4811-aa71-539fc5f7e05d" />
<img width="351" height="698" alt="Screenshot 2026-06-01 at 21 45 46" src="https://github.com/user-attachments/assets/d452d715-2cb9-4496-a8b1-994feb68a08a" />


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
