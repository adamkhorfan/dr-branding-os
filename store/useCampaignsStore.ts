"use client";

import { create } from "zustand";
import { campaignRepo } from "@/lib/db/repos/campaignRepo";
import type { Campaign, CampaignCreateInput, CampaignStatus } from "@/types/campaign";

interface CampaignsState {
  campaigns: Campaign[];
  loaded: boolean;
  loading: boolean;

  load: () => Promise<void>;
  create: (input: CampaignCreateInput) => Promise<Campaign>;
  setStatus: (id: string, status: CampaignStatus) => Promise<void>;
  toggleMilestone: (id: string, milestoneId: string) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

export const useCampaignsStore = create<CampaignsState>((set, get) => {
  function replace(updated: Campaign) {
    set((s) => ({
      campaigns: s.campaigns.map((c) => (c.id === updated.id ? updated : c)),
    }));
  }

  return {
    campaigns: [],
    loaded: false,
    loading: false,

    async load() {
      if (get().loading) return;
      set({ loading: true });
      const campaigns = await campaignRepo.list();
      set({ campaigns, loaded: true, loading: false });
    },

    async create(input) {
      const campaign = await campaignRepo.create(input);
      set((s) => ({ campaigns: [campaign, ...s.campaigns] }));
      return campaign;
    },

    async setStatus(id, status) {
      const updated = await campaignRepo.setStatus(id, status);
      replace(updated);
    },

    async toggleMilestone(id, milestoneId) {
      const updated = await campaignRepo.toggleMilestone(id, milestoneId);
      replace(updated);
    },

    async remove(id) {
      await campaignRepo.remove(id);
      set((s) => ({ campaigns: s.campaigns.filter((c) => c.id !== id) }));
    },
  };
});
