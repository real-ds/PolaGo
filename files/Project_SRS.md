# Software Requirements Specification (SRS)
## Project Name: **POLA GO**
### Tagline: *"Snap. Style. Save the Moment — Together, No Matter the Distance."*

| Document Info | Details |
|---|---|
| Version | 1.1 (Revised: Couple Room + Real-Time Dual Capture) |
| Status | Draft for Development |
| Author | Requirements Engineering (AI-Assisted, Agentic Dev Workflow) |
| Date | July 2026 |
| Target Platform | Web (Next.js, Vercel) |
| License Model | Open Source |
| Core Concept | A shared, real-time virtual photo booth **Room** where two long-distance partners join via a link, see each other live, and capture a synchronized 4-photo polaroid set together |

---

## 1. Introduction

### 1.1 Purpose
POLA GO is a web-based **shared virtual photo booth for long-distance couples**. One partner creates a private **Room** and shares a link; the other partner joins from anywhere in the world. Both cameras stream live into a single shared booth screen, and together they pose through a synchronized countdown to capture a shared photo — repeated to build a classic **4-photo polaroid strip** — with cute customizable filters, frames, and stickers, downloadable in high quality (PNG/JPEG/JPG) on both ends. This document defines the functional and non-functional requirements, system architecture, task breakdown, and development conventions required to build POLA GO as a **modular, scalable, open-source** product using an **agentic (AI-assisted) development workflow**.

### 1.2 Scope
POLA GO will:
- Let a user create a **Room** and generate a unique, shareable join link (no account required for MVP).
- Let a second person join that Room via the link and establish a **real-time, peer-to-peer video connection** (WebRTC) with the room host.
- Display both partners' live camera feeds together in a single shared "booth stage" (side-by-side or picture-in-picture), so it feels like they're standing next to each other.
- Run a **synchronized countdown** visible to both participants, so a single combined frame is captured from both video streams at (as close as possible to) the same instant.
- **Composite** both partners' captured frames into one polaroid-style image per shot, and repeat the flow to build a **set of 4 photos** (the couple's polaroid strip) — matching the classic on-the-go polaroid booth experience.
- Offer a playful, "cute" aesthetic UI with custom fonts, pastel/romantic themes, and booth-style interactions (countdown, flash, shutter sound, heart reactions).
- Allow real-time and post-capture filter/effect customization (color filters, frames, stickers, text overlays) applied to the combined couple photo.
- Allow both participants to independently export the finished 4-photo set as PNG, JPEG, or JPG in the highest available resolution.
- Be built with a component-driven, object-oriented, modular architecture so that each feature (room/signaling, camera, compositor, filter engine, frame engine, export engine, gallery) can be developed, tested, and swapped independently.
- Be deployed on Vercel with GitHub-based CI/CD, full test coverage (unit + integration), and complete open-source documentation (README, CONTRIBUTING, SRS, CHANGELOG).
- Maintain a living **PROJECT_SUMMARY.md** that is updated after every agentic development task, to preserve continuity across AI-assisted coding sessions.

### 1.3 Out of Scope (v1.0)
- Native mobile apps (iOS/Android) — may be a future phase via PWA wrapping.
- Server-side storage of couple photos beyond the lifetime of the room session (v1 is peer-to-peer/session-based only; a persistent shared cloud album is a future phase).
- Group rooms with more than 2 participants (v1 is strictly a 1-to-1 couple room).
- Video booth / GIF/Boomerang recording (flagged as a future enhancement, architecturally reserved for).
- Payment/commerce features (e.g., physical print ordering) — future phase.
- Guaranteed frame-perfect (zero-latency) synchronization — v1 targets "as close as possible" sync with a visible shared countdown, with network-latency compensation as a best effort (see NFR-16).

### 1.4 Definitions, Acronyms, Abbreviations
| Term | Meaning |
|---|---|
| SRS | Software Requirements Specification |
| FR | Functional Requirement |
| NFR | Non-Functional Requirement |
| PWA | Progressive Web App |
| SSR/CSR | Server-Side / Client-Side Rendering |
| Photo Strip | Multiple photos combined into one vertical/horizontal strip, classic photo-booth style |
| Filter Engine | Module responsible for applying visual effects/filters to captured images |
| Agentic Workflow | Development process where an AI coding agent performs tasks autonomously in increments, logging progress |
| Room | A unique, shareable, temporary session in which two partners connect to take photos together |
| Host / Guest | Host = the partner who creates the Room; Guest = the partner who joins via the shared link |
| WebRTC | Web Real-Time Communication — browser API/protocol enabling peer-to-peer audio/video/data streaming |
| Signaling Server | A lightweight real-time service used only to help two peers discover and negotiate a WebRTC connection (not used to relay video) |
| STUN / TURN | Network traversal helper servers used by WebRTC to establish/maintain peer connections across NATs/firewalls |
| Compositor | The module responsible for combining two separate camera frames into a single output image |
| Synchronized Capture | A capture triggered from a shared, network-synced countdown so both peers' frames are grabbed at (near) the same instant |
| CI/CD | Continuous Integration / Continuous Deployment |

### 1.5 References
- Next.js official documentation
- MDN Web APIs: `MediaDevices.getUserMedia()`, `Canvas API`, `OffscreenCanvas`
- WCAG 2.1 Accessibility Guidelines
- Vercel Deployment Documentation

### 1.6 Overview
Section 2 describes the product overview. Section 3 lists functional requirements. Section 4 lists non-functional requirements. Section 5 breaks down system features/modules. Section 6 lists additional recommended features. Section 7 defines goals & milestones. Section 8 provides a full task breakdown (WBS). Section 9 specifies the tech stack. Section 10 defines the OOP-based modular architecture and folder structure. Section 11 defines the agentic development & summary-logging protocol. Section 12 covers Git/CI-CD workflow. Section 13 defines README.md requirements. Section 14 covers appendices (assumptions, risks, glossary).

---

## 2. Overall Description

