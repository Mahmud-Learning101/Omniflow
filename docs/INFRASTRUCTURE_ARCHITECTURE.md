# OmniFlow Infrastructure & Architecture Specification
### *The Engineering Standard for Automated Infrastructure & Awwwards Multi-Engine Design*

---

## 🏛️ 1. The 4-Layer Hybrid Stack

OmniFlow synthesizes the invariant automated cloud chassis with three legendary Awwwards visual engines:

```
┌────────────────────────────────────────────────────────┐
│ LAYER 1: THE PRESENTATION SURFACE (DOM + WebGL)        │
│ • Segment 1: Lando Norris Fluid Canvas & Mona Sans     │
│ • Segment 2: Igloo Inc. Procedural Refraction Shaders  │
│ • Segment 3: Messenger Spherical 3D Micro-World        │
├────────────────────────────────────────────────────────┤
│ LAYER 2: THE CREATIVE RUNTIME & SYNC ENGINE            │
│ • Central RequestAnimationFrame Clock                  │
│ • Lenis Virtual Smooth Momentum Scroll                 │
│ • Three.js / React Three Fiber Canvas Bridge           │
├────────────────────────────────────────────────────────┤
│ LAYER 3: REAL-TIME TELEMETRY & MULTIPLAYER NETWORK     │
│ • WebSocket Delta Broadcaster                          │
│ • Live Avatar Coordinates (15Hz Lerp Interpolation)    │
│ • Real-time Business Telemetry (Sales & Inquiries)     │
├────────────────────────────────────────────────────────┤
│ LAYER 4: THE INVARIANT 85% INFRASTRUCTURE CHASSIS       │
│ • Single Source of Truth (src/config/site.ts)          │
│ • GitHub Actions CI/CD Pipeline                        │
│ • Playwright E2E Headless WebGL Testing Suite          │
│ • Vercel Global Edge CDN + MongoDB Atlas (Cached Pool) │
└────────────────────────────────────────────────────────┘
```

---

## ⚡ 2. Progressive 3-Stage Bootstrapping Pipeline

To prevent 3D assets and shaders from causing frame drops or slow mobile loading:

1. **Stage 1 (0.0s – 0.4s: Instant DOM & Typography)**:
   * Next.js Server Components render HTML and preloaded `MonaSans-VariableFont.woff2`.
   * Users can read headlines immediately with zero layout shift.
2. **Stage 2 (0.4s – 1.0s: Background Shader Compilation)**:
   * WebGL context boots quietly; refractive glass/ice shaders compile in GPU memory while the user reads Segment 1.
3. **Stage 3 (Lazy on Scroll: 3D Spherical World & WebSockets)**:
   * Messenger's 3D planet geometry and live multiplayer WebSocket room download only when the user scrolls toward Segment 3.

---

## 🗂️ 3. Project Directory Map

```
omniflow/
├── .github/workflows/ci-cd.yml       # Cloud testing & deployment gates
├── tests/e2e/                        # Automated Playwright test suite
├── docs/                             # The Executable Specification
│   ├── PROMPT_PLAYBOOK.md            # Prompting formula & self-healing rules
│   ├── INFRASTRUCTURE_ARCHITECTURE.md# This document
│   └── IMPLEMENTATION_PLAN.md        # Step-by-step checklist & issue trackers
├── src/
│   ├── config/                       # Pure data (site.ts, typography.ts, shaders.ts)
│   ├── types/                        # Strict TypeScript & Zod data contracts
│   ├── components/                   # Atomic UI & Engine components (lando, igloo, messenger)
│   ├── hooks/                        # State controllers (useLenis, useFluidScale, useMultiplayer)
│   ├── lib/                          # Infrastructure (db.ts, utils.ts, shaders/)
│   └── app/                          # Next.js App Router (layout.tsx, globals.css, page.tsx)
├── tailwind.config.ts                # Semantic token mapping & custom F1 easing
├── tsconfig.json                     # Strict TypeScript compiler options
└── vercel.json                       # Edge headers & caching rules
```
