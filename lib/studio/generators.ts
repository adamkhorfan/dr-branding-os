/**
 * M4 Studio Generators — template-based content generation.
 * No AI API calls. Uses client brand data to produce on-brand outputs.
 * Replace the bodies with AI API calls in M5+.
 */

import type { Client } from "@/types/client";

// ─── Helpers ────────────────────────────────────────────────────────────────

function tone(client: Client): string {
  return client.brandKit.toneOfVoice || "professional and engaging";
}

function audience(client: Client): string {
  return client.goals.audience || "your target audience";
}

function offers(client: Client): string {
  const o = client.brief.offers.slice(0, 3);
  return o.length ? o.join(", ") : "premium services";
}

function pillars(client: Client): string[] {
  const base = [
    "Brand Story",
    "Behind the Scenes",
    "Client Results",
    "Education & Tips",
    "Product / Service Spotlight",
    "Community & Culture",
  ];
  const industry = client.industry;
  if (industry) {
    return [
      `${industry} Expertise`,
      "Client Transformations",
      "Behind the Brand",
      "Tips & Education",
      "Products & Services",
      "Community Stories",
    ];
  }
  return base;
}

// ─── Strategy Lab generators ────────────────────────────────────────────────

export function generatePositioningStatement(client: Client): string {
  const stmt = client.brandKit.positioningStatement;
  if (stmt) return stmt;
  const pos = client.brief.positioning;
  if (pos) {
    return `${client.name} is the go-to ${client.industry || "brand"} for ${audience(client)} who need ${offers(client)}. We stand for: ${pos}.`;
  }
  return `${client.name} is a ${client.industry || "premium"} brand helping ${audience(client)} achieve real results through ${offers(client)} — delivered with a ${tone(client)} voice.`;
}

export function generateUSPs(client: Client): string {
  const o = client.brief.offers;
  const lines = o.length
    ? o.map((offer, i) => `${i + 1}. ${offer}`)
    : [
        `1. Deep expertise in the ${client.industry || "industry"} space`,
        `2. A ${tone(client)} approach that resonates with ${audience(client)}`,
        `3. Consistent, on-brand content that converts`,
        `4. Results-driven strategy tailored to your goals`,
      ];
  return `Unique Selling Points for ${client.name}:\n\n${lines.join("\n")}`;
}

export function generateContentPillars(client: Client): string {
  const p = pillars(client);
  const lines = p.map((pillar, i) => `Pillar ${i + 1}: ${pillar}`);
  return `Content Pillars for ${client.name}:\n\n${lines.join("\n")}\n\nUse these pillars to plan your weekly content mix. Aim for 1–2 posts per pillar per week.`;
}

export function generateHookTemplates(client: Client): string {
  const aud = audience(client);
  const ind = client.industry || "industry";
  return `Hook Templates for ${client.name}:\n\n` +
    `1. "If you're a ${aud} struggling with [PROBLEM], this is for you."\n` +
    `2. "The #1 mistake ${aud} make in ${ind} — and how to fix it."\n` +
    `3. "Stop doing [WRONG THING]. Here's what actually works."\n` +
    `4. "Nobody talks about this in ${ind}, but it changed everything for our clients."\n` +
    `5. "Here's what [RESULT] actually looks like behind the scenes."\n` +
    `6. "We helped a client go from [BEFORE] to [AFTER] in [TIMEFRAME]."\n` +
    `7. "3 things I wish I knew before starting in ${ind}."\n` +
    `8. "You're probably making this mistake right now. Let me show you."`;
}

export function generateCTABank(client: Client): string {
  const t = tone(client);
  const isWarm = t.toLowerCase().includes("warm") || t.toLowerCase().includes("friend");
  const ctas = isWarm
    ? [
        "Save this for later — you'll thank yourself.",
        "Drop a ❤️ if this resonated with you.",
        "Share this with someone who needs to hear it today.",
        "Comment below: which tip will you try first?",
        "Follow for more real talk about [TOPIC].",
        "DM us 'START' to book your free discovery call.",
        "Click the link in bio to learn more.",
        "Tag a friend who's been asking about this.",
      ]
    : [
        "Contact us today to get started.",
        "Book a consultation via the link in bio.",
        "Follow for weekly insights on [TOPIC].",
        "Share this with your team.",
        "Drop a comment with your biggest challenge.",
        "Save this post for your next strategy session.",
        "DM us for a custom proposal.",
        "Visit our website — link in bio.",
      ];
  return `CTA Bank for ${client.name}:\n\n${ctas.map((c, i) => `${i + 1}. ${c}`).join("\n")}`;
}

