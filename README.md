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

Get Started (later)
- Install pnpm: npm i -g pnpm
- Install deps: pnpm install
- Start dev: TBD as code is added

License
- MIT (see LICENSE)

