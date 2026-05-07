import { NextRequest, NextResponse } from "next/server";

// In a real async-render setup, this reads from a Redis/DB job store.
// For now it returns a simple mock so the UI polling loop works.
export async function GET(
  _req: NextRequest,
  { params }: { params: { jobId: string } },
) {
  const { jobId } = params;

  if (!jobId) {
    return NextResponse.json({ error: "jobId required" }, { status: 400 });
  }

  // Stub: jobs submitted via POST /api/motion/render complete synchronously,
  // so a status check here just returns "done" or "not found".
  return NextResponse.json({
    jobId,
    state: "done",
    progress: 100,
  });
}
