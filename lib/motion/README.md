# `lib/motion` — Reserved for Remotion (M-Motion)

This folder is the **architectural boundary** for DR Branding OS's coded video render layer. It is intentionally empty until **Milestone M-Motion** ships.

When M-Motion ships, all Remotion code lives **only here** (and in `app/api/motion/*`). No other part of the OS imports `remotion` or any Remotion package directly.

---

## The two creative paths — kept separate

DR Branding OS supports two distinct ways to produce video. The architecture must never blur them.

| Path | Lives in | What it does |
| --- | --- | --- |
| **Coded branded motion** | `lib/motion/` *(this folder)* | Remotion-based templates. Programmatic, on-brand, render-deterministic. Logo intros, lower-thirds, animated captions, report videos, promo videos, carousel-to-video. |
| **AI-generated video scenes** | `lib/ai/providers/` *(future)* | Runway, Luma, Kling. Prompt-driven, generative, non-deterministic. Cinematic shots, B-roll, abstract visuals. |

**Mental model:**

- **Remotion** = *coded* branded motion templates (you control every pixel).
- **Runway / Luma / Kling** = *AI-generated* video scenes (you steer with prompts).

A Remotion template is a React component compiled to MP4 — fully controlled, brand-safe, repeatable. An AI scene is a prompt sent to a hosted model — creative, unpredictable, off-brand by default. Code that calls one must never call the other in the same file. UI may compose both, but the lib layer keeps them in separate trees.

---

## Milestone M-Motion — Specification

### Goal

Add a Remotion-powered video template engine to DR Branding OS that lets Adam render branded videos for clients, on demand, with deterministic output.

### Use cases (all in scope for M-Motion)

1. Branded animated text videos
2. Carousel-to-video conversion
3. Logo intro animations
4. Restaurant promo videos
5. Product promo videos
6. Monthly report videos
7. Client approval preview videos
8. Animated captions

### What gets built

- Remotion setup (dependency install, config, server-render plumbing)
- Template library structure with versioning and registry
- **Brand Intro** template
- **Text Animation** template (typography motion)
- **Carousel-to-Video** template (slide deck → vertical video)
- **Promo Video** template (parameterized for restaurant / product variants)
- **Report Video** template (auto-generates from `Report` data)
- Live preview system (timeline scrubber, frame stepping, prop editing)
- MP4 export workflow (job queue, progress, downloadable artifact)

### Inputs the render layer accepts

The render layer is downstream of the creative studios. It accepts only typed `RenderJob` payloads — never raw form data. This keeps studios swappable and the render boundary clean.

```
RenderJob {
  templateKey: 'brand-intro' | 'text-animation' | 'carousel-to-video' |
               'promo-video' | 'report-video' | 'animated-captions' | ...
  clientId: ID
  brand: BrandKit                    // logo, palette, fonts, voiceNotes
  props: TemplateProps               // template-specific schema (zod-validated)
  outputs: { format: 'mp4', resolution, fps, aspectRatio }
}
```

`brand` is sourced from `Client.brandKit` and passed as a single bundle. `props` is per-template and schema-validated before render starts.

### Upstream studios that produce RenderJobs

- **Motion Video Studio** → storyboard / scene plan → `promo-video`, `brand-intro`
- **Text Animation Studio** → typography spec → `text-animation`, `animated-captions`
- **Carousel Studio** → slide bundle → `carousel-to-video`
- **Reports** → monthly KPIs → `report-video`
- **Campaign Builder** → campaign brief → any promo template
- **Client Approvals** → preview render of any pending content → `approval-preview`

Each upstream studio exports a typed `RenderJob`. The render layer never imports studio internals.

---

## Architecture rules (enforced)

1. **Module isolation.** All Remotion code lives in `lib/motion/*` and `app/api/motion/*`. Importing `remotion` from anywhere else fails review.
2. **No mixing with AI prompt generation.** `lib/motion/` and `lib/ai/providers/` never share files. UI may compose outputs from both, but lib code stays separated.
3. **Brand data is the only client-side input.** Templates pull from `Client.brandKit` (logo, colors, typography, images), `Client.brief.voiceNotes`, content captions, and structured scripts. No ad-hoc fields.
4. **Server-only render.** The browser never imports Remotion. All renders run in `app/api/motion/*` route handlers (or Remotion Lambda, when scaled).
5. **No keys in the frontend.** Render service credentials, S3 / storage keys, and Lambda keys live in `.env.local` (server-only) and are referenced by API routes only.
6. **Schema-validated props.** Every template ships a zod schema for its props. Renders fail fast with a clear validation error before any frame is computed.
7. **Versioned templates.** Each template has a semver and a frozen registry entry. Old jobs replay against their pinned version.

---

## Future folder shape

```
lib/motion/
  README.md                        ← this file
  index.ts                         registry barrel
  registry.ts                      typed export of all templates + versions
  types.ts                         Template, TemplateProps, RenderJob, RenderStatus
  brand/
    apply-brand-kit.ts             Client.brandKit → template props
    fonts.ts                       brand font loader (server)
  templates/
    brand-intro/
      Composition.tsx
      schema.ts                    zod props schema
      thumbnail.png
      version.ts
    text-animation/
    carousel-to-video/
    promo-video/
      restaurant/                  variant
      product/                     variant
    report-video/
    animated-captions/
    approval-preview/
  preview/
    PlayerShell.tsx                client-side <Player /> wrapper
    timeline.ts                    scrubber + frame stepping helpers
  render/
    queue.ts                       in-process render queue
    server-render.ts               Remotion CLI / Lambda adapter
    artifacts.ts                   MP4 storage + signed URL issuance

app/api/motion/                    server-only render endpoints
  render/route.ts                  POST → enqueue render
  status/[jobId]/route.ts          GET → job progress
  artifact/[jobId]/route.ts        GET → signed download URL
```

The `app/(shell)/motion-template-studio/page.tsx` route is the UI surface. It imports from `lib/motion/registry` (template metadata) and from `preview/PlayerShell` (preview), but never imports `remotion` directly.

---

## Why this is documented but not built

- Locks the design intent so we don't drift when M-Motion finally lands.
- Reserves the namespace and the `/motion-template-studio` route — already shipped in M1.
- Keeps M2 and M3 unblocked. The workflow engine and client detail hub need to ship first; the render layer is downstream.

When ready, M-Motion is added with one dependency install (`remotion`, `@remotion/cli`, `@remotion/player`, optional `@remotion/lambda`) and code lands only inside this folder and `app/api/motion/*`. Nothing upstream changes.