### 2.1 Product Perspective
POLA GO is a standalone, greenfield web product — not an extension of an existing system. It sits at the intersection of a classic photo-booth app (Photobooth, Picsart's booth mode) and a video-calling tool (like a lightweight FaceTime/Google Meet), purpose-built for a single delightful use case: **two people, far apart, taking a polaroid together**. No login is required for the core couple-room flow.

### 2.2 Product Functions (Summary)
1. **Room creation** by the Host, generating a unique shareable join link
2. **Room joining** by the Guest via the link, with camera/mic permission handling
3. **Real-time peer-to-peer video connection** (WebRTC) between Host and Guest
4. **Shared booth stage** rendering both live video feeds together (side-by-side / picture-in-picture)
5. **Synchronized countdown** visible to both participants before each capture
6. **Dual-frame capture & compositing** — combining both partners' frames into one image per shot
7. Repeat capture flow to build a **set of 4 combined photos** (the couple's polaroid strip)
8. Real-time filter preview overlay before capture, applied consistently to both feeds
9. Post-capture editing: filters, frames, stickers, text, color adjustment on the combined image
10. Final strip composition (arranging the 4 combined shots into a single polaroid-strip layout)
11. Export/download as PNG / JPEG / JPG at the highest available resolution — available independently to both Host and Guest
12. Local/session gallery (view/retake/delete any of the 4 shots before finalizing)
13. In-room reactions (hearts, cute stickers) and lightweight text chat during the session
14. Room lifecycle management (link expiry, session end, privacy-first cleanup)
15. Theme customization (light/pastel/dark/romantic cute themes)
16. Fully responsive across desktop, tablet, and mobile browsers

### 2.3 User Classes and Characteristics
| User Class | Description | Technical Level |
|---|---|---|
| Host Partner | Creates the Room and shares the join link with their partner | Low |
| Guest Partner | Joins an existing Room via link shared by the Host | Low |
| Long-Distance Couple (combined) | The primary target user — two partners in different locations using POLA GO together in real time | Low |
| Content Creator | Uses filters/stickers/output for social media sharing | Medium |
| Developer/Contributor | Open-source contributors extending features | High |
| Admin (future phase) | Manages abuse reporting, room moderation, analytics | Medium–High |

### 2.3.1 Primary Use Case Narrative
> Aisha is in Delhi. Raj is in Toronto. Aisha opens POLA GO, taps **"Start a Room"**, and shares the generated link with Raj over WhatsApp. Raj taps the link, allows his camera, and instantly sees Aisha's live video next to his own in a shared booth screen. Aisha taps **"Ready for Photo 1"**; once both are marked ready, a synchronized 3-2-1 countdown plays for both of them, a shutter flash fires, and a single combined photo of both of them appears in the shared preview. They repeat this three more times, trying different poses, and finish with a cute 4-photo polaroid strip — customized with a heart-shaped frame and a pastel filter — which they can each download in full quality on their own device.

### 2.4 Operating Environment
- Modern browsers: Chrome, Edge, Firefox, Safari (desktop & mobile) with camera/microphone permission and WebRTC support.
- Responsive across screen sizes: mobile (360px+), tablet, desktop — both participants may be on different device types simultaneously.
- Hosted on Vercel (Next.js serverless/edge runtime) for the app shell and API routes; a lightweight always-on **signaling channel** (see Section 9) handles WebRTC handshake/room presence, since this cannot run on short-lived serverless functions alone.
- HTTPS required (mandatory for camera access via `getUserMedia` and for WebRTC).
- Requires a reasonably stable internet connection on both ends; app must detect and surface poor-connection states.

### 2.5 Design and Implementation Constraints
- Must use Next.js (App Router) as the core framework.
- Must be deployable on Vercel; the signaling/presence layer must use a Vercel-compatible real-time provider (e.g., managed WebSocket/pub-sub service) since Vercel serverless functions cannot hold persistent socket connections.
- Video/audio must travel **peer-to-peer** via WebRTC wherever possible (not relayed through the app's own servers) to keep costs low and preserve privacy; a TURN relay is used only as a NAT-traversal fallback.
- Filter/image processing and compositing must happen client-side (Canvas/WebGL) to avoid server cost and preserve privacy — captured frames are combined in-browser, not uploaded to a server.
- Must follow OOP/modular design principles even within a React/Next.js functional paradigm (via class-based service modules, encapsulated hooks, and clean separation of concerns).
- Room state (who has joined, ready-status, current shot number) must be kept minimal and ephemeral — no long-term storage of personal data.

### 2.6 Assumptions and Dependencies
- Both partners grant camera (and ideally microphone, for optional light chat) permission; app must gracefully handle denial on either side.
- Both users' devices/browsers support WebRTC, Canvas API, and `getUserMedia`.
- A free-tier STUN server (e.g., Google's public STUN) is sufficient for most connections; a TURN fallback (self-hosted or a low-cost managed provider) is needed for the minority of connections behind restrictive NATs/firewalls.
- A managed real-time signaling provider (e.g., Ably, Pusher, PartyKit, or Supabase Realtime) is an acceptable lightweight dependency, since it carries no photo/video data — only small JSON messages for handshake and room presence.
- No dependency on any paid third-party API for core image filters (all computed via Canvas/CSS/WebGL, not external AI APIs) to keep the tool free and open-source-friendly.

---

## 3. Functional Requirements (FR)

### 3.0 Room & Real-Time Pairing Module
- **FR-R.1**: System shall allow a user (Host) to create a new Room with a single tap/click, requiring no sign-up.
- **FR-R.2**: System shall generate a unique, hard-to-guess Room link (e.g., `polago.app/room/<random-slug>`) upon creation.
- **FR-R.3**: System shall allow the Host to copy/share the Room link (native share sheet on mobile, copy-to-clipboard on desktop).
- **FR-R.4**: System shall allow a second user (Guest) to join the Room by opening the link, after granting camera permission.
- **FR-R.5**: System shall limit each Room to exactly **two** participants (Host + Guest) in v1; additional join attempts shall be gracefully rejected with a friendly "Room is full" message.
- **FR-R.6**: System shall establish a **WebRTC peer-to-peer connection** between Host and Guest once both are present, using a signaling channel purely for connection negotiation (SDP/ICE exchange).
- **FR-R.7**: System shall use a STUN server for NAT traversal, with a TURN server fallback for restrictive network environments.
- **FR-R.8**: System shall display a clear waiting state to the Host ("Waiting for your partner to join...") until the Guest connects.
- **FR-R.9**: System shall display real-time connection status (Connecting / Connected / Reconnecting / Disconnected) to both participants.
- **FR-R.10**: System shall handle a dropped connection gracefully, attempting automatic reconnection and preserving room/session state (current shot number, chosen filter/theme) for a grace period.
- **FR-R.11**: System shall expire/destroy a Room's signaling data automatically after a defined period of inactivity or after the session is explicitly ended by either participant (privacy-by-design).
- **FR-R.12**: System shall not route raw video/audio through POLA GO's own servers — media flows peer-to-peer directly between the two browsers.

### 3.1 Shared Booth Stage & Synchronized Capture
- **FR-S.1**: System shall render both participants' live video feeds together on a single "booth stage" screen, in a layout the couple can pick (side-by-side split, or picture-in-picture).
- **FR-S.2**: System shall let either participant flip their own camera (front/rear) independently without affecting the other's feed.
- **FR-S.3**: System shall implement a **"Ready" handshake** — each participant marks themselves ready for the next shot; the synchronized countdown begins only once both are marked ready.
- **FR-S.4**: System shall broadcast a synchronized countdown (e.g., 3-2-1) to both participants via the signaling/data channel so the visual countdown appears at the same time on both screens.
- **FR-S.5**: System shall capture a still frame from **each** participant's own local video stream at the countdown's zero-point, and exchange the captured frame (or its rendered result) with the peer via the WebRTC data channel so both ends can compose the same combined image.
- **FR-S.6**: System shall apply a small, configurable synchronization buffer/offset to compensate for minor network latency between participants, to keep both captured poses visually aligned as "the same moment."
- **FR-S.7**: System shall allow a "Retake" of any shot before it is locked into the final 4-photo set, requiring both partners to agree (both tap "Retake") or allowing the shot's initiator to request a retake with the partner's confirmation.
- **FR-S.8**: System shall progress the couple through **exactly 4 shots** per session by default (configurable to fewer, e.g., a quick 1-shot mode, in later phases) to form the final polaroid set.
- **FR-S.9**: System shall show both participants a live shared preview after each of the 4 shots, before moving to the next one.

### 3.1.1 Dual-Frame Compositor
- **FR-C.1**: System shall combine the Host's and Guest's captured frames into a single output image per shot, using a selectable composite layout (e.g., 50/50 vertical split, 50/50 horizontal split, circular picture-in-picture inset, heart-shaped dual frame).
- **FR-C.2**: System shall apply the currently selected filter/adjustment consistently across both halves of the composited image for visual consistency.
- **FR-C.3**: System shall render the compositing operation identically on both the Host's and Guest's devices (deterministic composition), so both end up with the same final image.
- **FR-C.4**: System shall allow the couple to change the composite split style after capture, re-rendering all 4 shots with the newly chosen style before final export.

### 3.2 Camera & Capture Module
- **FR-1.1**: System shall request camera permission from each participant independently and display their own live camera preview within the shared booth stage.
- **FR-1.2**: System shall support switching between front/rear camera (on devices with multiple cameras) for each participant independently.
- **FR-1.3**: System shall provide a "Ready" / shutter-trigger control that either participant can use to initiate the synchronized countdown for the next shot (see FR-S.3–S.5).
- **FR-1.4**: System shall support a countdown duration setting (3s/5s/10s), agreed/selected by the Host, applied identically on both ends.
- **FR-1.5**: System shall progress the couple through the shared capture flow to produce **4 combined shots** in total (see FR-S.8), rather than a single-user multi-shot strip.
- **FR-1.6**: System shall display a shutter animation/flash effect and an optional shutter sound on capture, on both participants' screens simultaneously.
- **FR-1.7**: System shall handle and display a clear, cute-styled error state if camera access is denied or unavailable, on either participant's side, without breaking the room for the other participant.
- **FR-1.8**: System shall mirror each participant's own front-camera preview (selfie-mode) locally by default, while ensuring the final composited image is presented correctly (un-mirrored) to both partners after capture.

### 3.3 Filter & Effects Engine
- **FR-2.1**: System shall provide a set of pre-built visual filters (e.g., Vintage, B&W, Sepia, Pastel Pop, Vivid, Soft Glow, Film Grain, Cool Tone, Warm Tone).
- **FR-2.2**: System shall allow live preview of filters on both participants' camera feeds before capture; changing the filter on one side shall sync and reflect for both (single shared filter state per room, chosen by either partner).
- **FR-2.3**: System shall allow filter changes after capture (non-destructive editing until final export), reapplied consistently across the combined image for all 4 shots.
- **FR-2.4**: System shall provide manual adjustment sliders: brightness, contrast, saturation, exposure, warmth, vignette intensity.
- **FR-2.5**: System shall allow users to save a custom filter combination as a named "preset" (stored in local storage).
- **FR-2.6**: Filter engine shall be pluggable — new filters can be added as independent modules without modifying core capture logic.

### 3.4 Frame, Sticker & Decoration Module
- **FR-3.1**: System shall provide a gallery of cute decorative frames/borders, including couple/romance-themed options (e.g., polaroid border, heart frame, "long distance" themed border with a small map/plane motif, floral, seasonal themes).
- **FR-3.2**: System shall provide draggable/resizable stickers (emojis, cute doodles, hearts, props like sunglasses/hats) overlaid on the combined photo, addable by either participant.
- **FR-3.3**: System shall allow adding custom text captions (e.g., a date, a couple's names, "Day 214 apart 💛") with selectable cute fonts, colors, and sizes.
- **FR-3.4**: System shall allow re-positioning, resizing, and rotating stickers/text via touch or mouse drag, kept in sync so both partners see the same decoration state.
- **FR-3.5**: System shall allow removing/undoing any added decoration before final export.

### 3.5 Photo Strip / Layout Composer
- **FR-4.1**: System shall arrange the 4 combined couple shots into a classic vertical **4-cut polaroid strip** layout by default, with additional layout options (2x2 grid, single highlight + 3 small).
- **FR-4.2**: System shall allow selection of strip background color/pattern and border style.
- **FR-4.3**: System shall auto-arrange the 4 composited (dual-participant) shots into the chosen final strip template.

### 3.6 Export / Download Module
- **FR-5.1**: System shall allow exporting the final 4-photo strip (and/or individual combined shots) as **PNG**, **JPEG**, or **JPG**.
- **FR-5.2**: System shall export at the **highest available resolution** achievable from the composited canvas (no downscaling unless a smaller size is chosen).
- **FR-5.3**: System shall allow the user to choose export quality (for JPEG/JPG: quality slider, e.g., 60–100%).
- **FR-5.4**: System shall trigger a direct browser download with an auto-generated filename pattern: `POLAGO_YYYYMMDD_HHMMSS.<ext>`.
- **FR-5.5**: System shall support batch download (the 4 individual combined shots + the final composed strip).
- **FR-5.6**: System shall allow **both** Host and Guest to independently trigger their own download of the exact same final result on their own device (no dependency on the other partner's device).
- **FR-5.7**: System shall optionally allow copying the final image to clipboard and/or sharing via the Web Share API (mobile).

### 3.7 Session Gallery Module
- **FR-6.1**: System shall maintain a temporary in-room gallery of all 4 captured/edited combined shots (stored in browser memory/IndexedDB on each participant's device).
- **FR-6.2**: System shall allow either participant to propose a retake of any shot before the session is finalized (subject to the retake handshake in FR-S.7).
- **FR-6.3**: System shall clear session/room gallery data on tab close or when the room session ends (privacy-by-design; no server storage of photo content in MVP).

### 3.8 UI/UX & Theming Module
- **FR-7.1**: System shall provide a cute, playful, romantic aesthetic with rounded UI elements, pastel/blush color palette, and custom Google Fonts (e.g., Quicksand, Poppins, Fredoka, Comic Neue as candidates).
- **FR-7.2**: System shall support light, dark, and at least one seasonal/romantic "cute" theme, switchable from settings.
- **FR-7.3**: System shall be fully responsive (mobile-first) across breakpoints, since partners may join from very different devices.
- **FR-7.4**: System shall include onboarding/first-visit tooltips explaining core actions (create/join room, ready-up, capture, filter, download).
- **FR-7.5**: System shall include subtle micro-interactions/animations (button bounce, sticker pop-in, heart-burst on "ready", confetti on successful export) using a lightweight animation library.
- **FR-7.6**: System shall provide a lightweight in-room reaction system (tap-to-send heart/emoji bursts visible to both participants) to add warmth to the waiting/posing moments.

### 3.9 Settings & Preferences
- **FR-8.1**: System shall persist user preferences (last used filter, theme, countdown duration, default export format) in local storage, scoped per device.
- **FR-8.2**: System shall provide a "Reset to Defaults" option.

### 3.10 (Future Phase Placeholder) Accounts & Shared Cloud Album
- **FR-9.1 (Future)**: System may support optional sign-in (NextAuth.js) so couples can save every room session to a persistent, shared cloud album accessible to both partners across visits.
- **FR-9.2 (Future)**: System may support scheduled/recurring "date night booth" reminders and a running timeline of past polaroid sets for a couple.
- **FR-9.3 (Future)**: System may support a self-hosted TURN server and premium/managed signaling tier for higher reliability at scale.

---

## 4. Non-Functional Requirements (NFR)

| ID | Category | Requirement |
|---|---|---|
| NFR-1 | **Performance** | Camera preview shall initialize within 2 seconds on a standard broadband connection. Filter application shall render within 100ms on capture for real-time feel. WebRTC connection establishment shall typically complete within 3–5 seconds of both participants being present. |
| NFR-2 | **Scalability** | Architecture shall support adding new filters, frames, stickers, and layouts as independent plug-in modules without refactoring core code, and shall support scaling the signaling layer horizontally (stateless per-room presence) without redesign. |
| NFR-3 | **Modularity** | Each feature (room/signaling, camera, compositor, filter engine, decoration engine, export engine, gallery) shall be implemented as an isolated, independently testable module/service class. |
| NFR-4 | **Usability** | UI shall follow cute, minimal-friction design; core action (create/join room → pose → capture → download) achievable with minimal taps, understandable without instructions to a non-technical partner. |
| NFR-5 | **Accessibility** | UI shall meet WCAG 2.1 AA where feasible (keyboard navigation, alt text, color contrast, aria-labels on interactive controls), including clear non-visual cues (e.g., audible countdown tick) for the synchronized capture moment. |
| NFR-6 | **Security & Privacy** | Room links shall be unguessable (sufficiently random slugs/tokens). Video/audio shall travel peer-to-peer wherever possible and never be stored server-side. Captured photos shall not be transmitted to or persisted on a server without explicit future opt-in. HTTPS enforced everywhere. |
| NFR-7 | **Reliability** | Application shall gracefully degrade (clear error messaging) when camera/permission/browser API/WebRTC connection is unavailable or drops, without crashing the app shell, and shall attempt automatic reconnection within a room. |
| NFR-8 | **Portability** | Application shall function consistently across Chrome, Firefox, Safari, and Edge, on both desktop and mobile, including across mixed Host/Guest device types. |
| NFR-9 | **Maintainability** | Codebase shall follow consistent naming conventions, TypeScript typing, ESLint/Prettier formatting, and OOP-based service abstractions to ease onboarding of new contributors. |
| NFR-10 | **Testability** | Each module shall have unit tests (Jest/Vitest) and critical user flows shall have integration/e2e tests (Playwright/Cypress) before deployment, including simulated two-peer room sessions. |
| NFR-11 | **Deployability** | Application shall support one-click CI/CD deployment via GitHub → Vercel integration, with preview deployments for every PR; the signaling/real-time provider configuration shall be environment-based and documented. |
| NFR-12 | **SEO & Discoverability** | Public marketing/landing pages shall be SSR/SSG optimized with proper meta tags, Open Graph tags for shareability (room links themselves should not be indexable/discoverable). |
| NFR-13 | **Documentation** | Every module shall be documented via inline JSDoc/TSDoc comments plus a maintained README and CONTRIBUTING guide. |
| NFR-14 | **Localization Readiness** | Text strings shall be abstracted (i18n-ready structure) even if only English is shipped in v1. |
| NFR-15 | **PWA Readiness** | App shall be installable as a PWA (manifest + service worker) for offline splash/basic shell caching in a later phase. |
| NFR-16 | **Synchronization Tolerance** | The visual/perceived gap between both partners' captured poses in a combined shot shall be minimized via a shared countdown and latency-compensation buffer; the system shall not require frame-level (sub-100ms) precision to be considered successful, since the countdown itself is the primary synchronization mechanic. |
| NFR-17 | **Room Privacy Lifecycle** | Room signaling state and any transient session data shall auto-expire (e.g., within a few hours of inactivity or on explicit "End Session") so old links cannot be reused to rejoin a stale session. |
| NFR-18 | **Network Resilience** | System shall detect and surface poor connection quality (e.g., via WebRTC stats) to both participants, and shall fall back to a TURN relay automatically when direct peer-to-peer connection fails. |

---

## 5. System Features (Module Breakdown)

### Module 0: Room & Signaling Service
Manages Room lifecycle (create/join/expire), participant presence, and the WebRTC signaling handshake (SDP offer/answer, ICE candidate exchange) over a lightweight real-time channel. Exposes a simple `RoomService` API to the rest of the app so the UI never talks to the signaling transport directly.

### Module 0.1: Peer Connection Manager
Wraps the native `RTCPeerConnection` API (establish connection, attach local media stream, receive remote stream, monitor connection-quality stats, handle reconnect) behind a `PeerConnectionManager` class, decoupled from any specific signaling provider.

### Module 1: Camera Service
Handles device media stream acquisition, camera switching, permission handling, and frame capture into a canvas buffer — used independently for the local participant's own stream.

### Module 1.1: Dual-Frame Compositor
Combines the local participant's captured frame with the remote participant's captured/received frame into a single output image, using a selectable `CompositeStrategy` (split-screen, picture-in-picture, heart-frame), guaranteeing deterministic output on both ends.

### Module 2: Filter Engine
Encapsulates all filter definitions (CSS filter strings, Canvas pixel manipulation, or WebGL shaders) behind a common `IFilter` interface so new filters can be added by implementing the interface and registering in a `FilterRegistry`. Applied to the composited (dual-participant) image.

### Module 3: Decoration Engine
Manages stickers, frames, and text overlays as independent "layer" objects on a compositing canvas, each layer supporting transform operations (move/scale/rotate/delete), with decoration state synced between both participants over the data channel.

### Module 4: Layout Composer
Arranges the 4 combined shots into supported final-strip layout templates (vertical 4-cut, 2x2 grid) using a `LayoutStrategy` pattern.

### Module 5: Export Service
Serializes the final composited canvas into the chosen file format/quality and triggers download, clipboard copy, or share — invocable independently by either participant.

### Module 6: Session Gallery Manager
In-memory/IndexedDB-backed store of the current room's 4 combined shots with CRUD operations (create on capture, read for preview, update on edit, delete/retake on discard).

### Module 7: Theming & Preferences Service
Manages theme tokens, font selection, and persisted user settings via local storage, exposed through a React Context/Provider.

### Module 8: UI Component Library
Shared, reusable, styled components (Button, Modal, Slider, Toast, Card, StickerPicker, FilterCarousel, CountdownOverlay, BoothStage, RoomShareCard, ReactionButton, etc.) — the visual/cute design system.

---

## 6. Additional Recommended Features (Value-Add Suggestions)

1. **In-Room Reactions**: Tap-to-send heart bursts / cute emoji reactions that animate on both screens — a small emotional touch while waiting for the countdown.
2. **Lightweight Voice/Text Chat Toggle**: Optional mic-on chat during the session, or a simple text bubble ("say something cute!") for couples who prefer not to use audio.
3. **Countdown Sound + Shared Shutter Sound**: A synchronized audible tick and shutter sound firing for both partners at capture, reinforcing the "we did this together" feeling even with slight visual lag.
4. **"Distance" Badge**: Optionally show the approximate distance or time-zone gap between the two partners on the final strip (e.g., "6,704 km apart 💛"), computed from opt-in location or manually entered cities — purely decorative, never tracked/stored server-side.
5. **Confetti / Celebration Micro-animation** on completing the full 4-photo set, reinforcing the "cute" delight factor for both partners simultaneously.
6. **QR Code Quick-Join**: Generate a QR code version of the room link, handy when sharing across devices (e.g., scanning from a phone to a laptop).
7. **Background Blur/Replacement** (client-side chroma-key or lightweight segmentation) so mismatched real-world backgrounds don't clash in the combined photo.
8. **Composite Style Switcher**: Let couples preview and swap between split-screen, picture-in-picture, and heart-frame composite styles for each shot.
9. **Session Recap Screen**: A short "here's your polaroid set" summary screen with both partners' names/emojis and a shareable recap link (image only, not video).
10. **GIF/Boomerang Mode**: Capture a short synchronized burst and export as an animated GIF (future phase — architecturally reserved for, beyond v1 scope).
11. **Anniversary/Date Reminder Mode**: Let a couple bookmark POLA GO for recurring "date night" polaroid sessions (future phase, ties into the optional accounts feature).
12. **Analytics Opt-in (Privacy-respecting)**: Aggregate, anonymous usage analytics (e.g., Vercel Analytics) to guide roadmap — no personal data, video, or photo content collected.
13. **PWA "Install App" prompt** for quick one-tap access next time a couple wants a spontaneous session.
14. **Multi-language UI (i18n)** starting with structure in v1, translations added progressively — useful since long-distance couples are often cross-cultural/cross-language.
15. **Accessibility Mode**: High-contrast toggle, reduced-motion toggle, and an audible countdown cue for users sensitive to animations or with visual impairments.

---

## 7. Project Goals & Milestones (Phased Roadmap)

### Phase 0 — Foundation (Week 1)
- Goal: Project scaffolding, design system, and documentation baseline established.
- Set up Next.js + TypeScript + Tailwind project.
- Set up GitHub repo, branch protection, issue/PR templates.
- Draft README.md, CONTRIBUTING.md, and this SRS.
- Establish design tokens (colors, fonts, spacing) for the "cute"/romantic aesthetic.
- Select and provision the real-time signaling provider (e.g., Ably/Pusher/PartyKit/Supabase Realtime) and a STUN/TURN configuration.

### Phase 1 — Room Creation & Signaling (Week 2)
- Goal: A user can create a Room, get a shareable link, and a second user can join it; presence is tracked in real time.
- Build `RoomService` (create/join/leave/expire Room).
- Integrate the chosen signaling provider for presence + SDP/ICE relay.
- Build Room UI: "Create Room" CTA, shareable link screen, "Waiting for partner" state, "Room full" handling.

### Phase 2 — Peer Video Connection (Week 3)
- Goal: Once both partners are present, their live camera feeds appear together on one shared booth screen.
- Build `PeerConnectionManager` wrapping `RTCPeerConnection`.
- Implement local Camera Service (per participant) and attach stream to the peer connection.
- Build the shared `BoothStage` UI (side-by-side / picture-in-picture layouts).
- Implement connection status indicator + basic reconnect handling.

### Phase 3 — Synchronized Capture & Compositor (Week 4)
- Goal: Both partners can "ready up," see a synced countdown, and get one combined photo per shot.
- Implement the Ready/handshake protocol and synced countdown broadcast over the data channel.
- Implement local frame capture + frame exchange between peers.
- Build the Dual-Frame Compositor (`CompositeStrategy`: split-screen, picture-in-picture, heart-frame).
- Implement the 4-shot progression flow with shared live preview after each shot.

### Phase 4 — Filter Engine (Week 5)
- Goal: Couples can apply and preview filters live and post-capture, applied consistently to the combined image.
- Build `IFilter` interface + `FilterRegistry`.
- Implement 8–10 base filters.
- Implement adjustment sliders (brightness/contrast/saturation); sync the active filter choice between both participants.

### Phase 5 — Decoration & Final Strip Layout (Week 6)
- Goal: Couples can add stickers/text/frames (including romantic/couple themes) and see the 4 shots composed into a final strip.
- Build Decoration Engine (draggable layers, synced between participants).
- Build Layout Composer (4-cut strip, 2x2 grid).
- Integrate sticker/frame asset library, including long-distance/couple-themed assets.

### Phase 6 — Export, Gallery & Reactions (Week 7)
- Goal: Both partners can independently export the final result, manage retakes, and enjoy in-room reactions.
- Build Export Service (PNG/JPEG/JPG, quality control, filename convention, batch export).
- Build Session Gallery Manager (IndexedDB) with retake-request handshake.
- Implement in-room reactions (hearts/emoji bursts) and optional light text chat.

### Phase 7 — Polish, Theming & Accessibility (Week 8)
- Goal: Full cute/romantic UI polish, theming, accessibility pass.
- Implement light/dark/seasonal/romantic themes.
- Accessibility audit (keyboard nav, ARIA, contrast, audible countdown cue).
- Add micro-animations (confetti, shutter flash, sticker pop, heart-burst reactions).

### Phase 8 — Testing & QA (Week 9)
- Goal: Full unit + integration + e2e test coverage on critical flows, including two-peer session simulation.
- Unit tests for each service/module (Room, Peer, Compositor, Filter, Export).
- Integration tests for create-room → join → sync-capture → export flow.
- Simulated poor-network / TURN-fallback testing.
- Cross-browser/device manual QA pass (including mixed desktop+mobile pairings).

### Phase 9 — Deployment & Launch (Week 10)
- Goal: Production deployment with CI/CD, monitoring, and public documentation.
- Connect GitHub repo to Vercel, configure preview + production environments; configure the signaling provider's production keys/environment.
- Finalize README, add usage GIFs/screenshots of two people in a room together.
- Public v1.0 release/tag.

### Phase 10 — Post-Launch Enhancements (Ongoing)
- QR quick-join, background blur/replacement, GIF/boomerang mode, distance badge, anniversary/date reminder mode, accounts + shared cloud album, PWA install, i18n expansion.

---

## 8. Detailed Task Breakdown (Work Breakdown Structure)

### 8.1 Setup & Infrastructure
- [ ] Initialize Next.js (App Router, TypeScript) project
- [ ] Configure Tailwind CSS + design tokens (colors, radii, shadows)
- [ ] Set up ESLint + Prettier + Husky pre-commit hooks
- [ ] Configure absolute imports / path aliases
- [ ] Set up folder structure per Section 10
- [ ] Initialize GitHub repository, add `.gitignore`, license (MIT recommended for open source)
- [ ] Set up GitHub Actions workflow for lint/test on PR
- [ ] Connect repository to Vercel; configure environment variables
- [ ] Create `PROJECT_SUMMARY.md` and `CHANGELOG.md` skeleton

### 8.2 Design System / UI Kit
- [ ] Select and load cute Google Fonts (e.g., Fredoka, Quicksand, Poppins)
- [ ] Define color palette (pastel primary/secondary/accent + dark mode variants)
- [ ] Build core UI components: Button, Card, Modal, Toast, Slider, Tabs, Tooltip
- [ ] Build `CountdownOverlay`, `ShutterButton`, `FilterCarousel`, `StickerPicker` components
- [ ] Implement responsive layout shell (Header, BoothStage, ControlDock)

### 8.3 Room & Signaling Module
- [ ] Provision real-time signaling provider (Ably / Pusher / PartyKit / Supabase Realtime) and STUN/TURN config
- [ ] Build `RoomService` class (createRoom, joinRoom, leaveRoom, room presence/status)
- [ ] Implement unique/unguessable room slug generation
- [ ] Build "Create Room" flow UI + shareable link screen (copy link, native share, QR code)
- [ ] Build "Join Room" flow UI (via link, permission prompt, "room full"/"room expired" handling)
- [ ] Implement room expiry/cleanup logic (inactivity timeout, explicit end-session)
- [ ] Implement connection status UI (Connecting/Connected/Reconnecting/Disconnected)

### 8.4 Peer Connection Module
- [ ] Build `PeerConnectionManager` class wrapping `RTCPeerConnection`
- [ ] Implement SDP offer/answer + ICE candidate exchange via `RoomService`'s signaling channel
- [ ] Implement local media stream attachment and remote stream reception
- [ ] Implement a WebRTC data channel for countdown sync, filter/decoration state sync, and frame exchange
- [ ] Implement automatic reconnect-on-drop logic with session state preservation
- [ ] Implement connection-quality monitoring (WebRTC stats) and TURN-relay fallback

### 8.5 Camera Module
- [ ] Build `CameraService` class (start/stop stream, switch camera, error states)
- [ ] Build `useCamera` hook wrapping `CameraService` for React consumption
- [ ] Implement live preview `<video>` element with mirrored selfie view (local only)
- [ ] Implement capture-to-canvas frame grabber
- [ ] Implement countdown timer logic + UI, driven by the synchronized broadcast from the Peer Connection data channel
- [ ] Implement the "Ready" handshake UI and 4-shot progression flow

### 8.6 Booth Stage & Compositor Module
- [ ] Build shared `BoothStage` component rendering both local and remote video feeds (side-by-side / picture-in-picture)
- [ ] Define `CompositeStrategy` interface (`compose(localFrame, remoteFrame, targetCanvas)`)
- [ ] Implement `SplitScreenComposite`, `PictureInPictureComposite`, `HeartFrameComposite`
- [ ] Implement deterministic compositing so both participants render an identical result
- [ ] Implement composite-style switcher UI with re-render of all 4 shots on change

### 8.7 Filter Engine
- [ ] Define `IFilter` interface (`apply(ctx, imageData): ImageData`)
- [ ] Implement `FilterRegistry` (register/list/get filters)
- [ ] Implement baseline filters (Vintage, B&W, Sepia, Pastel Pop, Vivid, Soft Glow, Film Grain, Cool/Warm tone)
- [ ] Implement adjustment sliders (brightness, contrast, saturation, warmth, vignette)
- [ ] Implement live CSS-filter preview layer for performance during preview (pre-capture)
- [ ] Implement Canvas-based "bake-in" of filters at capture/export time
- [ ] Implement preset save/load (localStorage)
- [ ] Sync the active filter/preset selection to the partner via the data channel so both preview the same filter

### 8.8 Decoration Engine
- [ ] Define `Layer` base class (position, scale, rotation, z-index)
- [ ] Implement `StickerLayer`, `TextLayer`, `FrameLayer` subclasses
- [ ] Implement drag/resize/rotate gesture handling (mouse + touch)
- [ ] Build sticker/frame asset library (SVG/PNG assets, categorized)
- [ ] Implement layer z-order management (bring to front/send back)
- [ ] Implement undo/redo stack for decoration actions

### 8.9 Layout Composer
- [ ] Define `LayoutStrategy` interface
- [ ] Implement `SingleLayout`, `Strip2Layout`, `Strip3Layout`, `Strip4Layout`, `GridLayout`
- [ ] Implement background color/pattern selection for strips
- [ ] Implement auto-composition of captured frames into selected layout canvas

### 8.10 Export Service
- [ ] Implement `ExportService` class (canvas → Blob conversion)
- [ ] Implement format selector (PNG/JPEG/JPG) with quality slider for lossy formats
- [ ] Implement max-resolution export logic (no forced downscale)
- [ ] Implement filename generator utility
- [ ] Implement batch export (4 individual combined shots + composed strip) as ZIP (optional, via JSZip) or sequential downloads
- [ ] Ensure export works independently on Host's and Guest's devices from the same final composited state (no dependency on the other peer being present at export time)
- [ ] Implement clipboard copy + Web Share API integration

### 8.11 Session Gallery
- [ ] Implement `GalleryManager` service (IndexedDB via idb-keyval or Dexie)
- [ ] Implement gallery UI (thumbnail grid, retake/delete/edit actions)
- [ ] Implement session-clear-on-close privacy behavior

### 8.12 Settings & Theming
- [ ] Implement `ThemeProvider` (light/dark/seasonal)
- [ ] Implement `PreferencesService` (localStorage-backed)
- [ ] Build Settings panel UI (theme, countdown default, export format default)

### 8.13 Testing
- [ ] Unit tests: RoomService, PeerConnectionManager (mocked RTCPeerConnection), CompositeStrategy implementations, FilterRegistry, LayoutStrategy implementations, ExportService, PreferencesService
- [ ] Integration tests: create-room → join-room → peer-connect → ready-handshake → sync-capture → composite → filter → decorate → export full flow
- [ ] E2E tests (Playwright, two browser contexts simulating Host + Guest): full couple-session happy path, camera permission flow (mocked), download flow, theme switch
- [ ] Network resilience tests: simulated disconnect/reconnect mid-session, TURN-relay fallback, high-latency countdown sync behavior
- [ ] Accessibility audit (axe-core automated + manual keyboard pass), including the audible countdown cue
- [ ] Cross-browser & cross-device manual QA checklist (Chrome, Firefox, Safari, Edge; iOS Safari, Android Chrome; desktop-to-mobile pairing)

### 8.14 Deployment
- [ ] Configure Vercel project (Production + Preview environments)
- [ ] Set up GitHub Actions: lint → test → build → deploy gate
- [ ] Configure custom domain (if applicable) + HTTPS
- [ ] Post-deploy smoke test checklist

### 8.15 Documentation
- [ ] Write full README.md (see Section 13)
- [ ] Write CONTRIBUTING.md (branching, PR process, code style)
- [ ] Write CODE_OF_CONDUCT.md (recommended for open source)
- [ ] Maintain CHANGELOG.md per release
- [ ] Maintain PROJECT_SUMMARY.md per agentic task (see Section 11)

---

## 9. Technology Stack

| Layer | Technology | Notes |
|---|---|---|
| Framework | **Next.js 14+ (App Router)** | SSR/SSG for landing pages, CSR for booth interaction |
| Language | **TypeScript** | Strict typing for OOP service classes and component props |
| Styling | **Tailwind CSS** + CSS Modules where needed | Utility-first + custom design tokens for cute theme |
| UI Primitives | **shadcn/ui** (Radix-based) | Accessible base components, customized to cute aesthetic |
| Fonts | Google Fonts (Fredoka, Quicksand, Poppins, Comic Neue) | Loaded via `next/font` for performance |
| Animation | **Framer Motion** | Micro-interactions, sticker pop-ins, confetti |
| Camera/Media | **MediaDevices API**, **Canvas API**, optional **WebGL** (via a lightweight shader lib) | Client-side only |
| Real-Time Video | **WebRTC** (native `RTCPeerConnection`, optionally wrapped with **simple-peer** or **PeerJS** for a simpler API) | Peer-to-peer; not relayed through app servers |
| Signaling / Presence | **Ably**, **Pusher Channels**, **PartyKit**, or **Supabase Realtime** (pick one) | Vercel-compatible managed real-time layer for SDP/ICE exchange + room presence only — carries no media |
| NAT Traversal | Public **STUN** (e.g., Google STUN), managed **TURN** fallback (e.g., Twilio Network Traversal, Metered, or self-hosted coturn) | Needed for connections behind restrictive NATs/firewalls |
| Local Persistence | **IndexedDB** (via `idb-keyval` or `Dexie.js`), `localStorage` for preferences | No server DB needed in MVP |
| State Management | React Context + hooks (per-module), optionally **Zustand** for cross-cutting state | Keeps modules decoupled |
| File Export Utilities | **JSZip** (optional batch zip export), native Canvas `toBlob` | High-quality PNG/JPEG export |
| Testing | **Jest / Vitest** (unit), **React Testing Library** (component), **Playwright** (e2e) | CI-gated |
| Linting/Formatting | **ESLint**, **Prettier**, **Husky** + `lint-staged` | Enforced pre-commit and in CI |
| CI/CD | **GitHub Actions** + **Vercel** | Auto preview deploys per PR, production deploy on merge to `main` |
| Version Control | **Git + GitHub** | Trunk-based or Git Flow (see Section 12) |
| Analytics (optional) | **Vercel Analytics** (privacy-respecting) | No PII / photo data collected |
| PWA (future) | `next-pwa` or manual service worker + manifest | Phase 8 |

---

## 10. System Architecture & Project Structure (OOP-Based, Modular)

### 10.1 Architectural Principles
- **Single Responsibility**: Every class/service handles one concern (e.g., `CameraService` only manages media streams, `RoomService` only manages room lifecycle/presence, `PeerConnectionManager` only manages the WebRTC connection).
- **Encapsulation**: Internal state (e.g., active MediaStream, RTCPeerConnection instance, canvas buffers) is private to its service class, exposed via clear public methods.
- **Interface-based extensibility**: Filters (`IFilter`), Layouts (`LayoutStrategy`), Layers (`Layer` base class), and dual-frame composition (`CompositeStrategy`) are defined as interfaces/abstract classes so new implementations plug in without touching core logic (Open/Closed Principle).
- **Composition over inheritance** in UI components; **inheritance/interfaces** used in core engines (filters, layouts, layers, composites) where polymorphism adds real value.
- **Dependency inversion**: React hooks/components depend on service *interfaces*, not concrete implementations, easing testing/mocking — e.g., `RoomService` is defined against a generic real-time transport interface so the underlying signaling provider (Ably/Pusher/PartyKit) can be swapped without touching UI code.
- **Transport-agnostic signaling**: All WebRTC signaling logic goes through a small adapter interface (`ISignalingTransport`) so the specific real-time vendor is an implementation detail, not a hard dependency baked into core logic.

### 10.2 Recommended Folder Structure

```
pola-go/
├── .github/
│   ├── workflows/              # CI/CD pipelines (lint, test, build, deploy)
│   ├── ISSUE_TEMPLATE/
│   └── PULL_REQUEST_TEMPLATE.md
├── public/
│   ├── assets/
│   │   ├── stickers/
│   │   ├── frames/              # includes couple/heart/long-distance themed frames
│   │   └── sounds/
│   └── manifest.json           # PWA manifest (future)
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (marketing)/        # Landing page, about, etc. (SSR/SSG)
│   │   ├── room/
│   │   │   ├── new/             # "Create a Room" flow
│   │   │   └── [roomId]/        # Join/booth experience for a specific room (CSR)
│   │   ├── gallery/             # Session gallery view (per-room, per-device)
│   │   ├── settings/            # Preferences page
│   │   └── layout.tsx
│   ├── components/             # Reusable, presentational UI components
│   │   ├── ui/                 # Buttons, Modals, Sliders, Cards (design system)
│   │   ├── room/                # RoomShareCard, WaitingForPartner, ConnectionStatusBadge
│   │   ├── booth/               # BoothStage, ShutterButton, CountdownOverlay, ReadyButton
│   │   ├── filters/             # FilterCarousel, AdjustmentSliders
│   │   ├── decoration/          # StickerPicker, TextEditor, FramePicker
│   │   └── gallery/              # GalleryGrid, PhotoCard, StripPreview
│   ├── core/                   # OOP domain/service layer (framework-agnostic)
│   │   ├── room/
│   │   │   ├── RoomService.ts
│   │   │   ├── ISignalingTransport.ts
│   │   │   └── transports/
│   │   │       └── AblyTransport.ts   # (or PusherTransport / PartyKitTransport)
│   │   ├── peer/
│   │   │   └── PeerConnectionManager.ts
│   │   ├── camera/
│   │   │   └── CameraService.ts
│   │   ├── compositor/
│   │   │   ├── CompositeStrategy.ts
│   │   │   └── implementations/
│   │   │       ├── SplitScreenComposite.ts
│   │   │       ├── PictureInPictureComposite.ts
│   │   │       └── HeartFrameComposite.ts
│   │   ├── filters/
│   │   │   ├── IFilter.ts
│   │   │   ├── FilterRegistry.ts
│   │   │   └── implementations/
│   │   │       ├── VintageFilter.ts
│   │   │       ├── SepiaFilter.ts
│   │   │       └── ...
│   │   ├── decoration/
│   │   │   ├── Layer.ts
│   │   │   ├── StickerLayer.ts
│   │   │   ├── TextLayer.ts
│   │   │   └── FrameLayer.ts
│   │   ├── layout/
│   │   │   ├── LayoutStrategy.ts
│   │   │   └── implementations/
│   │   │       ├── SingleLayout.ts
│   │   │       ├── Strip3Layout.ts
│   │   │       └── GridLayout.ts
│   │   ├── export/
│   │   │   └── ExportService.ts
│   │   ├── gallery/
│   │   │   └── GalleryManager.ts
│   │   └── preferences/
│   │       └── PreferencesService.ts
│   ├── hooks/                   # React hooks bridging core services to UI
│   │   ├── useRoom.ts
│   │   ├── usePeerConnection.ts
│   │   ├── useCamera.ts
│   │   ├── useCompositor.ts
│   │   ├── useFilterEngine.ts
│   │   ├── useDecorationCanvas.ts
│   │   ├── useExport.ts
│   │   └── useGallery.ts
│   ├── context/                 # React Context providers (Room/Session, Theme, Preferences)
│   ├── lib/                     # Generic utilities (formatDate, generateFilename, etc.)
│   ├── styles/                  # Tailwind config extensions, design tokens, globals.css
│   └── types/                   # Shared TypeScript types/interfaces
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── PROJECT_SUMMARY.md            # Agentic dev log (see Section 11)
├── CHANGELOG.md
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── Project_SRS.md                # This document
├── README.md
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.js
```

### 10.3 Core Class Sketches (Illustrative)

```typescript
// core/filters/IFilter.ts
export interface IFilter {
  id: string;
  label: string;
  thumbnail: string;
  apply(ctx: CanvasRenderingContext2D, width: number, height: number): void;
}

// core/filters/FilterRegistry.ts
export class FilterRegistry {
  private static filters = new Map<string, IFilter>();
  static register(filter: IFilter): void { this.filters.set(filter.id, filter); }
  static get(id: string): IFilter | undefined { return this.filters.get(id); }
  static list(): IFilter[] { return Array.from(this.filters.values()); }
}

// core/layout/LayoutStrategy.ts
export abstract class LayoutStrategy {
  abstract compose(frames: HTMLCanvasElement[], target: HTMLCanvasElement): void;
}

// core/decoration/Layer.ts
export abstract class Layer {
  constructor(public x: number, public y: number, public rotation = 0, public scale = 1) {}
  abstract render(ctx: CanvasRenderingContext2D): void;
}

// core/room/ISignalingTransport.ts — decouples RoomService from any specific vendor
export interface ISignalingTransport {
  connect(roomId: string): Promise<void>;
  send(event: string, payload: unknown): void;
  on(event: string, handler: (payload: unknown) => void): void;
  disconnect(): void;
}

// core/room/RoomService.ts
export class RoomService {
  constructor(private transport: ISignalingTransport) {}
  async createRoom(): Promise<string> { /* generates slug, connects transport, returns room link */ return ""; }
  async joinRoom(roomId: string): Promise<void> { /* connects transport to existing room */ }
  onPartnerJoined(handler: () => void): void { this.transport.on("partner-joined", handler); }
  endRoom(): void { this.transport.disconnect(); }
}

// core/peer/PeerConnectionManager.ts
export class PeerConnectionManager {
  private connection: RTCPeerConnection;
  constructor(private signaling: ISignalingTransport) {
    this.connection = new RTCPeerConnection({ iceServers: [/* STUN/TURN config */] });
  }
  attachLocalStream(stream: MediaStream): void { /* add tracks to connection */ }
  onRemoteStream(handler: (stream: MediaStream) => void): void { /* wire ontrack */ }
  sendData(payload: unknown): void { /* send over RTCDataChannel, e.g. countdown sync */ }
}

// core/compositor/CompositeStrategy.ts
export abstract class CompositeStrategy {
  abstract compose(
    localFrame: HTMLCanvasElement,
    remoteFrame: HTMLCanvasElement,
    target: HTMLCanvasElement
  ): void;
}
```
This pattern is repeated for `CameraService`, `ExportService`, and `GalleryManager`, each exposing a clean public API and hiding internal state — satisfying encapsulation, and allowing each to be unit-tested in isolation from React. Notice that `RoomService` and `PeerConnectionManager` depend on the `ISignalingTransport` interface rather than a concrete vendor SDK — swapping Ably for PartyKit later only means writing a new transport adapter, not touching room/peer/UI logic.

---

## 11. Agentic Development & Progress Summary Protocol

Since POLA GO will be built using an **agentic (AI-assisted) development approach**, continuity across sessions must be preserved through structured logging.

### 11.1 `PROJECT_SUMMARY.md` — Rules
- Must exist at the project root from the very first commit.
- Must be updated **after every completed agentic task/session** (not just at milestones).
- Each entry must include:
  - **Date/Session ID**
  - **Task(s) completed** (mapped to WBS item in Section 8)
  - **Files created/modified**
  - **Decisions made** (e.g., "chose Canvas over WebGL for filters due to browser support")
  - **Known issues / TODOs carried forward**
  - **Next recommended task**

### 11.2 Suggested Entry Template
```markdown
## [YYYY-MM-DD] Session: <short title>
**Completed:**
- Implemented CameraService with start/stop/switch camera methods
- Added useCamera hook and wired to BoothStage component

**Files touched:**
- src/core/camera/CameraService.ts (new)
- src/hooks/useCamera.ts (new)
- src/app/booth/page.tsx (modified)

**Decisions:**
- Used getUserMedia with facingMode constraint for camera switching instead of enumerateDevices, for simplicity in v1.

**Known issues / TODO:**
- Error UI for permission-denied state not yet styled (cute theme pending)

**Next recommended task:**
- Build CountdownOverlay component (WBS 8.3)
```

### 11.3 Additional Agentic Practices
- Every agentic coding session should reference the WBS (Section 8) task IDs it is addressing.
- `CHANGELOG.md` should be updated at each meaningful release/tag (semantic versioning: `MAJOR.MINOR.PATCH`).
- Before starting new work, the agent should read `PROJECT_SUMMARY.md` to reconstruct context instead of re-deriving it from scratch.

---

## 12. Git & Deployment Workflow

### 12.1 Branching Strategy
- `main` — always production-ready, auto-deploys to Vercel Production.
- `develop` — integration branch for in-progress features, auto-deploys to a Vercel Preview environment.
- `feature/<module-name>` — one branch per module/task (e.g., `feature/filter-engine`).
- `fix/<bug-name>` — bug fix branches.

### 12.2 Pull Request Process
1. Branch off `develop`.
2. Implement task from WBS (Section 8), update `PROJECT_SUMMARY.md`.
3. Ensure lint, unit tests, and build pass locally.
4. Open PR → triggers GitHub Actions (lint, test, build) → generates Vercel Preview URL.
5. Code review (self-review acceptable for solo/agentic dev, but checklist-based).
6. Merge to `develop`; periodically merge `develop` → `main` for releases.

### 12.3 Testing Gates Before Deployment
- ✅ Unit tests pass (services/modules)
- ✅ Integration tests pass (core user flows)
- ✅ E2E smoke test passes (capture → filter → export)
- ✅ Manual cross-browser check on at least Chrome + Safari (mobile)
- ✅ Lighthouse performance/accessibility score reviewed

### 12.4 Vercel Deployment
- Connect GitHub repo to Vercel project.
- Environment variables (if any, e.g., analytics keys) configured in Vercel dashboard, never committed.
- Every PR gets a unique Preview Deployment URL for QA before merge.
- `main` branch merges auto-deploy to Production.

---

## 13. README.md Requirements

The `README.md` must be created **from project inception** and must include:

1. **Project Title & Tagline** (POLA GO — "Snap. Style. Save the Moment.")
2. **Badges** (build status, license, Vercel deployment status, contributors welcome)
3. **Demo Screenshot/GIF** of the booth UI
4. **Overview** — what POLA GO is and who it's for
5. **Features List** (bullet summary of Section 3 & 6)
6. **Tech Stack** (Section 9 summary)
7. **Live Demo Link** (Vercel production URL)
8. **Getting Started / Installation**:
   ```bash
   git clone https://github.com/<org>/pola-go.git
   cd pola-go
   npm install
   npm run dev
   ```
9. **Project Structure Overview** (condensed version of Section 10.2)
10. **How It Works** (high-level flow: Camera → Filter → Decorate → Export)
11. **Contributing Guide** (link to `CONTRIBUTING.md`)
12. **Roadmap** (condensed Section 7 phases, with checkboxes for completed phases)
13. **License** (MIT recommended)
14. **Acknowledgements**
15. **Contact / Community** (GitHub Discussions/Issues link)

*(A starter README.md is provided as a companion deliverable alongside this SRS.)*

---

## 14. Appendices

### 14.1 Assumptions
- Both users have a device with a functioning camera and a modern, evergreen, WebRTC-capable browser.
- Both users have a reasonably stable internet connection for the duration of the session.
- No backend database is required for MVP beyond a lightweight, ephemeral signaling/presence layer; all photo processing remains client-side.
- Open-source license (MIT) is acceptable to the project owner.
- A managed real-time signaling provider's free/low-cost tier is acceptable for MVP traffic volumes; scaling to a self-hosted solution is a later-phase concern.

### 14.2 Risks & Mitigations
| Risk | Impact | Mitigation |
|---|---|---|
| WebRTC connection failure behind restrictive corporate/mobile NATs | High | TURN relay fallback; clear "trying to connect..." messaging with retry |
| Perceived "unsynced" feeling if network latency is high between partners | Medium | Shared countdown as the primary sync mechanic (not frame-perfect sync); latency-compensation buffer (NFR-16) |
| Browser camera/WebRTC API inconsistencies across devices | Medium | Extensive cross-browser and cross-device testing; graceful fallback messaging |
| Large canvas/compositing operations causing UI jank on low-end mobile devices | Medium | Use `OffscreenCanvas`/Web Workers for heavy filter/compositing processing where supported |
| Signaling provider vendor lock-in | Low–Medium | `ISignalingTransport` abstraction (Section 10.3) keeps the vendor swappable |
| Scope creep from "additional features" list | Medium | Strict phase-gating; v1 MVP locked to Sections 3.0–3.9 only |
| Asset licensing for stickers/fonts | Low | Use only open-license fonts (Google Fonts) and self-created/CC0 sticker assets |
| Privacy concerns around two-person video sessions | Medium | Peer-to-peer media only (never server-relayed/stored), unguessable room links, auto-expiry (NFR-17) |

### 14.3 Glossary
See Section 1.4.

### 14.4 Document Control
This SRS is a living document. Any material scope change must be reflected here and referenced in `PROJECT_SUMMARY.md` and `CHANGELOG.md`.

---
**End of Document — Project_SRS.md — POLA GO v1.0**
