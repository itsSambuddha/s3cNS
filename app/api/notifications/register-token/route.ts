import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import { Device as DeviceModel } from "@/lib/db/models/Device";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const { token, userId, platform } = await req.json();

    if (!token || !userId) {
      return NextResponse.json(
        { error: "Missing required fields: token and userId" },
        { status: 400 }
      );
    }

    await DeviceModel.updateOne(
      { token },
      {
        $set: {
          userId,
          platform: platform || "web",
          lastSeenAt: new Date(),
          isActive: true,
        },
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error registering device token:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}