// ─── Content Studio generator ───────────────────────────────────────────────

export function generatePost(
  client: Client,
  platform: string,
  contentType: string,
  topic: string,
): string {
  const t = tone(client);
  const aud = audience(client);
  const name = client.name;
  const dos = client.brandKit.contentDos.slice(0, 2).join(", ");

  const hook = `Here's the truth about ${topic || "growing your brand"} that most ${client.industry || "businesses"} miss.`;
  const body = `At ${name}, we work with ${aud} every day — and the pattern is always the same.\n\n` +
    `When it comes to ${topic || "content strategy"}, most people focus on the wrong things.\n\n` +
    `Instead, focus on:\n` +
    `→ Consistency over perfection\n` +
    `→ Value before promotion\n` +
    `→ Authenticity in every post\n\n` +
    (dos ? `Our brand rule: ${dos}.\n\n` : "") +
    `Remember: ${aud} aren't just looking for products — they're looking for someone they trust.`;

  const hashtags = [
    `#${(client.industry || "marketing").replace(/\s+/g, "")}`,
    `#${name.replace(/\s+/g, "")}`,
    "#ContentStrategy",
    "#BrandGrowth",
    "#SocialMedia",
  ].join(" ");

  const caption = platform === "linkedin"
    ? `${hook}\n\n${body}`
    : `${hook}\n\n${body}\n\n.\n.\n.\n${hashtags}`;

  return contentType === "caption"
    ? caption
    : `${caption}\n\n[Visual: On-brand graphic with ${client.brandKit.visualStyle || "clean, minimal design"}]`;
}

// ─── Carousel Studio generator ──────────────────────────────────────────────

export function generateCarousel(
  client: Client,
  topic: string,
  slideCount: number,
): string {
  const slides: string[] = [];

  slides.push(
    `SLIDE 1 — COVER\nTitle: "${topic || "Grow Your Brand in " + new Date().getFullYear()}"\nSubtitle: ${slideCount - 1} things you need to know\nVisual: Bold headline on brand color background`,
  );

  for (let i = 2; i < slideCount; i++) {
    slides.push(
      `SLIDE ${i} — POINT ${i - 1}\nHeadline: [Point ${i - 1} about ${topic}]\nBody: 1–2 sentences explaining this point clearly and concisely.\nVisual: Icon + short copy on clean background`,
    );
  }

  slides.push(
    `SLIDE ${slideCount} — CTA\nHeadline: Ready to get started?\nBody: DM us or click the link in bio.\nVisual: ${client.name} logo + brand palette\n`,
  );

  return `CAROUSEL: "${topic}" — ${client.name}\n${"─".repeat(50)}\n\n${slides.join("\n\n")}`;
}

// ─── Reel Script generator ───────────────────────────────────────────────────

