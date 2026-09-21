# Business Ideas Chat (demo)

Frontend-only Next.js demo for the group project wireframes. No backend — sign in with **any** email and password; data stays in your browser.

## Isolated environment

This app is meant to run **only from this folder**, with its own dependencies and env file:

```bash

npm install
cp .env.example .env.local   # already created for local dev
npm run build
npm run start
```

Open [http://localhost:3000](http://localhost:3000).

- **Dependencies**: local `node_modules` (not shared with other projects).
- **Config**: `.env.local` — `NEXT_PUBLIC_STORAGE_KEY` keeps localStorage separate from other demos.
- **Do not** reuse this `.env.local` in other apps.

## Features

- Sign-in, home (idea cards), new chat form, chat with mock bot replies
- Menu: Account, Archive, Privacy policy, Settings
- Responsive layout: mobile drawer menu, desktop sidebar; chat idea list on large screens

## Scripts

| Command        | Description              |
|----------------|--------------------------|
| `npm run dev`  | Development server       |
| `npm run build`| Production build         |
| `npm run start`| Serve production build   |
