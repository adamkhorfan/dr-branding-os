"use client";

interface QuickAction {
  label: string;
  prompt: string;
  emoji: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    emoji: "📊",
    label: "Agency summary",
    prompt: "Give me a brief summary of the current state of the agency — active clients, pending approvals, running campaigns, and what needs my attention today.",
  },
  {
    emoji: "✍️",
    label: "Draft caption",
    prompt: "Draft 3 short social media captions (Instagram) in a premium, editorial tone. Keep them under 150 characters each. Ask me which client or topic to focus on.",
  },
  {
    emoji: "📅",
    label: "Content ideas",
    prompt: "Based on the active clients, suggest 5 content ideas for this week. Include format (reel, carousel, post) and the hook for each.",
  },
  {
    emoji: "🎯",
    label: "Campaign brief",
    prompt: "Help me write a campaign brief. Ask me the client name, campaign objective, target audience, and timeline — then generate a structured brief.",
  },
  {
    emoji: "📬",
    label: "Client update email",
    prompt: "Draft a professional client update email for a weekly check-in. Tone: warm but professional. I'll tell you which client and what to include.",
  },
  {
    emoji: "🔍",
    label: "Pending approvals",
    prompt: "List all content items currently pending client approval and suggest which ones I should follow up on first.",
  },
  {
    emoji: "📈",
    label: "Monthly report",
    prompt: "Help me write a narrative for a monthly performance report. Ask me the client name and key metrics, then draft the executive summary section.",
  },
  {
    emoji: "🧠",
    label: "Strategy session",
    prompt: "Let's do a quick strategy session. Pick the client with the most pending content or active campaigns and suggest 3 strategic priorities for the next 30 days.",
  },
];

interface QuickActionsProps {
  onSelect: (prompt: string) => void;
}

export function QuickActions({ onSelect }: QuickActionsProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {QUICK_ACTIONS.map((action) => (
        <button
          key={action.label}
          onClick={() => onSelect(action.prompt)}
          className="flex items-start gap-2.5 rounded-lg border border-border bg-bg-inset p-3 text-left hover:bg-bg-elevated hover:border-border/80 transition-colors group"
        >
          <span className="text-base leading-none mt-0.5 shrink-0">{action.emoji}</span>
          <span className="text-xs text-fg-muted group-hover:text-fg transition-colors leading-snug">
            {action.label}
          </span>
        </button>
      ))}
    </div>
  );
}
