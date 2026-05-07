import { NextRequest, NextResponse } from "next/server";
import { renderJobStore } from "@/lib/motion/render/jobStore";

export async function GET(
  _req: NextRequest,
  { params }: { params: { jobId: string } },
) {
  const { jobId } = params;

  if (!jobId) {
    return NextResponse.json({ error: "jobId required" }, { status: 400 });
  }

  const entry = renderJobStore.get(jobId);

  if (!entry) {
    return NextResponse.json({ jobId, state: "not-found", progress: 0 }, { status: 404 });
  }

  return NextResponse.json({ jobId, ...entry });
}
