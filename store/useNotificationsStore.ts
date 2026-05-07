"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AppNotification, NotificationType } from "@/types/notification";

function generateId(): string {
  return `notif-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

interface NotificationsState {
  notifications: AppNotification[];
  unreadCount: number;

  addNotification: (
    n: Omit<AppNotification, "id" | "createdAt" | "read">,
  ) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  dismiss: (id: string) => void;
  clearAll: () => void;
  seedFromStores: (
    pending: number,
    activeWorkflows: number,
    activeCampaigns: number,
  ) => void;
}

export const useNotificationsStore = create<NotificationsState>()(
  persist(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,

      addNotification(n) {
        const newNotif: AppNotification = {
          ...n,
          id: generateId(),
          createdAt: new Date().toISOString(),
          read: false,
        };
        set((s) => {
          const updated = [newNotif, ...s.notifications].slice(0, 50);
          return {
            notifications: updated,
            unreadCount: updated.filter((x) => !x.read).length,
          };
        });
      },

      markRead(id) {
        set((s) => {
          const updated = s.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n,
          );
          return {
            notifications: updated,
            unreadCount: updated.filter((x) => !x.read).length,
          };
        });
      },

      markAllRead() {
        set((s) => ({
          notifications: s.notifications.map((n) => ({ ...n, read: true })),
          unreadCount: 0,
        }));
      },

      dismiss(id) {
        set((s) => {
          const updated = s.notifications.filter((n) => n.id !== id);
          return {
            notifications: updated,
            unreadCount: updated.filter((x) => !x.read).length,
          };
        });
      },

      clearAll() {
        set({ notifications: [], unreadCount: 0 });
      },

      seedFromStores(pending, activeWorkflows, activeCampaigns) {
        const { notifications, addNotification } = get();
        if (notifications.length > 0) return;

        const seeds: Array<{
          type: NotificationType;
          title: string;
          body: string;
          href?: string;
          condition: boolean;
        }> = [
          {
            type: "approval",
            title: "Content awaiting approval",
            body: `${pending} item${pending !== 1 ? "s" : ""} in review — tap to check`,
            href: "/content",
            condition: pending > 0,
          },
          {
            type: "workflow",
            title: "Active workflows running",
            body: `${activeWorkflows} workflow${activeWorkflows !== 1 ? "s" : ""} currently in progress`,
            href: "/workflows",
            condition: activeWorkflows > 0,
          },
          {
            type: "campaign",
            title: "Campaigns need attention",
            body: `${activeCampaigns} active campaign${activeCampaigns !== 1 ? "s" : ""} are live or in production`,
            href: "/campaigns",
            condition: activeCampaigns > 0,
          },
        ];

        seeds.filter((s) => s.condition).forEach(({ type, title, body, href }) => {
          addNotification({ type, title, body, href });
        });
      },
    }),
    { name: "dr-branding-notifications" },
  ),
);
