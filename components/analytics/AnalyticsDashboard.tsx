"use client";

import { useEffect, useMemo } from "react";
import { useClientsStore } from "@/store/useClientsStore";
import { useContentStore } from "@/store/useContentStore";
import { useCampaignsStore } from "@/store/useCampaignsStore";
import { useWorkflowsStore } from "@/store/useWorkflowsStore";
import { useMessagesStore } from "@/store/useMessagesStore";
import {
  computeGlobalMetrics,
  computeClientMetrics,
  computeContentVelocity,
  computeActivityFeed,
} from "@/lib/analytics/compute";
import { GlobalKpiBar } from "./GlobalKpiBar";
import { ClientPerformanceGrid } from "./ClientPerformanceGrid";
import { MiniBarChart } from "./MiniBarChart";
import { ActivityFeed } from "./ActivityFeed";

export function AnalyticsDashboard() {
  const { clients, loaded: cLoaded, load: loadClients } = useClientsStore();
  const { items: content, loaded: ctLoaded, load: loadContent } = useContentStore();
  const { campaigns, loaded: caLoaded, load: loadCampaigns } = useCampaignsStore();
  const { instances: workflows, loaded: wLoaded, load: loadWorkflows } = useWorkflowsStore();
  const { threads, loaded: mLoaded, load: loadMessages } = useMessagesStore();

  useEffect(() => {
    if (!cLoaded) loadClients();
    if (!ctLoaded) loadContent();
    if (!caLoaded) loadCampaigns();
    if (!wLoaded) loadWorkflows();
    if (!mLoaded) loadMessages();
  }, [cLoaded, ctLoaded, caLoaded, wLoaded, mLoaded, loadClients, loadContent, loadCampaigns, loadWorkflows, loadMessages]);

  const globalMetrics = useMemo(
    () => computeGlobalMetrics(clients, content, campaigns, workflows, threads),
    [clients, content, campaigns, workflows, threads],
  );

  const clientMetrics = useMemo(
    () => computeClientMetrics(clients, content, campaigns, workflows, threads),
    [clients, content, campaigns, workflows, threads],
  );

  const velocity = useMemo(() => computeContentVelocity(content), [content]);

  const activity = useMemo(
    () => computeActivityFeed(clients, content, campaigns, workflows, threads),
    [clients, content, campaigns, workflows, threads],
  );

  return (
    <div className="flex flex-col gap-8">
      {/* Global KPIs */}
      <GlobalKpiBar metrics={globalMetrics} />

      {/* Charts + Activity row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Content velocity chart */}
        <div className="lg:col-span-2 bg-white/4 border border-white/8 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[11px] text-white/40 uppercase tracking-widest font-medium">
                Content Velocity
              </p>
              <p className="text-lg font-bold text-white mt-0.5">
                Last 6 Months
              </p>
            </div>
            <div className="text-2xl font-bold text-[#c9a96e]">
              {globalMetrics.totalContent}
              <span className="text-sm text-white/30 font-normal ml-1">total</span>
            </div>
          </div>
          <MiniBarChart data={velocity} color="#c9a96e" height={100} />
        </div>

        {/* Quick stats */}
        <div className="bg-white/4 border border-white/8 rounded-xl p-5 flex flex-col gap-4">
          <p className="text-[11px] text-white/40 uppercase tracking-widest font-medium">
            Quick Stats
          </p>
          {[
            { label: "Active Campaigns", value: globalMetrics.activeCampaigns, total: globalMetrics.totalCampaigns },
            { label: "Completed Workflows", value: globalMetrics.completedWorkflows, total: globalMetrics.totalWorkflows },
            { label: "Pending Approvals", value: globalMetrics.pendingApprovals, total: globalMetrics.totalContent },
            { label: "Content This Month", value: globalMetrics.contentThisMonth, total: globalMetrics.totalContent },
          ].map(({ label, value, total }) => {
            const pct = total > 0 ? Math.round((value / total) * 100) : 0;
            return (
              <div key={label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-white/50">{label}</span>
                  <span className="text-white/70 font-medium">{value} / {total}</span>
                </div>
                <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#c9a96e] rounded-full transition-all duration-700"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Client performance + Activity feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <p className="text-[11px] text-white/40 uppercase tracking-widest font-medium mb-3">
            Client Performance
          </p>
          <ClientPerformanceGrid clients={clientMetrics} />
        </div>

        <div className="bg-white/4 border border-white/8 rounded-xl p-5">
          <p className="text-[11px] text-white/40 uppercase tracking-widest font-medium mb-3">
            Recent Activity
          </p>
          <ActivityFeed items={activity} />
        </div>
      </div>
    </div>
  );
}
