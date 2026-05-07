# DR Branding OS

The premium AI Marketing Operating System for **DR Branding** — a single workspace to manage clients, run repeatable workflows, produce content, and ship campaigns.

> **Status:** Milestone 1 — Premium UI shell + Clients module live on local storage.

---

## Quickstart

```bash
# 1. Install dependencies
npm install

# 2. Run the dev server
npm run dev

# 3. Open http://localhost:3000
```

Optional:

```bash
npm run typecheck   # strict TypeScript check
npm run lint        # next lint
npm run build       # production build
```

Copy `.env.local.example` → `.env.local` to prepare for future integrations. **No API keys are required for Milestone 1.**

---

## What's in Milestone 1

- Premium dark-default UI shell (Sidebar, Topbar, Command Palette ⌘K)
- All 17 navigation routes scaffolded (incl. four creative studios reserved for the motion path)
- Dashboard with KPI grid, Active Workflows, Today, Pending Approvals (mock data)
- **Clients module — fully working CRUD** wired to local storage through a swappable adapter
- Settings page with theme + density toggles, persisted across sessions
- Type system, data adapter, repository layer, Zustand stores — all production-shape
- Champagne-on-near-black palette, Geist-style typography, hairline borders, restrained motion
- Reserved `lib/motion/` namespace for the future Remotion render layer (no dependency installed)

What's intentionally **not** built yet: workflow engine, AI calls, content/script/video studios, calendar, messages, reports, n8n builder, **Remotion render layer**. The shells are wired and waiting.

---

## Architecture principles

| Principle | What it means |
| --- | --- |
| **Feature-modular** | Each major nav item is its own folder under `app/(shell)/*` and `components/<feature>/*`. |
| **Repository pattern** | UI never touches storage directly — it goes through `clientRepo`, `workflowRepo`, etc. Repos use a `DataAdapter`. |
| **Adapter swap** | `lib/db/index.ts` exports `db`, currently `localAdapter`. Swap to a Supabase adapter when ready — UI stays untouched. |
| **Server-only AI** | All AI calls will go through `app/api/ai/*` route handlers. Keys never reach the browser. |
| **Motion isolation** | Coded video (Remotion) lives only in `lib/motion/*`. AI video (Runway / Luma / Kling) lives only in `lib/ai/providers/*`. They never share files. |
| **Type-first** | `/types/*` is the single source of truth for entity shapes. |
| **Premium restraint** | One accent color (champagne), no decorative gradients, motion only where it serves clarity. |

---

## Folder map

```
app/
  (shell)/                  authed routes wrapped in AppShell
    dashboard/              KPIs, active workflows, today, approvals
    clients/                list + detail (working CRUD)
    workflows/              Workflow Command Center (M3)

    strategy-lab/           Production · (M4)
    content-studio/         Production · (M4)
    carousel-studio/        Production · Carousel planning (placeholder)
    reel-script-studio/     Production · (M4)

    motion-video-studio/    Motion · Branded animated marketing videos (placeholder)
    text-animation-studio/  Motion · Quote / typography videos (placeholder)
    ai-video-prompt-studio/ Motion · Runway / Luma / Kling prompts (M5)
    motion-template-studio/ Motion · Reserved for future Remotion render layer

    campaign-builder/       Operations · (M5)
    content-calendar/       Operations · (M5)
    messages/               Operations · (M6)
    reports/                Operations · (M6)
    n8n-builder/            Operations · (M7)
    settings/               profile, theme, density, integrations
    layout.tsx              wraps children in <AppShell>
  layout.tsx                root html/body
  page.tsx                  redirects → /dashboard
  globals.css               tokens, base, components

components/
  ui/                       primitives: button, input, dialog, dropdown-menu,
                            badge, card, switch, separator, label, textarea,
                            skeleton
  layout/                   AppShell, Sidebar, Topbar, CommandPalette,
                            BrandMark, nav-config
  shared/                   PageContainer, PageHeader, KpiCard, EmptyState,
                            StatusBadge, SectionCard, ScopePreview
  clients/                  ClientsBoard, ClientRow, ClientFormDialog,
                            ClientDetailView
  settings/                 SettingsPanel

lib/
  utils.ts                  cn(), slugify(), uid(), nowIso(), formatRelative()
  db/
    adapter.ts              DataAdapter interface
    local-adapter.ts        localStorage implementation
    index.ts                exports the active adapter as `db`
    repos/
      clientRepo.ts
      workflowRepo.ts
      index.ts
  motion/                   reserved for future Remotion render layer
    README.md               architectural boundary + future folder shape
    index.ts                empty namespace marker (no Remotion installed)

types/
  index.ts                  re-export
  common.ts                 ID, ISODate, Status, Timestamps, ThemeMode, DensityMode
  client.ts                 Client, ClientCreateInput, ClientUpdateInput, ...
  workflow.ts               WorkflowDefinition, WorkflowInstance, stages, steps
  content.ts                ContentItem, ContentType, Platform
  campaign.ts               Campaign, CampaignMilestone
  report.ts                 Report, ReportKpi

store/
  useUiStore.ts             theme, density, sidebar, command palette
  useClientsStore.ts        clients list + CRUD actions
```

