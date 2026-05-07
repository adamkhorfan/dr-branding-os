"use client";

import { create } from "zustand";
import { clientRepo } from "@/lib/db/repos";
import type {
  Client,
  ClientCreateInput,
  Competitor,
  BrandKit as BrandKitT,
  ClientBrief,
  ClientGoals,
} from "@/types/client";

interface ClientsState {
  clients: Client[];
  loaded: boolean;
  loading: boolean;

  load: () => Promise<void>;
  create: (input: ClientCreateInput) => Promise<Client>;

  // Section-specific updaters
  updateProfile: (
    id: string,
    patch: { name?: string; industry?: string },
  ) => Promise<Client>;
  updateBrandKit: (id: string, brandKit: BrandKitT) => Promise<Client>;
  updateBrief: (id: string, brief: ClientBrief) => Promise<Client>;
  updateGoals: (id: string, goals: ClientGoals) => Promise<Client>;
  updateCompetitors: (
    id: string,
    competitors: Competitor[],
  ) => Promise<Client>;
  updateNotes: (id: string, notes: string) => Promise<Client>;

  archive: (id: string) => Promise<void>;
  restore: (id: string) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

export const useClientsStore = create<ClientsState>((set, get) => {
  function replace(updated: Client) {
    set((s) => ({
      clients: s.clients.map((c) => (c.id === updated.id ? updated : c)),
    }));
  }

  return {
    clients: [],
    loaded: false,
    loading: false,

    async load() {
      if (get().loading) return;
      set({ loading: true });
      const clients = await clientRepo.list();
      set({ clients, loaded: true, loading: false });
    },

    async create(input) {
      const c = await clientRepo.create(input);
      set((s) => ({ clients: [c, ...s.clients] }));
      return c;
    },

    async updateProfile(id, patch) {
      const c = await clientRepo.updateProfile(id, patch);
      replace(c);
      return c;
    },

    async updateBrandKit(id, brandKit) {
      const c = await clientRepo.updateBrandKit(id, brandKit);
      replace(c);
      return c;
    },

    async updateBrief(id, brief) {
      const c = await clientRepo.updateBrief(id, brief);
      replace(c);
      return c;
    },

    async updateGoals(id, goals) {
      const c = await clientRepo.updateGoals(id, goals);
      replace(c);
      return c;
    },

    async updateCompetitors(id, competitors) {
      const c = await clientRepo.updateCompetitors(id, competitors);
      replace(c);
      return c;
    },

    async updateNotes(id, notes) {
      const c = await clientRepo.updateNotes(id, notes);
      replace(c);
      return c;
    },

    async archive(id) {
      const c = await clientRepo.archive(id);
      replace(c);
    },

    async restore(id) {
      const c = await clientRepo.restore(id);
      replace(c);
    },

    async remove(id) {
      await clientRepo.remove(id);
      set((s) => ({ clients: s.clients.filter((c) => c.id !== id) }));
    },
  };
});
