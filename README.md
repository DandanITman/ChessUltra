<div align="center">

# ♟️ ChessUltra

Build custom armies with a chess point budget, unlock new pieces via packs, and battle in multiplayer or vs bots. The King stays King—place your pieces anywhere on your first two ranks.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?logo=typescript&logoColor=white)
![Node](https://img.shields.io/badge/Node-%E2%89%A5%2020-43853d?logo=node.js&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-workspaces-f69220?logo=pnpm&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Desktop-0db7ed?logo=docker&logoColor=white)

</div>

---

## ✨ What is this?
A competitive and collectible twist on chess:
- 🎯 Build an army within a points budget
- 🧩 Place your pieces anywhere on your first two ranks
- 🃏 Unlock variants via packs with rarities
- 🌐 Real-time multiplayer and 🤖 vs-bot modes
- 🔒 Server-authoritative fairness

> Status: Planning and scaffolding in progress

## 📚 Quick Links
- docs/blueprint.md — full design and architecture plan

## 🚀 Features (planned)
- ⚖️ Budget-based army building with validation
- 🗺️ Flexible placement UI w/ live constraints
- 🔌 WebSockets for real-time play (authoritative server)
- 🧠 Bots with scalable difficulty
- 🎁 Packs, inventory, and progression

## 🧱 Tech Stack
- Monorepo: pnpm + Turborepo + TypeScript
- Client: React + Vite + Tailwind CSS
- Server: Node.js + NestJS (Fastify) + WebSockets
- Database: PostgreSQL via Prisma ORM
- Cache/Queue: Redis (sessions, matchmaking, presence)
- Testing: Vitest/Jest, Playwright (e2e)
- CI: GitHub Actions (soon)

## 🗂️ Repository Layout
```
.
├─ apps/                 # (future) web + server apps
├─ packages/             # (future) shared libs (rules, types)
├─ docs/                 # design docs & RFCs
├─ docker-compose.yml    # Postgres + Redis for dev
├─ turbo.json            # pipeline config
└─ tsconfig.base.json    # TS base config
```

## 🧰 Prerequisites (Windows)
- Node.js 20+ (you have v24.4.1)
- Git (you have 2.50.1)
- pnpm (install: `npm i -g pnpm`)
- Docker Desktop (for Postgres/Redis via compose)

## 🏁 Quick Start
1) Install dependencies
```
pnpm install
```
2) Start databases (Docker Desktop running)
```
docker compose up -d
```
3) Stop databases
```
docker compose down
```
4) Development workflows will be added as apps/packages are created

## 🗺️ Roadmap
- [ ] M1: Rules Engine MVP (classic chess)
- [ ] M2: Server MVP (vs Bot)
- [ ] M3: Web Client MVP (placement + vs Bot)
- [ ] M4: Multiplayer (matchmaking + real-time)
- [ ] M5: Packs & Inventory
- [ ] M6: Ranked mode & polish

## 🤝 Contributing
Early days! Open issues, propose ideas, or PR small improvements. Please keep commits scoped and described.

## 📝 License
MIT — see [LICENSE](./LICENSE)
