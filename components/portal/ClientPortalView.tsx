"use client";

import { useEffect, useMemo } from "react";
import { FileText, Megaphone, BarChart2, Clock } from "lucide-react";
import { useClientsStore } from "@/store/useClientsStore";
import { useContentStore } from "@/store/useContentStore";
import { useCampaignsStore } from "@/store/useCampaignsStore";
import { useReportsStore } from "@/store/useReportsStore";
import { PortalHeader } from "./PortalHeader";
import { PortalContentCard } from "./PortalContentCard";

interface ClientPortalViewProps {
  clientId: string;
}

export function ClientPortalView({ clientId }: ClientPortalViewProps) {
  const { clients, loaded: cLoaded, load: loadClients } = useClientsStore();
  const { items, loaded: itLoaded, load: loadContent } = useContentStore();
  const { campaigns, loaded: caLoaded, load: loadCampaigns } = useCampaignsStore();
  const { reports, loaded: rLoaded, load: loadReports } = useReportsStore();

  useEffect(() => {
    if (!cLoaded) loadClients();
    if (!itLoaded) loadContent();
    if (!caLoaded) loadCampaigns();
    if (!rLoaded) loadReports();
  }, [cLoaded, itLoaded, caLoaded, rLoaded, loadClients, loadContent, loadCampaigns, loadReports]);

  const client = clients.find((c) => c.id === clientId);
  const clientContent = useMemo(() => items.filter((i) => i.clientId === clientId), [items, clientId]);
  const pendingContent = clientContent.filter((i) => i.status === "in-review");
  const recentContent = clientContent.filter((i) => i.status !== "in-review").slice(-6);
  const clientCampaigns = campaigns.filter((c) => c.clientId === clientId);
  const clientReports = reports.filter((r) => r.clientId === clientId).slice(-3);

  const primary =
    client?.brandKit?.palette.find((p) => p.role === "primary")?.hex ?? "#c9a96e";

  if (!cLoaded || !itLoaded) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#c9a96e] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!client) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center text-white/40 text-sm">
        Portal not found. Contact your agency.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white font-sans">
      <PortalHeader client={client} />

      <div className="max-w-4xl mx-auto px-6 py-10 flex flex-col gap-10">

        {/* Summary bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: Clock, label: "Awaiting Review", value: pendingContent.length, color: "text-amber-400" },
            { icon: FileText, label: "Total Content", value: clientContent.length, color: "text-white" },
            { icon: Megaphone, label: "Campaigns", value: clientCampaigns.length, color: "text-purple-400" },
            { icon: BarChart2, label: "Reports", value: clientReports.length, color: "text-[#c9a96e]" },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="bg-white/4 border border-white/8 rounded-xl p-4 text-center">
              <Icon className={`w-4 h-4 mx-auto mb-2 ${color}`} />
              <div className={`text-2xl font-bold ${color}`}>{value}</div>
              <div className="text-[11px] text-white/30 mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* Pending approvals */}
        {pendingContent.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <h2 className="text-sm font-semibold text-white/80 uppercase tracking-widest">
                Awaiting Your Review ({pendingContent.length})
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pendingContent.map((item) => (
                <PortalContentCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        )}

        {/* Active campaigns */}
        {clientCampaigns.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-white/40 uppercase tracking-widest mb-4">
              Campaigns
            </h2>
            <div className="flex flex-col gap-3">
              {clientCampaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="bg-white/4 border border-white/8 rounded-xl p-4 flex items-center justify-between gap-4"
                >
                  <div>
                    <div className="font-medium text-white text-sm">{campaign.name}</div>
                    <div className="text-xs text-white/30 mt-0.5">{campaign.objective}</div>
                  </div>
                  <span
                    className="text-xs px-2.5 py-1 rounded-full border font-medium"
                    style={{
                      borderColor: `${primary}40`,
                      color: primary,
                      backgroundColor: `${primary}10`,
                    }}
                  >
                    {campaign.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent content */}
        {recentContent.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-white/40 uppercase tracking-widest mb-4">
              Recent Content
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recentContent.map((item) => (
                <PortalContentCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        )}

        {/* Reports */}
        {clientReports.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-white/40 uppercase tracking-widest mb-4">
              Monthly Reports
            </h2>
            <div className="flex flex-col gap-3">
              {clientReports.map((report) => (
                <div
                  key={report.id}
                  className="bg-white/4 border border-white/8 rounded-xl p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-medium text-white text-sm">{report.month}</div>
                    <span className="text-[11px] text-white/30">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {report.kpis.slice(0, 3).map((kpi) => (
                      <div key={kpi.label} className="text-center">
                        <div className="text-lg font-bold" style={{ color: primary }}>
                          {kpi.value}{kpi.unit}
                        </div>
                        <div className="text-[10px] text-white/30">{kpi.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {clientContent.length === 0 && clientCampaigns.length === 0 && (
          <div className="text-center py-16 text-white/20 text-sm">
            No content yet — your agency will share updates here.
          </div>
        )}

        <div className="text-center text-[11px] text-white/15 pt-4 border-t border-white/5">
          Secure client portal · DR Branding OS
        </div>
      </div>
    </div>
  );
}
