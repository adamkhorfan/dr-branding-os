import type { WorkflowDefinition } from "@/types/workflow";

// ─── Onboarding ───────────────────────────────────────────────────────────────

const onboarding: WorkflowDefinition = {
  key: "onboarding",
  name: "Client Onboarding",
  goal: "Get a new client fully set up — profile, brand kit, brief, goals, and competitors — ready for production.",
  inputs: ["Client name", "Industry"],
  outputs: ["Complete client profile", "Brand kit", "Brief & goals", "Competitor list"],
  stages: ["draft", "in-progress", "completed"],
  steps: [
    {
      id: "ob-s1",
      title: "Profile & basics",
      description:
        "Fill in the client's name, industry, key contacts, and social handles in the Client Detail Hub.",
      type: "user",
      expectedOutput: "Completed client profile",
      nextOnSuccess: "ob-s2",
    },
    {
      id: "ob-s2",
      title: "Brand kit",
      description:
        "Set the full brand kit — colors, typography, tone of voice, visual style, content rules, preferred language, positioning statement, and audience emotions.",
      type: "user",
      expectedOutput: "Completed brand kit",
      nextOnSuccess: "ob-s3",
    },
    {
      id: "ob-s3",
      title: "Brief, goals & audience",
      description:
        "Define the client's positioning statement, core offers, marketing goals, target audience, and the emotions to evoke.",
      type: "user",
      expectedOutput: "Completed brief and goals",
      nextOnSuccess: "ob-s4",
    },
    {
      id: "ob-s4",
      title: "Competitors",
      description:
        "Add the key competitor brands worth tracking. Include URLs and notes on their positioning, content style, or weaknesses.",
      type: "user",
      expectedOutput: "Competitors list",
      nextOnSuccess: "ob-s5",
    },
    {
      id: "ob-s5",
      title: "Onboarding review",
      description:
        "Review the full client setup. Confirm brand kit, brief, and goals are complete and accurate before moving to production.",
      type: "approval",
      expectedOutput: "Signed-off client workspace",
    },
  ],
};

// ─── Weekly Content ───────────────────────────────────────────────────────────

const weeklyContent: WorkflowDefinition = {
  key: "weekly-content",
  name: "Weekly Content",
  goal: "Plan and produce a full week of on-brand content — captions, carousels, and reel scripts — ready for client approval.",
  inputs: ["Week theme or topic", "Platform focus", "Number of posts"],
  outputs: ["Post captions", "Carousel structure", "Reel scripts", "Approved content batch"],
  stages: ["draft", "in-progress", "pending-approval", "completed"],
  steps: [
    {
      id: "wc-s1",
      title: "Set the week's theme",
      description:
        "Define the topic, angle, platform focus, and number of posts for this week. Note any seasonal context, product launches, or special requests from the client.",
      type: "user",
      expectedOutput: "Week brief",
      nextOnSuccess: "wc-s2",
    },
    {
      id: "wc-s2",
      title: "Generate content ideas",
      description:
        "AI generates 10+ content ideas based on the brand kit, brief, and this week's theme. Review the ideas and select the strongest ones. Ships in M4 — Strategy Lab.",
      type: "ai",
      aiPromptKey: "weekly-content-ideas",
      expectedOutput: "Approved content ideas list",
      nextOnSuccess: "wc-s3",
    },
    {
      id: "wc-s3",
      title: "Write captions",
      description:
        "AI writes captions for each approved idea, tuned to the brand's tone of voice, preferred language, and platform. Ships in M4 — Content Studio.",
      type: "ai",
      aiPromptKey: "weekly-captions",
      expectedOutput: "Caption drafts",
      nextOnSuccess: "wc-s4",
    },
    {
      id: "wc-s4",
      title: "Review & edit captions",
      description:
        "Go through each caption draft. Edit for tone, accuracy, and brand voice. Add hashtags or CTAs as needed. Mark each one ready.",
      type: "user",
      expectedOutput: "Approved captions",
      nextOnSuccess: "wc-s5",
    },
    {
      id: "wc-s5",
      title: "Plan carousel slides",
      description:
        "For carousel posts, map out the slide structure — hook, body slides, and CTA. Use the Carousel Studio (arriving M4) for detailed slide planning.",
      type: "user",
      expectedOutput: "Carousel slide plan",
      nextOnSuccess: "wc-s6",
    },
    {
      id: "wc-s6",
      title: "Client approval",
      description:
        "Send the full content batch to the client for final review. Collect feedback and mark approved before scheduling.",
      type: "approval",
      expectedOutput: "Client-approved content batch",
    },
  ],
};

// ─── Content Approval ─────────────────────────────────────────────────────────

const contentApproval: WorkflowDefinition = {
  key: "approval",
  name: "Content Approval",
  goal: "Move a content batch through internal review and client sign-off before it is scheduled or published.",
  inputs: ["Content batch description", "Deadline"],
  outputs: ["Approved content package", "Revision notes"],
  stages: ["draft", "in-progress", "pending-approval", "completed"],
  steps: [
    {
      id: "ap-s1",
      title: "Compile content package",
      description:
        "Organize the content batch — captions, visuals, carousel slides, or scripts — into a clear, reviewable package. Add context or instructions for the reviewer.",
      type: "user",
      expectedOutput: "Compiled content package",
      nextOnSuccess: "ap-s2",
    },
    {
      id: "ap-s2",
      title: "Internal review",
      description:
        "Internal team reviews the package for quality, brand alignment, and accuracy before it reaches the client. Approve to send to client, or reject to revise.",
      type: "approval",
      expectedOutput: "Internally approved package",
      nextOnSuccess: "ap-s3",
      nextOnReject: "ap-s1",
    },
    {
      id: "ap-s3",
      title: "Client review",
      description:
        "The client reviews the content. Approve to finalize, or request changes to trigger a revision round.",
      type: "approval",
      expectedOutput: "Client-approved content",
      nextOnSuccess: "ap-s5",
      nextOnReject: "ap-s4",
    },
    {
      id: "ap-s4",
      title: "Apply revisions",
      description:
        "Apply the changes requested by the client. Leave a note summarizing what was revised. The content then returns to client review.",
      type: "user",
      expectedOutput: "Revised content",
      nextOnSuccess: "ap-s3",
    },
    {
      id: "ap-s5",
      title: "Final sign-off",
      description:
        "Final approval to publish or schedule. Mark the content as approved and hand off to the content calendar.",
      type: "approval",
      expectedOutput: "Scheduled or published content",
    },
  ],
};

// ─── Registry ─────────────────────────────────────────────────────────────────

export const WORKFLOW_DEFINITIONS: Partial<Record<string, WorkflowDefinition>> = {
  onboarding,
  "weekly-content": weeklyContent,
  approval: contentApproval,
};

export const DEFINED_WORKFLOWS: WorkflowDefinition[] = [
  onboarding,
  weeklyContent,
  contentApproval,
];
