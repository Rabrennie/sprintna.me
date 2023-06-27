# Sprintna.me

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte).

## Setup

1. Create a `.env` (you can use `cp .env.example .env` and fill in the blanks).
2. Setup DB: `npx prisma migrate reset`
3. Get Google OAuth credentials and set the callback URL to `http://localhost:5173/auth/callback/google`
4. Get Spotify developer credentials, set callback to `http://localhost:5173`
5. `npm run dev`

_If you see a connection error, run `npm run prisma:generate` to regenerate_

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