export function generateReelScript(
  client: Client,
  concept: string,
  duration: number,
): string {
  const aud = audience(client);
  const name = client.name;

  const sections = [];

  sections.push(
    `🎬 REEL SCRIPT — ${name.toUpperCase()}\n` +
    `Concept: ${concept || "Brand Story"} | Duration: ${duration}s\n${"─".repeat(50)}\n`,
  );

  sections.push(
    `[0s–3s] HOOK\n` +
    `"${concept ? `You've been thinking about ${concept} the wrong way.` : `Most ${client.industry || "brands"} make this mistake.`}"\n` +
    `Visual: Close-up face / bold text overlay\n`,
  );

  if (duration >= 30) {
    sections.push(
      `[3s–10s] PROBLEM\n` +
      `"${aud} face [SPECIFIC CHALLENGE] every single day. It's costing them time, money, and momentum."\n` +
      `Visual: B-roll showing the problem / relatable scenario\n`,
    );

    sections.push(
      `[10s–${duration <= 30 ? 22 : 30}s] SOLUTION\n` +
      `"At ${name}, we solve this by [YOUR APPROACH]. Here's how it works..."\n` +
      `Visual: Behind-the-scenes / product demo / testimonial clip\n`,
    );
  } else {
    sections.push(
      `[3s–10s] VALUE\n` +
      `"Here's the one thing that changed everything for our clients: [KEY INSIGHT]"\n` +
      `Visual: Text overlay / quick demo\n`,
    );
  }

  if (duration >= 60) {
    sections.push(
      `[30s–50s] PROOF\n` +
      `"Our client [NAME] went from [BEFORE] to [AFTER] in just [TIMEFRAME]."\n` +
      `Visual: Results screenshot / client testimonial / before-after\n`,
    );
  }

  sections.push(
    `[${duration - 8}s–${duration}s] CTA\n` +
    `"If you're ready to [DESIRED OUTCOME], DM us the word START — or tap the link in bio."\n` +
    `Visual: ${name} logo + contact info overlay\n` +
    `Audio: Trending sound or brand-aligned music\n`,
  );

  sections.push(
    `─`.repeat(50) + `\n` +
    `Tone: ${client.brandKit.toneOfVoice || "Professional & Engaging"}\n` +
    `Platform: Instagram / TikTok\n` +
    `Hashtags: #${(client.industry || "Brand").replace(/\s+/g, "")} #${name.replace(/\s+/g, "")} #Reels`,
  );

  return sections.join("\n");
}

// ─── AI Video Prompt generator ───────────────────────────────────────────────

type VideoProvider = "runway" | "luma" | "kling" | "sora";

export function generateVideoPrompt(
  client: Client,
  concept: string,
  provider: VideoProvider,
  shotType: string,
): string {
  const style = client.brandKit.visualStyle || "cinematic, premium, minimal";
  const palette = client.brandKit.palette
    .slice(0, 2)
    .map((p) => p.name || p.hex)
    .join(", ");
  const name = client.name;
  const ind = client.industry || "brand";

  const providerNotes: Record<VideoProvider, string> = {
    runway:
      "Use Gen-3 Alpha Turbo. Keep the prompt under 500 chars. Lead with camera movement.",
    luma:
      "Use Dream Machine. Include subject + action + environment + lighting in that order.",
    kling:
      "Use Kling 1.5. Describe the starting and ending frame explicitly. Add motion speed.",
    sora:
      "Use Sora. Include character descriptions, environment, and emotional tone. Max 1000 chars.",
  };

  const sections = [
    `🎬 AI VIDEO PROMPT — ${name.toUpperCase()}\n` +
      `Provider: ${provider.toUpperCase()} | Shot: ${shotType}\n${"─".repeat(50)}\n`,

    `MAIN PROMPT:\n` +
      `${shotType === "product" ? "Close-up product shot" : shotType === "testimonial" ? "Mid-shot interview setup" : "Cinematic wide shot"}, ` +
      `${concept || `showcasing ${name}'s ${ind} brand`}, ` +
      `${style} aesthetic, ` +
      `${palette ? `color palette: ${palette}, ` : ""}` +
      `professional ${ind} setting, ` +
      `soft volumetric lighting, shallow depth of field, 4K quality\n`,

    `NEGATIVE PROMPT:\nlow quality, blurry, watermark, text overlay, amateur, oversaturated, harsh lighting\n`,

    `SHOT LIST:\n` +
      `Shot 1: Establishing — wide angle, ${concept || "brand hero"} in environment\n` +
      `Shot 2: Feature — close-up detail, product/subject focus\n` +
      `Shot 3: Emotion — medium shot, human element or brand story beat\n` +
      `Shot 4: CTA — pull-back reveal or logo/brand moment\n`,

    `PROVIDER NOTES:\n${providerNotes[provider]}\n`,

    `BRAND CONTEXT:\n` +
      `Visual style: ${style}\n` +
      (client.brandKit.toneOfVoice ? `Tone: ${client.brandKit.toneOfVoice}\n` : "") +
      `Duration: 4–8 seconds per shot (loopable preferred)`,
  ];

  return sections.join("\n");
}

