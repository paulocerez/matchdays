import { getAllMatches } from "@/db/queries/matches";
import withErrorHandling from "@/utils/withErrorHandling";
import { NextRequest, NextResponse } from "next/server";

async function getAllMatchesHandler(
  request: NextRequest
): Promise<NextResponse> {
  const result = await getAllMatches();
  return NextResponse.json(result, { status: 200 });
}

export const GET = withErrorHandling(getAllMatchesHandler);
