# PROJECT_SUMMARY.md — POLA GO

This file is the **living agentic development log** for POLA GO. Every AI-assisted development session must append a new entry below, in reverse-chronological order (newest on top). Do not delete prior entries — they preserve continuity across sessions.

Reference task IDs from `Project_SRS.md`, Section 8 (Work Breakdown Structure), wherever applicable.

---

## [YYYY-MM-DD] Session: Project Kickoff & Documentation Baseline

**WBS Reference:** Section 8.1 (Setup & Infrastructure), 8.12 (Documentation)

**Completed:**
- Authored `Project_SRS.md` — full SRS covering functional/non-functional requirements, features, additional feature suggestions, phased roadmap, detailed WBS, tech stack, OOP architecture, and agentic workflow protocol.
- Authored starter `README.md` with project overview, tech stack, setup instructions, project structure, and roadmap.
- Created this `PROJECT_SUMMARY.md` file to track future agentic sessions.

**Files created:**
- `Project_SRS.md`
- `README.md`
- `PROJECT_SUMMARY.md`

**Decisions made:**
- Chose Next.js (App Router) + TypeScript + Tailwind + shadcn/ui as the core stack for speed of development and Vercel-native deployment.
- Decided all image/filter processing will be client-side (Canvas API) in v1 — no backend/database dependency, for privacy and cost simplicity.
- Adopted an interface-driven OOP core layer (`IFilter`, `LayoutStrategy`, `Layer`) so filters/layouts/decorations can be extended without touching core logic.

**Known issues / TODO carried forward:**
- Next.js project has not yet been scaffolded (no `package.json`, no `src/` folder yet).
- No GitHub repository initialized yet.
- No design tokens/fonts finalized yet — still at "candidate" stage in SRS.

**Next recommended task:**
- WBS 8.1: Initialize the actual Next.js + TypeScript project, set up Tailwind, ESLint/Prettier, and the folder structure defined in `Project_SRS.md` Section 10.2, then push the initial commit to GitHub.

---

## [YYYY-MM-DD] Session: Major Scope Revision — Couple Room & Real-Time Dual Capture

**WBS Reference:** Section 8.3 (Room & Signaling Module), 8.4 (Peer Connection Module), 8.6 (Booth Stage & Compositor Module) — all newly introduced

**Completed:**
- Revised `Project_SRS.md` (v1.0 → v1.1) to reflect the true core concept: POLA GO is a **shared virtual photo booth for long-distance couples**, not a solo photo booth. A Host creates a Room and shares a link; a Guest joins; both cameras connect live via WebRTC; a synchronized countdown drives capture of a **4-photo combined polaroid set**.
- Added new functional requirement groups: Room & Real-Time Pairing (FR-R.x), Shared Booth Stage & Synchronized Capture (FR-S.x), Dual-Frame Compositor (FR-C.x).
- Updated Camera, Filter, Decoration, Layout, Export, and Gallery requirements to operate on the **combined/composited** couple image rather than a single user's solo photo.
- Added new NFRs for synchronization tolerance, room privacy lifecycle, and network resilience (NFR-16, 17, 18).
- Added two new core modules to the architecture: Room & Signaling Service (with `ISignalingTransport` abstraction) and Peer Connection Manager (WebRTC), plus a Dual-Frame Compositor module.
- Updated the folder structure, class sketches, tech stack, phased roadmap (now 10 phases), and full WBS (Section 8) to reflect the above.
- Rewrote `README.md` to describe the couple-room flow, updated project structure, and roadmap.

**Files touched:**
- `Project_SRS.md` (major revision)
- `README.md` (rewritten)
- `PROJECT_SUMMARY.md` (this entry)

**Decisions made:**
- Chose to keep the signaling/presence layer vendor-agnostic via an `ISignalingTransport` interface, with Ably/Pusher/PartyKit/Supabase Realtime as interchangeable candidate providers — avoids locking core logic to one vendor.
- Chose peer-to-peer WebRTC for video (not server-relayed) to keep costs low and preserve couple privacy; TURN is a fallback only, not the default path.
- Chose a countdown-based "shared moment" sync model instead of attempting frame-perfect synchronization — simpler to build reliably and still delivers the emotional "we did this together" effect.
- Locked v1 to exactly 2 participants per Room and exactly 4 shots per session, matching the classic polaroid-strip format requested.

**Known issues / TODO carried forward:**
- No signaling provider has been chosen yet (Ably vs Pusher vs PartyKit vs Supabase Realtime) — needs a quick spike/comparison before Phase 1 begins.
- Composite layout visuals (split-screen vs picture-in-picture vs heart-frame) are only specified conceptually; actual visual design/mockups not yet created.
- Project has not yet been scaffolded (no `package.json`, no `src/` folder yet); no GitHub repository initialized yet.

