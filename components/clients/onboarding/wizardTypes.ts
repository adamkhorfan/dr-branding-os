export interface WizardData {
  // Step 1 — Basics
  name: string;
  industry: string;
  website: string;
  contactName: string;
  contactEmail: string;

  // Step 2 — Brand
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  toneOfVoice: string;
  visualStyle: string;

  // Step 3 — Strategy
  goals: string[];
  audience: string;
  platforms: string[];
  offers: string;

  // Step 4 — Competitors
  competitors: { name: string; url: string }[];

  // Step 5 — AI Brief
  aiBrief: string;
  aiPillars: string[];
}

export const EMPTY_WIZARD: WizardData = {
  name: "",
  industry: "",
  website: "",
  contactName: "",
  contactEmail: "",
  primaryColor: "#c9a96e",
  secondaryColor: "#1a1a1a",
  accentColor: "#ffffff",
  toneOfVoice: "",
  visualStyle: "",
  goals: [],
  audience: "",
  platforms: [],
  offers: "",
  competitors: [],
  aiBrief: "",
  aiPillars: [],
};

export const GOAL_OPTIONS = [
  "Brand awareness",
  "Lead generation",
  "Community growth",
  "Sales conversions",
  "Thought leadership",
  "Client retention",
  "Launch / product reveal",
  "Employer branding",
];

export const PLATFORM_OPTIONS = [
  "Instagram",
  "TikTok",
  "LinkedIn",
  "YouTube",
  "Facebook",
  "X / Twitter",
  "Pinterest",
  "Threads",
];

export const TONE_OPTIONS = [
  "Luxury & exclusive",
  "Bold & disruptive",
  "Warm & approachable",
  "Minimal & editorial",
  "Playful & energetic",
  "Professional & authoritative",
  "Inspirational & aspirational",
  "Raw & authentic",
];

export const VISUAL_OPTIONS = [
  "Dark & moody",
  "Clean & minimal",
  "Vibrant & colorful",
  "Earthy & organic",
  "Futuristic & tech",
  "Classic & timeless",
  "Cinematic & dramatic",
  "Soft & pastel",
];
