# 📸 POLA GO
### *Snap. Style. Save the Moment — Together, No Matter the Distance.*

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)]()
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Deployed on Vercel](https://img.shields.io/badge/deployed%20on-Vercel-black)]()
[![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-ff69b4)]()

POLA GO is a cute, open-source **shared virtual photo booth for long-distance couples**. One partner creates a **Room** and sends a link. The other partner joins from anywhere in the world. Both cameras appear together, live, in one shared booth screen — and together, through a synced countdown, they capture a set of **4 combined polaroid-style photos**, styled with cute filters, frames, and stickers, downloadable in full quality on both ends.

No app to install. No login required. Just a link, two cameras, and four polaroids.

> 🔗 **Live Demo:** _add your Vercel production URL here_

---

## ✨ Features

- 🔗 **Create a Room, Share a Link** — no sign-up needed to start a session
- 🎥 **Live Together, From Anywhere** — real-time peer-to-peer video (WebRTC) puts both partners side-by-side in one shared booth stage
- ⏱️ **Synchronized Countdown** — both partners see the same 3-2-1 countdown, so a shot is captured "together," on both ends, at once
- 🖼️ **4-Photo Polaroid Set** — pose four times and get a classic combined polaroid strip
- 🎨 **Customizable Filters** — Vintage, Sepia, Pastel Pop, Vivid, Soft Glow, and more, applied consistently to both partners' side of the frame
- 💕 **Couple-Themed Stickers & Frames** — hearts, love notes, "miles apart" badges, and more
- 💾 **High-Quality Export** — each partner downloads the exact same final result, in PNG, JPEG, or JPG at full resolution — independently, on their own device
- 💬 **In-Room Reactions** — send a heart or emoji burst while you wait or pose
- 🌗 **Cute, Romantic Themes** — light, dark, and pastel themes
- 🔒 **Privacy-First** — video streams peer-to-peer between the two of you; nothing is stored or routed through a server
- ♿ **Accessible & Responsive** — works well on desktop, tablet, and mobile, even if you're on different device types than your partner

Full requirements and roadmap live in [`Project_SRS.md`](./Project_SRS.md).

---

## 🧱 Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 14+ (App Router), TypeScript |
| Styling | Tailwind CSS, shadcn/ui, Google Fonts |
| Animation | Framer Motion |
| Real-Time Video | WebRTC (peer-to-peer) |
| Signaling / Presence | Ably / Pusher / PartyKit / Supabase Realtime (pick one) — used only for room handshake, never for media |
| NAT Traversal | STUN (Google public STUN) + TURN fallback |
| Camera/Imaging | MediaDevices API, Canvas API |
| Local Storage | IndexedDB, localStorage |
| Testing | Jest/Vitest, React Testing Library, Playwright |
| CI/CD | GitHub Actions + Vercel |

---

## 🪄 How It Works

```
Create Room → Share Link → Partner Joins → Live Together → Ready? → Sync Countdown → Snap! → Repeat x4 → Style It → Export
```

1. **Create a Room.** One partner taps "Start a Room" and gets a unique, private link.
2. **Share the link** with your partner — however you'd normally message them.
3. **Partner joins.** They open the link, allow their camera, and instantly appear live next to you.
4. **Ready up.** When you're both ready, a synced countdown plays on both screens.
5. **Snap!** A single combined photo of both of you is captured — from two cameras, two places, one photo.
6. **Repeat 4 times**, trying different poses each round.
7. **Style it.** Apply filters, add stickers, hearts, and text to your finished polaroid set.
8. **Export.** Each of you downloads the exact same 4-photo set, in full resolution, on your own device.

All video is peer-to-peer (WebRTC) — it goes directly between your two browsers, not through POLA GO's servers. Photo compositing and filtering also happen entirely client-side.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm / pnpm / yarn
- Two devices (or two browser windows, for local testing) with camera support
- A free account with a real-time signaling provider (e.g., Ably, Pusher, or PartyKit) for local development

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/<your-org>/pola-go.git
cd pola-go

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env.local
# Fill in your signaling provider API key/secret and (optionally) TURN credentials

# 4. Run the dev server
npm run dev

# 5. Open http://localhost:3000 in two browser windows (or two devices)
#    to simulate the Host + Guest experience
```

### Build & Deploy

```bash
npm run build
npm run start   # run production build locally
```

POLA GO auto-deploys via **GitHub → Vercel** integration:
- Every pull request gets a unique **Preview Deployment**.
- Merges to `main` deploy to **Production**.
- Remember to configure your signaling provider's production keys as Vercel environment variables.

---

## 📁 Project Structure

```
pola-go/
├── src/
│   ├── app/
│   │   ├── room/
│   │   │   ├── new/          # "Create a Room" flow
│   │   │   └── [roomId]/     # Join + shared booth experience
│   │   ├── gallery/           # Session gallery view
│   │   └── settings/          # Preferences page
│   ├── components/            # Reusable UI + feature components (room, booth, filters, decoration, gallery)
│   ├── core/                  # Framework-agnostic OOP service layer
│   │   ├── room/               # RoomService + ISignalingTransport + provider adapters
│   │   ├── peer/                # PeerConnectionManager (WebRTC)
│   │   ├── camera/              # CameraService
│   │   ├── compositor/          # CompositeStrategy (split-screen, PiP, heart-frame)
│   │   ├── filters/              # IFilter, FilterRegistry, filter implementations
│   │   ├── decoration/           # Layer, StickerLayer, TextLayer, FrameLayer
│   │   ├── layout/               # LayoutStrategy + strip/grid layouts
│   │   ├── export/               # ExportService
│   │   ├── gallery/               # GalleryManager
│   │   └── preferences/           # PreferencesService
│   ├── hooks/                  # React hooks bridging core services to UI
│   ├── context/                 # Room/Theme/Preferences providers
│   ├── lib/                     # Shared utilities
│   └── types/                   # Shared TypeScript types
├── tests/                       # unit / integration / e2e
├── Project_SRS.md                 # Full requirements specification
├── PROJECT_SUMMARY.md             # Living agentic development log
├── CHANGELOG.md
└── CONTRIBUTING.md
```

Each feature (room/signaling, peer connection, camera, compositor, filters, decorations, layouts, export, gallery) is built as an **independent, pluggable module** behind clean interfaces — so, for example, swapping the real-time signaling vendor or adding a new composite layout doesn't require touching unrelated code. See [`Project_SRS.md`](./Project_SRS.md), Section 10, for full architecture details.

---

## 🗺️ Roadmap

- [x] Phase 0 — Foundation & documentation
- [ ] Phase 1 — Room creation & signaling
- [ ] Phase 2 — Peer video connection
- [ ] Phase 3 — Synchronized capture & compositor
- [ ] Phase 4 — Filter engine
- [ ] Phase 5 — Decoration & final strip layout
- [ ] Phase 6 — Export, gallery & reactions
- [ ] Phase 7 — Theming & accessibility polish
- [ ] Phase 8 — Testing & QA
- [ ] Phase 9 — Deployment & v1.0 launch
- [ ] Phase 10 — Post-launch: QR quick-join, distance badge, GIF mode, shared cloud album, PWA

Full breakdown in [`Project_SRS.md`](./Project_SRS.md), Sections 7 & 8.

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repo and create a branch: `feature/<your-feature>`
2. Follow the existing code style (ESLint + Prettier enforced via pre-commit hooks)
3. Add/update tests for any new module — for room/peer features, include a two-peer simulation test where possible
4. Update `PROJECT_SUMMARY.md` if your change is part of an agentic/AI-assisted session
5. Open a PR against `develop`

See `CONTRIBUTING.md` for full guidelines (branching model, commit conventions, PR checklist).

---

## 🧠 For AI-Assisted / Agentic Contributors

This project is built using an agentic development workflow. Before starting new work:

1. Read `PROJECT_SUMMARY.md` to understand the latest state of the project.
2. Reference the relevant task ID from `Project_SRS.md` Section 8 (Work Breakdown Structure).
3. After completing work, append a new dated entry to `PROJECT_SUMMARY.md` describing what was done, files touched, decisions made, and the next recommended task.

---

## 📄 License

Licensed under the [MIT License](./LICENSE) — free to use, modify, and distribute.

---

## 💌 Acknowledgements

Built with love for every couple counting down the days (and time zones) until they're together again.

## 📬 Community & Support

- 🐛 Found a bug? [Open an issue](https://github.com/<your-org>/pola-go/issues)
- 💡 Have an idea? [Start a discussion](https://github.com/<your-org>/pola-go/discussions)
