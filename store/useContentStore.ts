"use client";

import { create } from "zustand";
import { contentRepo } from "@/lib/db/repos";
import type { ContentItemCreateInput } from "@/lib/db/repos/contentRepo";
import type { ContentItem, ContentStatus } from "@/types/content";

interface ContentState {
  items: ContentItem[];
  loaded: boolean;
  loading: boolean;

  load: () => Promise<void>;
  create: (input: ContentItemCreateInput) => Promise<ContentItem>;
  setStatus: (id: string, status: ContentStatus) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

export const useContentStore = create<ContentState>((set, get) => {
  function replace(updated: ContentItem) {
    set((s) => ({
      items: s.items.map((i) => (i.id === updated.id ? updated : i)),
    }));
  }

  return {
    items: [],
    loaded: false,
    loading: false,

    async load() {
      if (get().loading) return;
      set({ loading: true });
      const items = await contentRepo.list();
      set({ items, loaded: true, loading: false });
    },

    async create(input) {
      const item = await contentRepo.create(input);
      set((s) => ({ items: [item, ...s.items] }));
      return item;
    },

    async setStatus(id, status) {
      const item = await contentRepo.setStatus(id, status);
      replace(item);
    },

    async remove(id) {
      await contentRepo.remove(id);
      set((s) => ({ items: s.items.filter((i) => i.id !== id) }));
    },
  };
});
