"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { BrandAsset, AssetType } from "@/types/asset";

function genId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2);
}

interface AssetsState {
  assets: BrandAsset[];
  loaded: boolean;

  load: () => void;
  add: (asset: Omit<BrandAsset, "id" | "createdAt" | "updatedAt">) => BrandAsset;
  remove: (id: string) => void;
  update: (
    id: string,
    patch: Partial<Pick<BrandAsset, "name" | "tags" | "notes">>
  ) => void;
  getByClient: (clientId: string) => BrandAsset[];
}

export const useAssetsStore = create<AssetsState>()(
  persist(
    (set, get) => ({
      assets: [],
      loaded: false,

      load() {
        set({ loaded: true });
      },

      add(asset) {
        const now = new Date().toISOString();
        const newAsset: BrandAsset = {
          ...asset,
          id: genId(),
          createdAt: now,
          updatedAt: now,
        };
        set((s) => ({ assets: [newAsset, ...s.assets] }));
        return newAsset;
      },

      remove(id) {
        set((s) => ({ assets: s.assets.filter((a) => a.id !== id) }));
      },

      update(id, patch) {
        set((s) => ({
          assets: s.assets.map((a) =>
            a.id === id
              ? { ...a, ...patch, updatedAt: new Date().toISOString() }
              : a
          ),
        }));
      },

      getByClient(clientId) {
        return get().assets.filter((a) => a.clientId === clientId);
      },
    }),
    { name: "dr-branding-assets" }
  )
);
