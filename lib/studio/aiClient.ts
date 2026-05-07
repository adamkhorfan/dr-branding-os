/**
 * Client-side helper that calls the /api/ai/generate route.
 * Returns null if the API key is not configured — callers fall back to
 * template-based generation from generators.ts.
 */
export async function aiGenerate(
  prompt: string,
  options?: { system?: string; maxTokens?: number },
): Promise<string | null> {
  try {
    const res = await fetch("/api/ai/generate", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        prompt,
        system: options?.system,
        maxTokens: options?.maxTokens,
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return typeof data.text === "string" && data.text ? data.text : null;
  } catch {
    return null;
  }
}

export async function aiAvailable(): Promise<boolean> {
  try {
    const res = await fetch("/api/ai/generate", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ prompt: "ping" }),
    });
    if (res.status === 503) return false;
    return true;
  } catch {
    return false;
  }
}
