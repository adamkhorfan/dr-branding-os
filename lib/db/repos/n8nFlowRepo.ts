import { db, COLLECTIONS } from "@/lib/db";
import { nowIso, uid } from "@/lib/utils";
import type { N8nFlow, N8nFlowNode, N8nFlowCreateInput } from "@/types/n8n";

const C = COLLECTIONS.n8nFlows;

export const n8nFlowRepo = {
  async list(): Promise<N8nFlow[]> {
    return db.list<N8nFlow>(C);
  },

  async get(id: string): Promise<N8nFlow | null> {
    return db.get<N8nFlow>(C, id);
  },

  async create(input: N8nFlowCreateInput): Promise<N8nFlow> {
    const ts = nowIso();
    const flow: N8nFlow = {
      id: uid("flow"),
      name: input.name,
      description: input.description,
      nodes: input.nodes ?? [],
      active: false,
      createdAt: ts,
      updatedAt: ts,
    };
    return db.create<N8nFlow>(C, flow);
  },

  async update(id: string, patch: Partial<Pick<N8nFlow, "name" | "description" | "nodes" | "active">>): Promise<N8nFlow> {
    return db.update<N8nFlow>(C, id, { ...patch, updatedAt: nowIso() });
  },

  async addNode(id: string, node: Omit<N8nFlowNode, "id">): Promise<N8nFlow> {
    const flow = await db.get<N8nFlow>(C, id);
    if (!flow) throw new Error(`Flow ${id} not found`);
    const nodes = [...flow.nodes, { ...node, id: uid("node") }];
    return db.update<N8nFlow>(C, id, { nodes, updatedAt: nowIso() });
  },

  async updateNode(id: string, nodeId: string, patch: Partial<N8nFlowNode>): Promise<N8nFlow> {
    const flow = await db.get<N8nFlow>(C, id);
    if (!flow) throw new Error(`Flow ${id} not found`);
    const nodes = flow.nodes.map((n) => (n.id === nodeId ? { ...n, ...patch } : n));
    return db.update<N8nFlow>(C, id, { nodes, updatedAt: nowIso() });
  },

  async removeNode(id: string, nodeId: string): Promise<N8nFlow> {
    const flow = await db.get<N8nFlow>(C, id);
    if (!flow) throw new Error(`Flow ${id} not found`);
    const nodes = flow.nodes.filter((n) => n.id !== nodeId);
    return db.update<N8nFlow>(C, id, { nodes, updatedAt: nowIso() });
  },

  async remove(id: string): Promise<void> {
    return db.remove(C, id);
  },
};