---

## Theme tokens

All colors live in CSS variables in `app/globals.css`. Tailwind classes map to those variables (`bg-bg-base`, `bg-bg-surface`, `text-fg`, `text-fg-muted`, `text-accent`, `border-border`, etc.).

Two themes are wired: `dark` (default) and `light`. Two densities: `comfortable` (default) and `compact`. Both are user-toggleable on the Settings page and persisted via Zustand.

---

## Data layer

```ts
// Repos hide the adapter
import { clientRepo } from "@/lib/db/repos";

const all = await clientRepo.list();
const created = await clientRepo.create({ name: "Atelier Noir", ... });
await clientRepo.update(id, { status: "paused" });
await clientRepo.archive(id);
```

To migrate to Supabase later, implement the `DataAdapter` interface against Supabase and swap the export in `lib/db/index.ts`. UI code does not change.

---

## Future Remotion Integration

DR Branding OS supports two distinct creative paths for video. They must stay architecturally separate.

| Path | Technology | What it produces |
| --- | --- | --- |
| **Coded branded motion** | **Remotion** *(future, `lib/motion/`)* | Programmatic, on-brand, render-deterministic video. Logo intros, lower-thirds, animated captions, monthly report videos, promo videos, carousel-to-video. |
| **AI-generated video scenes** | **Runway / Luma / Kling** *(`lib/ai/providers/`)* | Prompt-driven, generative, non-deterministic. Cinematic shots, B-roll, abstract visuals. |

**Mental model:**
- Remotion = *coded* branded motion templates (you control every pixel).
- Runway / Luma / Kling = *AI-generated* video scenes (you steer with prompts).

### Studios involved

- **Carousel Studio** — slide-by-slide carousel planning. Outputs feed Calendar and Approvals.
- **Motion Video Studio** — storyboards, scenes, overlays, motion direction, cover concepts. Output feeds Motion Template Studio for render.
- **Text Animation Studio** — typography motion specs (quotes, titles). Output feeds Motion Template Studio for render.
- **AI Video Prompt Studio** — Runway / Luma / Kling prompts. Output is sent to AI providers, not Remotion.
- **Motion Template Studio** — picks a Remotion template, fills props from upstream studios, kicks off the render.

### Isolation rules

1. Remotion is installed only when M-Motion ships. No Remotion code lives outside `lib/motion/`.
2. AI provider SDKs live only in `lib/ai/providers/`. Never imported from `lib/motion/`.
3. The browser never imports Remotion directly — renders happen server-side via `app/api/motion/*` route handlers (future).
4. Each upstream studio exports a typed `RenderJob` payload. The render layer accepts only `RenderJob`. This keeps studios swappable.

See [`lib/motion/README.md`](./lib/motion/README.md) for the full future folder shape and design intent.

---

## Milestone roadmap

- **M1 — Premium UI shell + Clients module** ✅ *(this release, includes new studio placeholders + Remotion architectural reservation)*
- **M2** — Client detail hub: brand kit, brief, history
- **M3** — Workflow engine + Workflow Command Center (3 workflows live: onboarding, weekly content, approval)
- **M4** — Strategy Lab, Content Studio, Carousel Studio, Reel Script Studio
- **M5** — Motion Video Studio, Text Animation Studio, AI Video Prompt Studio, Campaign Builder, Content Calendar
- **M-Motion — Remotion Motion Template Engine** *(spec locked, see [`lib/motion/README.md`](./lib/motion/README.md))*
  - **Use cases:** branded animated text videos, carousel-to-video, logo intros, restaurant promos, product promos, monthly report videos, client approval preview videos, animated captions
  - **Build:** Remotion setup · template library · brand intro · text animation · carousel-to-video · promo video · report video · live preview · MP4 export workflow
  - **Architecture:** all Remotion code isolated in `lib/motion/*` and `app/api/motion/*`; never mixed with AI prompt generation in `lib/ai/providers/*`; brand data only (`Client.brandKit`, captions, scripts); server-only render; no API keys in the frontend
- **M6** — Messages, Reports
- **M7** — n8n Builder, Settings full, Supabase migration

---

## License

Internal — DR Branding.
