# Agents Configuration for Pola Go

## Overview
This document defines the agent configurations for the Pola Go project, a shared virtual photo booth for long-distance couples.

## Core Responsibilities

### 1. Project Structure & Architecture
- Maintain Next.js 16.2.9 App Router project with TypeScript
- Follow OOP core layer pattern (IFilter, LayoutStrategy, Layer)
- Implement modular services: RoomService, PeerConnectionManager, CameraService, CompositeStrategy, Filters, Decorations, Layout, Export, Gallery, Preferences

### 2. Key Features
- **Room & Signaling**: Ably/Pusher/PartyKit/Supabase Realtime integration
- **Real-Time Video**: WebRTC peer connections with STUN fallback
- **Capture Flow**: Local + remote video composition via CompositeStrategy
- **Filter Engine**: 9 filter implementations (Vintage, Sepia, B&W, Pastel Pop, Vivid, Soft Glow, Warm/Cool Tone, Film Grain)
- **Layout Strategies**: Strip4Layout (polaroid), GridLayout, SplitScreen, PiP, HeartFrame
- **Export & Gallery**: PNG/JPEG export, IndexedDB storage, Web Share API
- **UI Components**: BoothStage, CountdownOverlay, ShutterButton, FilterCarousel, StickerPicker

### 3. Technical Debt & TODOs
- **Ably Integration**: Requires `NEXT_PUBLIC_ABLY_API_KEY` in Vercel env vars for cross-device signaling
- **TURN Server**: STUN-only for now; need TURN configuration for NAT traversal
- **E2E Testing**: Need Playwright tests for two-peer room simulation
- **Assets**: Sticker/frame SVGs missing from `public/assets/`
- **Internationalization**: i18n structure not yet implemented (NFR-14)
- **Performance**: PWA manifest and service worker not configured (NFR-15)
- **Design Tokens**: Fonts (Fredoka, Quicksand) and color palette finalized per design system
- **UI/UX Design**: Claymorphism style with specific color palette and accessible design patterns

### 4. Agent Workflow

#### Agent Types
- **Code Reviewer**: Evaluates code quality, follows requesting-code-review skill
- **Brainstormer**: Generates feature ideas, architectural improvements
- **Debugger**: Identifies and resolves bugs (systematic-debugging skill)
- **Planner**: Breaks down tasks, creates WBS, sets milestones

#### Current Status
- ✅ Project scaffolded (Next.js + TS + Tailwind)
- ✅ Core services implemented (RoomService, PeerConnectionManager, CameraService, etc.)
- ✅ React hooks and context providers in place
- ✅ UI/UX design system established with Claymorphism style
- ⏳ Ably signaling provider integration pending (environment variable configuration)
- ⏳ E2E tests for two-peer rooms needed
- ⏳ Design tokens/fonts finalized
- ⏳ PWA manifest/service worker not configured

## Recommended Next Steps

### 1. Configure Ably Signaling
- Add `NEXT_PUBLIC_ABLY_API_KEY` to Vercel environment variables
- Replace InMemoryTransport with AblyTransport in production

### 2. Implement E2E Tests
- Write Playwright tests for two-peer room simulation
- Test capture → filter → export flow end-to-end

### 3. Add Missing Assets
- Create sticker/frame SVG assets in `public/assets/`
- Finalize design tokens (colors, typography) per Claymorphism design system

### 4. Internationalization
- Set up i18n structure (NFR-14)
- Translate UI strings

### 5. PWA Enhancement
- Add service worker for offline capability
- Generate PWA manifest

## UI/UX Design Intelligence (from ui-ux-pro-max Skill)

### Design System Summary
- **Style**: Claymorphism - chunky, playful, soft 3D with thick borders (3-4px), double shadows, rounded corners (16-24px)
- **Primary Color**: #F97316 (orange) - bold, playful accent
- **Secondary Color**: #FB923C (warm yellow)
- **Accent/CTA**: #2563EB (trust blue)
- **Background**: #FFF7ED (warm off-white)
- **Foreground**: #9A3412 (deep orange for text)
- **Fonts**: Fredoka (headings) + Nunito (body) from Google Fonts
- **Mood**: playful, friendly, fun, creative, warm, approachable

### Critical Accessibility Requirements
- Minimum 4.5:1 contrast ratio (AA) for normal text against backgrounds
- 3:1 contrast ratio for focus states
- Visible focus rings on interactive elements (2-4px)
- No emoji as structural icons - use SVG from Heroicons/Lucide
- Proper ARIA labels for icon-only buttons
- Keyboard navigation must work for all interactive elements
- Respect prefers-reduced-motion setting

### Performance Requirements (Next.js)
- Use `next/image` component for all images (automatic optimization, lazy loading)
- Reserve space for dynamic content to prevent CLS
- Use bundle analyzer (`ANALYZE=true npm run build`)
- Dynamic imports for heavy components
- Partial Prerendering for combining static/dynamic content

### Interaction Guidelines
- Touch targets minimum 44px, preferably 48px
- Provide hover/focus/pressed states with smooth transitions (150-300ms)
- cursor-pointer on all clickable elements
- Micro-interaction timing uses shared tokens for responsiveness
- No horizontal scroll on mobile

## File Locations
- Source: `src/` (core services, hooks, components)
- Tests: `src/**/__tests__/` (unit tests)
- Config: `src/lib/`, `src/app/`, `src/context/`
- Docs: `PROJECT_SUMMARY.md`, `AGENTS.md`, `design-system/pola-go/MASTER.md`

## Contact
- Repository: https://github.com/real-ds/PolaGo
- Deployment: https://pola-go.vercel.app