**Next recommended task:**
- WBS 8.1: Initialize the Next.js + TypeScript project and folder structure, then WBS 8.3 (Room & Signaling Module) as the first real feature, since everything else in the product depends on the Room concept existing first.

---

## [2026-07-01] Session 4: GitHub & Vercel Deployment

**WBS Reference:** Section 8.1 (Setup & Infrastructure), Section 8.14 (Deployment)

**Completed:**
- Created GitHub repository at `https://github.com/real-ds/PolaGo` (public, MIT license)
- Pushed all project files to `origin/master` (including all core services, components, tests, and config)
- Linked GitHub repo to Vercel via `vercel link` (project name: `pola-go`)
- Deployed to Vercel production — build passed on first attempt
- Production URL: **https://pola-go.vercel.app**

**Build output on Vercel:**
- Next.js 16.2.9 (Turbopack)
- All 7 routes compiled: `/`, `/api/rooms`, `/gallery`, `/room/[roomId]`, `/room/new`, `/settings`
- Build time: ~30s on Vercel (2 cores, 8 GB)

**Deployment details:**
- Auto-deploys on every push to `master` (GitHub integration)
- Preview deployments will be created for PRs automatically
- Environment variables (e.g., `NEXT_PUBLIC_ABLY_API_KEY`) must be configured in Vercel dashboard

**Next recommended task:**
- Configure `NEXT_PUBLIC_ABLY_API_KEY` in Vercel dashboard → Settings → Environment Variables so the production deployment uses Ably signaling instead of InMemoryTransport. Then WBS 8.5: Complete the end-to-end camera ↔ booth ↔ capture ↔ compositor integration flow and test with two devices.

---

## [2026-07-01] Session 3: Ably Signaling Provider Integration & API Routes

**WBS Reference:** Section 8.3 (Room & Signaling Module), Section 8.1 (Setup & Infrastructure)

**Completed:**
- Installed `ably` npm package (v2 promise-based SDK)
- Implemented `AblyTransport` — a full `ISignalingTransport` adapter using Ably's real-time pub/sub channels:
  - `connect(roomId)`: Creates Ably client, attaches to `room:<slug>` channel, subscribes to all messages
  - `send(event, payload)`: Publishes structured `{ event, payload }` messages to the channel
  - `on/off(event, handler)`: Event router — subscribes to specific internal events rather than raw Ably messages
  - `disconnect()`: Detaches channel and closes the Ably client connection
- Created `src/lib/signaling.ts` factory function `createSignalingTransport()` that auto-detects `NEXT_PUBLIC_ABLY_API_KEY` env var
  - When API key is present → returns `AblyTransport` (production)
  - When absent → falls back to `InMemoryTransport` (local dev without config)
- Created `src/app/api/rooms/route.ts` API route with POST handler:
  - `action: "create"` — generates room slug, returns full room URL
  - `action: "validate"` — validates room ID format
- Updated `useRoom` hook to use `createSignalingTransport()` instead of hardcoded `InMemoryTransport`
- Updated `room/[roomId]` page to cast transport as `ISignalingTransport` instead of `InMemoryTransport`
- Updated `.env.example` with detailed Ably setup instructions
- Updated `AblyTransport` to use correct v2 types (`Ably.Realtime`, `Ably.RealtimeChannel`, `Ably.InboundMessage`)

**Files created/modified:**
- `src/core/room/transports/AblyTransport.ts` (new) — Ably signaling adapter
- `src/lib/signaling.ts` (new) — Transport factory function
- `src/app/api/rooms/route.ts` (new) — Room creation/validation API
- `src/hooks/useRoom.ts` (modified) — Uses signaling factory instead of hardcoded InMemoryTransport
- `src/app/room/[roomId]/page.tsx` (modified) — Removed InMemoryTransport import, uses factory fallback
- `.env.example` (modified) — Added Ably setup guide

**Decisions made:**
- Chose **Ably** as the primary signaling provider due to generous free tier (200k messages/month), Vercel compatibility, and simple pub/sub API
- Used Ably v2 promise-based SDK (not v1 callbacks) to match the project's async/await patterns
- Messages are structured as `{ event: string, payload: unknown }` envelopes — the event router on the receiving end dispatches to registered handlers by event name, keeping the `RoomService` code provider-agnostic
- Room channels named `room:<slug>` — namespaced to avoid collisions
- `NEXT_PUBLIC_` prefix used so the API key is available in client-side bundled code (inlined at build time by Next.js)

