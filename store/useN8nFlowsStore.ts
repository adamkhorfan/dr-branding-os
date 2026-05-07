"use client";

import { create } from "zustand";
import { n8nFlowRepo } from "@/lib/db/repos/n8nFlowRepo";
import type { N8nFlow, N8nFlowNode, N8nFlowCreateInput } from "@/types/n8n";

interface N8nFlowsState {
  flows: N8nFlow[];
  loaded: boolean;
  loading: boolean;

  load: () => Promise<void>;
  create: (input: N8nFlowCreateInput) => Promise<N8nFlow>;
  update: (id: string, patch: Partial<Pick<N8nFlow, "name" | "description" | "nodes" | "active">>) => Promise<void>;
  addNode: (id: string, node: Omit<N8nFlowNode, "id">) => Promise<void>;
  updateNode: (id: string, nodeId: string, patch: Partial<N8nFlowNode>) => Promise<void>;
  removeNode: (id: string, nodeId: string) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

export const useN8nFlowsStore = create<N8nFlowsState>((set, get) => {
  function replace(updated: N8nFlow) {
    set((s) => ({
      flows: s.flows.map((f) => (f.id === updated.id ? updated : f)),
    }));
  }

  return {
    flows: [],
    loaded: false,
    loading: false,

    async load() {
      if (get().loading) return;
      set({ loading: true });
      const flows = await n8nFlowRepo.list();
      set({ flows, loaded: true, loading: false });
    },

    async create(input) {
      const flow = await n8nFlowRepo.create(input);
      set((s) => ({ flows: [flow, ...s.flows] }));
      return flow;
    },

    async update(id, patch) {
      const updated = await n8nFlowRepo.update(id, patch);
      replace(updated);
    },

    async addNode(id, node) {
      const updated = await n8nFlowRepo.addNode(id, node);
      replace(updated);
    },

    async updateNode(id, nodeId, patch) {
      const updated = await n8nFlowRepo.updateNode(id, nodeId, patch);
      replace(updated);
    },

    async removeNode(id, nodeId) {
      const updated = await n8nFlowRepo.removeNode(id, nodeId);
      replace(updated);
    },

    async remove(id) {
      await n8nFlowRepo.remove(id);
      set((s) => ({ flows: s.flows.filter((f) => f.id !== id) }));
    },
  };
});
