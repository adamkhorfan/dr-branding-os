"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useClientsStore } from "@/store/useClientsStore";
import { WizardProgress } from "./WizardProgress";
import { Step1Basics } from "./steps/Step1Basics";
import { Step2Brand } from "./steps/Step2Brand";
import { Step3Strategy } from "./steps/Step3Strategy";
import { Step4Competitors } from "./steps/Step4Competitors";
import { Step5AiBrief } from "./steps/Step5AiBrief";
import { Step6Review } from "./steps/Step6Review";
import { EMPTY_WIZARD, type WizardData } from "./wizardTypes";
import type { BrandKit, ClientBrief, ClientGoals, Competitor } from "@/types/client";

interface OnboardingWizardProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

const TOTAL_STEPS = 6;

export function OnboardingWizard({ open, onOpenChange }: OnboardingWizardProps) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<WizardData>(EMPTY_WIZARD);
  const [submitting, setSubmitting] = useState(false);
  const create = useClientsStore((s) => s.create);
  const updateBrandKit = useClientsStore((s) => s.updateBrandKit);
  const updateBrief = useClientsStore((s) => s.updateBrief);
  const updateGoals = useClientsStore((s) => s.updateGoals);
  const updateCompetitors = useClientsStore((s) => s.updateCompetitors);
  const router = useRouter();

  const patch = useCallback((p: Partial<WizardData>) => {
    setData((d) => ({ ...d, ...p }));
  }, []);

  function canAdvance() {
    if (step === 0) return data.name.trim().length > 0;
    return true;
  }

  function handleClose() {
    onOpenChange(false);
    // Reset after close animation
    setTimeout(() => {
      setStep(0);
      setData(EMPTY_WIZARD);
    }, 300);
  }

  async function handleCreate() {
    if (submitting) return;
    setSubmitting(true);
    try {
      const client = await create({
        name: data.name.trim(),
        industry: data.industry.trim() || undefined,
        positioning: data.aiBrief ? data.aiBrief.slice(0, 500) : undefined,
        audience: data.audience.trim() || undefined,
        notes: data.website ? `Website: ${data.website}` : undefined,
      });

      // Populate brand kit
      const brandKit: BrandKit = {
        palette: [
          { hex: data.primaryColor, role: "primary", name: "Primary" },
          { hex: data.secondaryColor, role: "secondary", name: "Secondary" },
          { hex: data.accentColor, role: "accent", name: "Accent" },
        ],
        toneOfVoice: data.toneOfVoice || undefined,
        visualStyle: data.visualStyle || undefined,
        contentDos: [],
        contentDonts: [],
        audienceEmotions: [],
        positioningStatement: data.aiBrief ? data.aiBrief.slice(0, 300) : undefined,
      };
      await updateBrandKit(client.id, brandKit);

      // Populate brief
      const brief: ClientBrief = {
        positioning: data.aiBrief ? data.aiBrief.slice(0, 600) : undefined,
        offers: data.offers
          ? data.offers.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
      };
      await updateBrief(client.id, brief);

      // Populate goals
      const goals: ClientGoals = {
        goals: data.goals,
        audience: data.audience.trim() || undefined,
        audienceEmotions: [],
      };
      await updateGoals(client.id, goals);

      // Populate competitors
      if (data.competitors.length > 0) {
        const competitors: Competitor[] = data.competitors.map((c, i) => ({
          id: `comp-${Date.now()}-${i}`,
          name: c.name,
          url: c.url || undefined,
        }));
        await updateCompetitors(client.id, competitors);
      }

      handleClose();
      router.push(`/clients/${client.id}`);
    } finally {
      setSubmitting(false);
    }
  }

  const steps = [
    <Step1Basics key={0} data={data} onChange={patch} />,
    <Step2Brand key={1} data={data} onChange={patch} />,
    <Step3Strategy key={2} data={data} onChange={patch} />,
    <Step4Competitors key={3} data={data} onChange={patch} />,
    <Step5AiBrief key={4} data={data} onChange={patch} />,
    <Step6Review key={5} data={data} />,
  ];

  const isLast = step === TOTAL_STEPS - 1;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col overflow-hidden p-0">
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border shrink-0">
          <DialogTitle className="text-base font-semibold text-fg">
            New client onboarding
          </DialogTitle>
          <div className="mt-3">
            <WizardProgress current={step} />
          </div>
        </DialogHeader>

        {/* Step body */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {steps[step]}
        </div>

        {/* Footer nav */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border shrink-0 bg-bg-base">
          <div className="text-xs text-fg-subtle">
            Step {step + 1} of {TOTAL_STEPS}
          </div>
          <div className="flex items-center gap-2">
            {step > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStep((s) => s - 1)}
                disabled={submitting}
                className="gap-1.5"
              >
                <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.75} />
                Back
              </Button>
            )}
            {!isLast ? (
              <Button
                size="sm"
                onClick={() => setStep((s) => s + 1)}
                disabled={!canAdvance()}
                className="gap-1.5"
              >
                Next
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} />
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={handleCreate}
                disabled={submitting}
                className="gap-1.5"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Creating…
                  </>
                ) : (
                  "Create client"
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