// ─── Motion Video storyboard generator ──────────────────────────────────────

export function generateMotionStoryboard(
  client: Client,
  concept: string,
  sceneCount: number,
  duration: number,
): string {
  const name = client.name;
  const style = client.brandKit.visualStyle || "premium, minimal, modern";
  const palette = client.brandKit.palette.slice(0, 3).map((p) => p.name || p.hex);
  const tone = client.brandKit.toneOfVoice || "professional and confident";

  const secPerScene = Math.floor(duration / sceneCount);
  const sections = [
    `📽 MOTION STORYBOARD — ${name.toUpperCase()}\n` +
      `Concept: ${concept || "Brand Story"} | ${sceneCount} scenes | ${duration}s total\n${"─".repeat(50)}\n`,
  ];

  const sceneTypes = [
    { type: "LOGO INTRO", desc: "Animated logo reveal with brand color wash", motion: "Fade in + scale up, 0.8s ease-out" },
    { type: "HOOK", desc: "Bold statement text or powerful visual", motion: "Slide in from bottom, kinetic typography" },
    { type: "PROBLEM", desc: "Pain point visualization — relatable scenario", motion: "Quick cuts, 0.3s transitions" },
    { type: "SOLUTION", desc: "Brand product/service hero moment", motion: "Slow zoom, parallax overlay" },
    { type: "PROOF", desc: "Client result, statistic, or testimonial", motion: "Counter animation, stagger reveal" },
    { type: "BRAND MOMENT", desc: "Visual identity showcase — palette, typography", motion: "Color wipe, brand gradient overlay" },
    { type: "CTA", desc: "Clear call-to-action with contact/link", motion: "Button pulse, logo lockup, fade out" },
    { type: "END CARD", desc: "Brand name + tagline on brand color background", motion: "Hold 2s, fade to black" },
  ];

  for (let i = 0; i < sceneCount; i++) {
    const scene = sceneTypes[i % sceneTypes.length];
    const start = i * secPerScene;
    const end = (i + 1) * secPerScene;
    sections.push(
      `SCENE ${i + 1} — ${scene.type} [${start}s–${end}s]\n` +
        `Visual: ${scene.desc}\n` +
        `Motion: ${scene.motion}\n` +
        `Copy: [Write ${i === 0 ? "brand name/tagline" : i === sceneCount - 1 ? "CTA" : "short headline max 6 words"} here]\n` +
        `Colors: ${palette.length ? palette.join(" → ") : "Use brand palette"}\n`,
    );
  }

  sections.push(
    `─`.repeat(50) + `\n` +
      `Style Direction: ${style}\n` +
      `Tone: ${tone}\n` +
      `Aspect Ratios: 9:16 (Reels/TikTok) + 1:1 (Feed) + 16:9 (YouTube)\n` +
      `Render: Motion Template Studio (Remotion) — M-Motion milestone`,
  );

  return sections.join("\n");
}

// ─── Text Animation generator ────────────────────────────────────────────────

const ANIMATION_STYLES = {
  stagger: "Letters stagger in one by one from left",
  kinetic: "Words pop with scale bounce, each word timed to beat",
  mask: "Text reveals through sliding mask wipe",
  glitch: "Digital glitch effect with chromatic aberration",
  fade: "Premium slow fade-in with subtle upward drift",
} as const;

const BG_STYLES = {
  gradient: "Brand gradient background (primary → secondary)",
  "brand-color": "Solid primary brand color fill",
  "video-plate": "B-roll video underneath with color overlay",
  dark: "Deep dark background with accent color highlights",
} as const;

