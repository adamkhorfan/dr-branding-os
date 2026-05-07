"use client";

import { create } from "zustand";
import { workflowRepo } from "@/lib/db/repos";
import { WORKFLOW_DEFINITIONS } from "@/lib/workflows/definitions";
import type { WorkflowInstance, WorkflowKey, WorkflowStage } from "@/types/workflow";

interface WorkflowsState {
  instances: WorkflowInstance[];
  loaded: boolean;
  loading: boolean;

  load: () => Promise<void>;
  launch: (key: WorkflowKey, clientId: string) => Promise<WorkflowInstance>;
  advanceStep: (
    instanceId: string,
    stepId: string,
    output: unknown,
    notes: string | undefined,
    nextStepId: string | null,
  ) => Promise<WorkflowInstance>;
  rejectStep: (
    instanceId: string,
    stepId: string,
    notes: string | undefined,
    nextStepId: string | null,
  ) => Promise<WorkflowInstance>;
  skipStep: (
    instanceId: string,
    stepId: string,
    nextStepId: string | null,
  ) => Promise<WorkflowInstance>;
  setStatus: (instanceId: string, status: WorkflowStage) => Promise<void>;
  remove: (instanceId: string) => Promise<void>;
}

export const useWorkflowsStore = create<WorkflowsState>((set, get) => {
  function replace(updated: WorkflowInstance) {
    set((s) => ({
      instances: s.instances.map((i) => (i.id === updated.id ? updated : i)),
    }));
  }

  return {
    instances: [],
    loaded: false,
    loading: false,

    async load() {
      if (get().loading) return;
      set({ loading: true });
      const instances = await workflowRepo.list();
      set({ instances, loaded: true, loading: false });
    },

    async launch(key, clientId) {
      const def = WORKFLOW_DEFINITIONS[key];
      if (!def) throw new Error(`No workflow definition for key: ${key}`);
      const firstStepId = def.steps[0]?.id ?? null;
      const inst = await workflowRepo.create(key, clientId, firstStepId);
      set((s) => ({ instances: [inst, ...s.instances] }));
      return inst;
    },

    async advanceStep(instanceId, stepId, output, notes, nextStepId) {
      const inst = await workflowRepo.advanceStep(
        instanceId,
        stepId,
        output,
        notes,
        nextStepId,
      );
      replace(inst);
      return inst;
    },

    async rejectStep(instanceId, stepId, notes, nextStepId) {
      const inst = await workflowRepo.rejectStep(instanceId, stepId, notes, nextStepId);
      replace(inst);
      return inst;
    },

    async skipStep(instanceId, stepId, nextStepId) {
      const inst = await workflowRepo.skipStep(instanceId, stepId, nextStepId);
      replace(inst);
      return inst;
    },

    async setStatus(instanceId, status) {
      const inst = await workflowRepo.setStatus(instanceId, status);
      replace(inst);
    },

    async remove(instanceId) {
      await workflowRepo.remove(instanceId);
      set((s) => ({ instances: s.instances.filter((i) => i.id !== instanceId) }));
    },
  };
});
