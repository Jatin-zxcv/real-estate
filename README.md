# Sharma Real Estates

Admin-controlled real estate platform for listings and inquiries in Hisar, Haryana.

## Prerequisites

- Node.js 20+
- Corepack enabled
- Docker Desktop (for local Postgres)

## Install

```bash
corepack pnpm install
```

## Environment

Create a local env file and update secrets:

```bash
copy .env.example .env.local
```

Required values:

- `BETTER_AUTH_SECRET` (use a long random secret)
- `ADMIN_BOOTSTRAP_TOKEN`

## Local Database (Docker)

Start PostgreSQL:

```bash
corepack pnpm db:up
```

Check status/logs:

```bash
corepack pnpm db:status
corepack pnpm db:logs
```

Apply migrations and generate Prisma client:

```bash
corepack pnpm prisma:migrate
corepack pnpm prisma:generate
```

Stop database:

```bash
corepack pnpm db:down
```

## Run App

```bash
corepack pnpm dev
```

App URL: `http://localhost:3000`

## Production Build

```bash
corepack pnpm build
corepack pnpm start
```
