import { NextRequest, NextResponse } from "next/server";
import { runMatchSync } from "@/lib/syncPipeline";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    console.log("❌ Unauthorized cron request attempt");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    console.log("🚀 Vercel Cron: Starting weekly match sync...");
    const result = await runMatchSync();
    console.log(`✅ Cron completed: ${result.processed} matches processed`);

    return NextResponse.json({
      success: true,
      ...result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("💥 Error during cron sync:", error);
    return NextResponse.json(
      { success: false, error: "Cron sync failed" },
      { status: 500 }
    );
  }
}