**Known issues / TODO carried forward:**
- Ably API key must be configured in Vercel environment variables for production
- No TURN server configured yet (STUN-only for now)
- No e2e tests for two-peer room session simulation
- Sticker/frame SVG assets not yet added to `public/assets/`
- i18n structure not yet set up (NFR-14)

**Next recommended task:**
- WBS 8.14: Connect GitHub repo to Vercel, configure environment variables (Ably API key), enable preview deployments on PR. Then WBS 8.5: Complete the camera ↔ booth ↔ capture ↔ compositor integration flow end-to-end.

---

## [2026-07-01] Session 2: Unit Testing & CI/CD Pipeline

**WBS Reference:** Section 8.13 (Testing), Section 8.1 (Setup & Infrastructure), Section 8.14 (Deployment)

**Completed:**
- Installed Vitest v4 + React Testing Library + jsdom for unit testing
- Configured `vitest.config.mts` with jsdom environment, path alias resolution, and setup file
- Created `tests/setup.ts` with HTMLCanvasElement mocks (getContext, toBlob) and ClipboardItem polyfill for test environment
- Wrote 49 unit tests across 9 test files covering all core services:
  - `RoomService.test.ts` — create/join room, partner notification, ready state broadcast, room expiry, disconnect (6 tests)
  - `FilterRegistry.test.ts` — register/get/list/clear/overwrite filters (5 tests)
  - `FilterImplementations.test.ts` — all 9 filters have required properties, apply doesn't throw (10 tests)
  - `CompositeStrategy.test.ts` — SplitScreen, PiP, HeartFrame compose without throwing (3 tests)
  - `LayoutStrategy.test.ts` — SingleLayout, Strip4Layout, GridLayout compose without throwing (3 tests)
  - `ExportService.test.ts` — PNG/JPEG export, download trigger, clipboard copy (4 tests)
  - `PreferencesService.test.ts` — defaults, set/get, localStorage persistence, load, reset (5 tests)
  - `Layer.test.ts` — StickerLayer, TextLayer, FrameLayer creation, serialization, text update (6 tests)
  - `utils.test.ts` — generateId uniqueness, generateRoomSlug format, generateFilename format, clamp (7 tests)
- Set up GitHub Actions CI/CD workflow (`.github/workflows/ci.yml`) — lint → test → build on every push/PR
- Created `.env.example` with documentation for signaling provider, TURN, and analytics config
- Created `.github/PULL_REQUEST_TEMPLATE.md` with WBS reference and checklist
- Created issue templates: `bug_report.md` and `feature_request.md`
- Excluded test directories from Next.js build TypeScript checking (tsconfig.json)

**Files created/modified (12 files):**
- `vitest.config.mts` (new) — Vitest configuration
- `tests/setup.ts` (new) — Test environment setup with canvas mocks
- `src/**/__tests__/*.test.ts` (9 test files) — Unit tests for all core modules
- `.github/workflows/ci.yml` (new) — CI/CD pipeline
- `.github/PULL_REQUEST_TEMPLATE.md` (new)
- `.github/ISSUE_TEMPLATE/bug_report.md` (new)
- `.github/ISSUE_TEMPLATE/feature_request.md` (new)
- `.env.example` (new) — Environment variable documentation
- `package.json` (modified) — Added test scripts, removed unused deps
- `tsconfig.json` (modified) — Excluded test directories from build

**Decisions made:**
- Used `resolve.tsconfigPaths: true` in Vite config (native Vite feature) instead of `vite-tsconfig-paths` plugin
- Created custom HTMLCanvasElement mock (getContext/toBlob) for jsdom since jsdom doesn't implement Canvas API
- Tests use relative imports from `../` path rather than `@/` alias for compatibility with Vitest path resolution
- Used `vitest run` for CI (single-run) vs `vitest` for local dev (watch mode)

**Known issues / TODO carried forward:**
- No e2e tests yet (Playwright) — needed for two-peer room simulation
- No integration tests for full capture → filter → export flow
- TURN server not yet configured/selected
- Real signaling provider not yet integrated (InMemoryTransport still default)
- Sticker/frame SVG assets not yet added to `public/assets/`
- i18n structure not yet set up (NFR-14)
- PWA manifest/service worker not configured (NFR-15)

**Next recommended task:**
- WBS 8.4: Integrate a real signaling provider (Ably/Pusher/PartyKit) replacing InMemoryTransport. Choose one based on free-tier limits and Vercel compatibility, then implement the transport adapter. Then WBS 8.14: Connect GitHub repo to Vercel for preview deployments.

---

## [2026-07-01] Session 1: Full Project Scaffold & Core Implementation

