import {
  LayoutDashboard,
  Users,
  Workflow,
  Sparkles,
  PenSquare,
  GalleryHorizontal,
  Film,
  Clapperboard,
  Type,
  Wand2,
  LayoutTemplate,
  Megaphone,
  CalendarDays,
  MessageSquare,
  BarChart3,
  Network,
  Settings,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  shortcut?: string;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Workspace",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, shortcut: "D" },
      { label: "Analytics", href: "/analytics", icon: TrendingUp, shortcut: "A" },
      { label: "Clients", href: "/clients", icon: Users, shortcut: "C" },
      { label: "Workflow Command Center", href: "/workflows", icon: Workflow, shortcut: "W" },
    ],
  },
  {
    label: "Production",
    items: [
      { label: "Strategy Lab", href: "/strategy-lab", icon: Sparkles },
      { label: "Content Studio", href: "/content-studio", icon: PenSquare },
      { label: "Carousel Studio", href: "/carousel-studio", icon: GalleryHorizontal },
      { label: "Reel Script Studio", href: "/reel-script-studio", icon: Film },
    ],
  },
  {
    label: "Motion",
    items: [
      { label: "Motion Video Studio", href: "/motion-video-studio", icon: Clapperboard },
      { label: "Text Animation Studio", href: "/text-animation-studio", icon: Type },
      { label: "AI Video Prompt Studio", href: "/ai-video-prompt-studio", icon: Wand2 },
      { label: "Motion Template Studio", href: "/motion-template-studio", icon: LayoutTemplate },
    ],
  },
  {
    label: "Operations",
    items: [
      { label: "Campaign Builder", href: "/campaign-builder", icon: Megaphone },
      { label: "Content Calendar", href: "/content-calendar", icon: CalendarDays },
      { label: "Client Messages", href: "/messages", icon: MessageSquare },
      { label: "Reports", href: "/reports", icon: BarChart3 },
      { label: "n8n Workflow Builder", href: "/n8n-builder", icon: Network },
    ],
  },
  {
    label: "System",
    items: [
      { label: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

export const ALL_NAV_ITEMS: NavItem[] = NAV_GROUPS.flatMap((g) => g.items);
