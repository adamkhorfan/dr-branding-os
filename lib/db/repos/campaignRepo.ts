import { db, COLLECTIONS } from "@/lib/db";
import { nowIso, uid } from "@/lib/utils";
import type { Campaign, CampaignCreateInput, CampaignMilestone, CampaignStatus } from "@/types/campaign";

const C = COLLECTIONS.campaigns;

export const campaignRepo = {
  async list(): Promise<Campaign[]> {
    return db.list<Campaign>(C);
  },

  async listByClient(clientId: string): Promise<Campaign[]> {
    const all = await db.list<Campaign>(C);
    return all.filter((c) => c.clientId === clientId);
  },

  async get(id: string): Promise<Campaign | null> {
    return db.get<Campaign>(C, id);
  },

  async create(input: CampaignCreateInput): Promise<Campaign> {
    const ts = nowIso();
    const campaign: Campaign = {
      id: uid("camp"),
      clientId: input.clientId,
      name: input.name,
      objective: input.objective ?? "",
      startDate: input.startDate,
      endDate: input.endDate,
      deliverableIds: [],
      milestones: [],
      status: "planning",
      budget: input.budget,
      createdAt: ts,
      updatedAt: ts,
    };
    return db.create<Campaign>(C, campaign);
  },

  async setStatus(id: string, status: CampaignStatus): Promise<Campaign> {
    return db.update<Campaign>(C, id, { status, updatedAt: nowIso() });
  },

  async addMilestone(id: string, milestone: Omit<CampaignMilestone, "id">): Promise<Campaign> {
    const campaign = await db.get<Campaign>(C, id);
    if (!campaign) throw new Error(`Campaign ${id} not found`);
    const updated: CampaignMilestone[] = [
      ...campaign.milestones,
      { ...milestone, id: uid("ms") },
    ];
    return db.update<Campaign>(C, id, { milestones: updated, updatedAt: nowIso() });
  },

  async toggleMilestone(id: string, milestoneId: string): Promise<Campaign> {
    const campaign = await db.get<Campaign>(C, id);
    if (!campaign) throw new Error(`Campaign ${id} not found`);
    const milestones = campaign.milestones.map((m) =>
      m.id === milestoneId ? { ...m, done: !m.done } : m,
    );
    return db.update<Campaign>(C, id, { milestones, updatedAt: nowIso() });
  },

  async remove(id: string): Promise<void> {
    return db.remove(C, id);
  },
};
