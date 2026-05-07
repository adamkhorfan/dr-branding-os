import { db, COLLECTIONS } from "@/lib/db";
import { nowIso, uid } from "@/lib/utils";
import type {
  WorkflowInstance,
  WorkflowKey,
  WorkflowStage,
  StepState,
} from "@/types/workflow";

const C = COLLECTIONS.workflowInstances;

export const workflowRepo = {
  async list(): Promise<WorkflowInstance[]> {
    return db.list<WorkflowInstance>(C);
  },

  async listByClient(clientId: string): Promise<WorkflowInstance[]> {
    const all = await db.list<WorkflowInstance>(C);
    return all.filter((w) => w.clientId === clientId);
  },

  async get(id: string): Promise<WorkflowInstance | null> {
    return db.get<WorkflowInstance>(C, id);
  },

  async create(
    definitionKey: WorkflowKey,
    clientId: string,
    initialStepId: string | null = null,
  ): Promise<WorkflowInstance> {
    const ts = nowIso();
    const inst: WorkflowInstance = {
      id: uid("wf"),
      definitionKey,
      clientId,
      currentStepId: initialStepId,
      status: "draft",
      stepStates: {},
      createdAt: ts,
      updatedAt: ts,
    };
    return db.create<WorkflowInstance>(C, inst);
  },

  async setStatus(id: string, status: WorkflowStage): Promise<WorkflowInstance> {
    return db.update<WorkflowInstance>(C, id, {
      status,
      updatedAt: nowIso(),
    });
  },

  /** Mark a step completed and advance to the next step. */
  async advanceStep(
    instanceId: string,
    stepId: string,
    output: unknown,
    notes: string | undefined,
    nextStepId: string | null,
  ): Promise<WorkflowInstance> {
    const current = await this.get(instanceId);
    if (!current) throw new Error(`Workflow instance ${instanceId} not found`);

    const stepState: StepState = {
      ...(current.stepStates[stepId] ?? {}),
      status: "completed",
      output,
      notes,
      completedAt: nowIso(),
    };

    const completing = nextStepId === null;
    const patch: Partial<WorkflowInstance> = {
      currentStepId: nextStepId,
      status: completing ? "completed" : "in-progress",
      stepStates: { ...current.stepStates, [stepId]: stepState },
      updatedAt: nowIso(),
    };
    if (completing) patch.completedAt = nowIso();

    return db.update<WorkflowInstance>(C, instanceId, patch);
  },

  /** Mark an approval step rejected and route to the rejection path. */
  async rejectStep(
    instanceId: string,
    stepId: string,
    notes: string | undefined,
    nextStepId: string | null,
  ): Promise<WorkflowInstance> {
    const current = await this.get(instanceId);
    if (!current) throw new Error(`Workflow instance ${instanceId} not found`);

    const stepState: StepState = {
      ...(current.stepStates[stepId] ?? {}),
      status: "rejected",
      notes,
      completedAt: nowIso(),
    };

    return db.update<WorkflowInstance>(C, instanceId, {
      // Stay on current step if no rejection path is defined
      currentStepId: nextStepId ?? current.currentStepId,
      status: "in-progress",
      stepStates: { ...current.stepStates, [stepId]: stepState },
      updatedAt: nowIso(),
    });
  },

  /** Skip an AI or export step that isn't built yet. */
  async skipStep(
    instanceId: string,
    stepId: string,
    nextStepId: string | null,
  ): Promise<WorkflowInstance> {
    const current = await this.get(instanceId);
    if (!current) throw new Error(`Workflow instance ${instanceId} not found`);

    const stepState: StepState = {
      status: "skipped",
      completedAt: nowIso(),
    };

    const completing = nextStepId === null;
    const patch: Partial<WorkflowInstance> = {
      currentStepId: nextStepId,
      status: completing ? "completed" : "in-progress",
      stepStates: { ...current.stepStates, [stepId]: stepState },
      updatedAt: nowIso(),
    };
    if (completing) patch.completedAt = nowIso();

    return db.update<WorkflowInstance>(C, instanceId, patch);
  },

  async remove(id: string): Promise<void> {
    return db.remove(C, id);
  },
};
