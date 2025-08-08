ChessUltra

A reimagined chess experience: build custom armies with a chess point budget, unlock new pieces via packs, and battle in multiplayer or vs bots.

Status: Initial planning and blueprint

Quick Links
- docs/blueprint.md — full design and architecture plan

High-Level Goals
- Custom army building under a shared chess point cap
- Unlockable piece library via packs and progression
- Real-time multiplayer with authoritative server
- Versus AI bots with scalable difficulty
- Cross-platform web client first (desktop web), future mobile/desktop via wrappers

Tech Stack (proposed)
- Monorepo: pnpm + Turborepo + TypeScript
- Client: React + Vite (or Next.js) + Tailwind CSS
- Server: Node.js + NestJS (or Fastify/Express) + WebSockets
- Database: PostgreSQL via Prisma ORM
- Cache/Queue: Redis (sessions, matchmaking, presence)
- Testing: Vitest/Jest, Playwright (e2e)
- CI: GitHub Actions

Repository Layout (initial)
- docs/ — design docs and RFCs
- (future) apps/web — React client
- (future) apps/server — NestJS/Node server
- (future) packages/rules — shared chess rules/engine
- (future) packages/shared — shared types/utils

Prerequisites (Windows)
- Node.js 20+ (you have v24.4.1)
- Git (you have 2.50.1)
- pnpm (install: npm i -g pnpm)
- Docker Desktop (for Postgres/Redis via docker-compose)
- Optional local installs: PostgreSQL 16+, Redis 7+

Quick Start (after installing pnpm)
- Install deps: pnpm install
- Start DBs: docker compose up -d
- Stop DBs: docker compose down
- Dev workflows will be added as apps/packages are created

License
- MIT (see LICENSE)

