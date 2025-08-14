import { getUserNameAndImageByUserId } from "@/db/queries";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const userId = pathname.split('/').pop();
  
  console.log("userId", userId);

  if (!userId) {
    return NextResponse.json(
      { error: "User Id is not provided" },
      { status: 400 }
    );
  }
  
  try {
    const result = await getUserNameAndImageByUserId(userId);
    if (!result) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error fetching user name and image", error);
    return NextResponse.json(
      { error: "Could not get user information" },
      { status: 500 }
    );
  }
}