export function generateTextAnimation(
  client: Client,
  text: string,
  animationStyle: keyof typeof ANIMATION_STYLES,
  bgStyle: keyof typeof BG_STYLES,
  duration: number,
): string {
  const name = client.name;
  const palette = client.brandKit.palette;
  const primary = palette.find((p) => p.role === "primary")?.hex || palette[0]?.hex || "#ffffff";
  const secondary = palette.find((p) => p.role === "secondary")?.hex || palette[1]?.hex || "#000000";
  const font = client.brandKit.typographyPrimary || "Inter / Helvetica Neue";

  return (
    `✍️ TEXT ANIMATION PLAN — ${name.toUpperCase()}\n` +
    `${"─".repeat(50)}\n\n` +
    `TEXT CONTENT:\n"${text || "[Enter your quote or statement here]"}"\n\n` +
    `ANIMATION STYLE: ${animationStyle.toUpperCase()}\n${ANIMATION_STYLES[animationStyle]}\n\n` +
    `BACKGROUND: ${bgStyle.toUpperCase()}\n${BG_STYLES[bgStyle]}\n\n` +
    `TYPOGRAPHY:\n` +
    `Font: ${font}\n` +
    `Size: 64–80px (mobile), 96–120px (desktop)\n` +
    `Weight: Bold / Black (700–900)\n` +
    `Color: ${bgStyle === "dark" ? "#FFFFFF" : bgStyle === "brand-color" ? "#FFFFFF" : secondary}\n\n` +
    `TIMING (${duration}s total):\n` +
    `0s–0.5s: Background fade in\n` +
    `0.5s–${(duration * 0.7).toFixed(1)}s: Text animation plays\n` +
    `${(duration * 0.7).toFixed(1)}s–${(duration * 0.85).toFixed(1)}s: Hold\n` +
    `${(duration * 0.85).toFixed(1)}s–${duration}s: Fade out\n\n` +
    `COLOR PALETTE:\n` +
    `Primary: ${primary}\n` +
    `Secondary: ${secondary}\n` +
    `Accent overlay opacity: 80%\n\n` +
    `EXPORT SPECS:\n` +
    `Format: MP4 + WebM\n` +
    `Aspect: 9:16 (Reels) + 1:1 (Feed)\n` +
    `FPS: 60\n` +
    `Captions: Burned-in + SRT sidecar\n` +
    `Render: Motion Template Studio (Remotion) — M-Motion milestone`
  );
}

// ─── AI prompt builders (used by studios to call /api/ai/generate) ───────────

export function buildAiPrompt(
  task: "positioning" | "usps" | "pillars" | "hooks" | "ctas" | "post" | "carousel" | "reel",
  client: Client,
  context?: Record<string, string>,
): string {
  const brand = [
    `Client: ${client.name}`,
    client.industry ? `Industry: ${client.industry}` : "",
    client.goals.audience ? `Target audience: ${client.goals.audience}` : "",
    client.brandKit.toneOfVoice ? `Tone of voice: ${client.brandKit.toneOfVoice}` : "",
    client.brandKit.positioningStatement ? `Positioning: ${client.brandKit.positioningStatement}` : "",
    client.brief.offers.length ? `Offers: ${client.brief.offers.join(", ")}` : "",
  ].filter(Boolean).join("\n");

  const tasks: Record<typeof task, string> = {
    positioning: `Write a sharp, memorable one-sentence brand positioning statement for this brand. No fluff.\n\n${brand}`,
    usps: `List 4 distinct unique selling points for this brand. Short phrases, punchy, benefit-focused.\n\n${brand}`,
    pillars: `Define 6 content pillars for this brand's social media strategy. Each: pillar name + 1 sentence description.\n\n${brand}`,
    hooks: `Write 8 social media hook templates for this brand. Fill-in-the-blank style. Each on a new line numbered.\n\n${brand}`,
    ctas: `Write 8 on-brand calls-to-action. Match the tone. Short and action-oriented. Numbered list.\n\n${brand}`,
    post: `Write an on-brand ${context?.platform || "Instagram"} ${context?.type || "post"} about: ${context?.topic || "our brand"}. Include hook, body, and hashtags.\n\n${brand}`,
    carousel: `Write a ${context?.slides || "5"}-slide carousel about: ${context?.topic || "brand tips"}. Format: SLIDE N — TITLE / Body text. Include cover and CTA slide.\n\n${brand}`,
    reel: `Write a ${context?.duration || "30"}s reel script about: ${context?.concept || "brand story"}. Format: timecodes, visual direction, spoken text, CTA.\n\n${brand}`,
  };

  return tasks[task];
}
