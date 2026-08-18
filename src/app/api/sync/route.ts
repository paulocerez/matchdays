import { NextResponse } from "next/server";
import { auth } from "../../../../auth";
import { runMatchSync } from "@/lib/syncPipeline";

export const maxDuration = 60;

// Manual "sync now" trigger — runs the same full pipeline as the weekly cron,
// but gated on a signed-in session instead of the CRON_SECRET.
export async function POST(): Promise<NextResponse> {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const result = await runMatchSync();
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error("Error during manual sync:", error);
    return NextResponse.json(
      { success: false, error: "Sync failed" },
      { status: 500 }
    );
  }
}
