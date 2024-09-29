import { getAllMatches } from "@/db/queries/match";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const data = await getAllMatches();
  console.log(data);
  return NextResponse.json({ response: data }, { status: 200 });
}
