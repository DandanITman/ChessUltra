ChessUltra — Blueprint

Vision
Create a fresh, competitive, and collectible twist on chess. Players assemble custom armies within a chess point budget, unlock new piece variants via packs, and battle in real-time multiplayer or vs adaptive bots. The King remains unique and mandatory; starting placement is flexible within the first two ranks (per side) as long as total points do not exceed the budget.

Core Rules & Mechanics
- Army Construction
  - Each account has a library of unlocked pieces (variants). Each variant has a point cost and ruleset (movement, range, special abilities).
  - Before a match, players build an army within a configurable budget (e.g., 39 points baseline to match classic material, adjustable for modes).
  - King is fixed type and must be included; placement anywhere on the player's first two ranks.
  - Other pieces can be placed anywhere on player’s first two ranks, respecting occupancy and mode limits (e.g., max N queens, etc.)
- Pack & Progression System
  - Soft currency (earned) and optional premium currency; open packs to unlock piece variants or cosmetics.
  - Duplicate handling: converts to shards/currency.
  - Rarity tiers: Common, Rare, Epic, Legendary.
- Match Types
  - Casual, Ranked, Private, Vs Bot. Time controls: Blitz/Rapid/Classic.
  - Matchmaking by MMR/elo-like rating per queue.
- Game Flow
  1) Lobby/Matchmaking -> 2) Army Build -> 3) Placement -> 4) Play -> 5) Results/Rewards.
- Fairness & Competitive Integrity
  - Authoritative server validates piece sets, placements, and moves. Deterministic engine on server.
  - Anti-cheat: rate-limits, server-side evaluation, minimal client trust.

Game Design Details
- Movement & Rules Engine
  - Use a rule engine that supports classic chess moves plus extensions for variants.
  - Board: 8x8 grid; FEN-like notation extended to support custom armies and placements.
  - Turn system, check/checkmate/stalemate detection, repetition, 50-move, time controls.
  - Additional piece variants can be expressed as movement graphs or rule descriptors.
- Placement Phase
  - UI to drag-and-drop pieces onto first two ranks; server validates constraints (budget, duplicates, mandatory King, etc.).
  - After both placements locked, engine initializes state and switches to normal play.
- AI/Bot
  - Pluggable AI: start with Stockfish engine integration for classic moves; for variants, implement a minimax/alpha-beta with heuristics that uses the shared rule engine.
  - Difficulty: adjust depth, time per move, and heuristics.

Architecture
- Monorepo (pnpm + Turborepo) with packages:
  - packages/rules: pure TypeScript rules engine (deterministic, no I/O).
  - packages/shared: schema/types (Zod), DTOs, and utilities shared by client/server.
  - apps/server: NestJS server with REST + WebSocket (Gateway) for matchmaking, placement, and gameplay.
  - apps/web: React client using Vite or Next.js; Zustand/Redux for state; Tailwind for styling.
- Communication
  - REST: auth, inventory, packs, profiles, leaderboards.
  - WebSocket: matchmaking events, lobby updates, placement sync, real-time moves, clocks.
- Data & Persistence
  - PostgreSQL via Prisma: users, auth identities, inventory, packs, matches, ratings, leaderboards.
  - Redis: sessions, presence, matchmaking queues, rate limiting.
- Scalability
  - Horizontal scaling with stateless server pods; sticky sessions or session tokens; Redis for shared state.
  - Consider Colyseus/Socket.io rooms or custom lobby management.

Data Model (initial sketch)
- users(id, created_at, updated_at, display_name)
- auth(id, user_id, provider, provider_id, password_hash)
- piece_variants(id, code, name, movement_def JSON, cost, rarity)
- user_inventory(id, user_id, variant_id, qty)
- packs(id, name, price_soft, price_premium, drop_table JSON)
- matches(id, created_at, mode, rated, status)
- match_players(id, match_id, user_id, mmr_before, mmr_after, result)
- match_states(id, match_id, turn, clocks JSON, board_state JSON)
- ratings(user_id, queue, mmr, deviation)

APIs (example v1)
- Auth: POST /v1/auth/register, POST /v1/auth/login, POST /v1/auth/refresh
- Profile: GET /v1/me
- Inventory: GET /v1/inventory, POST /v1/packs/open
- Matchmaking: POST /v1/queue/enqueue, POST /v1/queue/cancel
- Matches: GET /v1/matches/:id
- WS Events: join_queue, match_found, placement_update, placement_locked, move, resign, draw_offer, clock, game_over

Security & Fairness
- Server authoritative validations for army budget, placements, and moves.
- Input schemas via Zod; class-validator or similar on server.
- JWT-based auth; HTTPS/TLS; rate limiting; audit logs for suspicious actions.

Testing Strategy
- Unit: rules engine (packages/rules) with deterministic test vectors for classic and variants.
- Integration: server endpoints with Prisma test DB and WS gateways via supertest/ws.
- E2E: Playwright for critical flows: signup, open pack, build army, place, play vs bot end-to-end.

Milestones & Roadmap
- M0: Planning & Repo scaffold (this)
- M1: Rules Engine MVP (classic chess only) + serializer for placements
- M2: Server MVP: match vs bot using classic rules; placement enforcement
- M3: Web Client MVP: placement UI + basic play vs bot
- M4: Multiplayer: matchmaking + real-time moves
- M5: Packs & Inventory system + basic economy
- M6: Ranked mode, leaderboards, polish

Tools & Languages
- Languages: TypeScript (client, server, shared), SQL (Prisma migrations), optional Rust/Go for future engine perf.
- Dev Tools: pnpm, Turborepo, ESLint, Prettier, Husky, lint-staged, GitHub Actions.
- Observability: pino logs, OpenTelemetry (future), Sentry (client/server).

Risks & Mitigations
- Complex rule variants: define a movement DSL with bounded scope; phase feature rollout.
- Real-time sync: use authoritative server and robust reconciliation.
- Cheating: server-only decisions and log-based detection; optional device attestation in future.

Initial Deliverables (this commit)
- README with vision and structure
- docs/blueprint.md with detailed plan
- .gitignore and LICENSE