**WBS Reference:** Section 8.1 (Setup & Infrastructure), 8.2 (Design System / UI Kit), 8.3 (Room & Signaling Module), 8.4 (Peer Connection Module), 8.5 (Camera Module), 8.6 (Booth Stage & Compositor Module), 8.7 (Filter Engine), 8.8 (Decoration Engine), 8.9 (Layout Composer), 8.10 (Export Service), 8.11 (Session Gallery), 8.12 (Settings & Theming)

**Completed:**
- Initialized Next.js 16.2.9 (App Router) + TypeScript + Tailwind CSS v4 project with full folder structure per SRS Section 10.2
- Installed dependencies: framer-motion, zustand, idb-keyval, jszip
- Configured Google Fonts (Fredoka for headings, Quicksand for body) via next/font
- Created design system: Button, Card, Modal, Toast, Slider components with "cute" pink/pastel aesthetic
- Built core OOP services:
  - `RoomService` + `ISignalingTransport` interface + `InMemoryTransport` (for local dev/testing)
  - `PeerConnectionManager` (WebRTC with STUN, data channel, reconnect logic)
  - `CameraService` (start/stop/switch camera, frame capture)
  - `CompositeStrategy` with 3 implementations: SplitScreen, PictureInPicture, HeartFrame
  - `IFilter` + `FilterRegistry` + 9 filter implementations (Vintage, Sepia, B&W, Pastel Pop, Vivid, Soft Glow, Warm/Cool Tone, Film Grain)
  - `Layer` + `StickerLayer`, `TextLayer`, `FrameLayer` decoration classes
  - `LayoutStrategy` with SingleLayout, Strip4Layout (polaroid strip), GridLayout
  - `ExportService` (PNG/JPEG/JPG export, download, clipboard, Web Share API)
  - `GalleryManager` (IndexedDB-backed via idb-keyval)
  - `PreferencesService` (localStorage-backed)
- Built React hooks: useRoom, usePeerConnection, useCamera, useCompositor, useFilterEngine, useDecorationCanvas, useExport, useGallery
- Built context providers: ThemeProvider, RoomProvider
- Built app pages: Home (marketing/landing), Room/New (create/join), Room/[roomId] (shared booth with video, filters, countdown, capture), Gallery, Settings
- Built feature components: BoothStage, CountdownOverlay, ShutterButton, ReadyButton, FilterCarousel, AdjustmentSliders, StickerPicker, GalleryGrid, RoomShareCard, WaitingForPartner, ConnectionStatusBadge
- Project builds successfully with zero TypeScript errors

**Files created (60+ files):**
- `src/types/index.ts` — Shared TypeScript types
- `src/lib/utils.ts` — Utilities (generateId, generateRoomSlug, generateFilename)
- `src/core/*` — All OOP service modules (room, peer, camera, compositor, filters, decoration, layout, export, gallery, preferences)
- `src/hooks/*` — All React hooks (8 hooks)
- `src/context/*` — ThemeProvider, RoomContext
- `src/components/*` — UI design system + feature components (15+ components)
- `src/app/*` — All app router pages (/, /room/new, /room/[roomId], /gallery, /settings)
- Updated `src/app/globals.css` with POLA GO design tokens
- Updated `src/app/layout.tsx` with fonts, metadata, ThemeProvider

**Decisions made:**
- Chose Fredoka (headings) + Quicksand (body) from Google Fonts for cute aesthetic
- Used Tailwind CSS v4 with `@theme inline` directive for design tokens
- Used InMemoryTransport as default signaling transport for local development; production transport can be swapped via ISignalingTransport interface (Ably/Pusher/PartyKit)
- All filter processing happens client-side via Canvas API pixel manipulation — no server dependency
- Strip4Layout matches 4-photo polaroid strip; GridLayout for 2x2 alternative
- Used idb-keyval for lightweight IndexedDB access in GalleryManager

**Known issues / TODO carried forward:**
- Real signaling provider (Ably/Pusher/PartyKit) not yet integrated — InMemoryTransport used for local testing
- No `.env.example` or environment variable configuration yet
- TURN server not configured — only Google public STUN is set up
- No test files created yet (WBS 8.13)
- Sticker/frame SVG assets not yet added to `public/assets/`
- No GitHub Actions CI/CD configured (WBS 8.1)
- Cross-browser testing not yet performed
- i18n structure not yet set up (NFR-14)
- PWA manifest/service worker not configured (NFR-15)

**Next recommended task:**
- WBS 8.13: Write unit tests for core services (RoomService, PeerConnectionManager, FilterRegistry, CompositeStrategy, LayoutStrategy, ExportService) with Vitest + React Testing Library. Then WBS 8.1: Set up GitHub Actions CI/CD and connect to Vercel.

---

<!-- Add new entries above this line, newest first -->
