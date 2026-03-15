import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/connect";
import { Device as DeviceModel } from "@/lib/db/models/Device";
import { User as UserModel } from "@/lib/db/models/User";

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

    // Hardening: Resolve Mongo _id if userId is a Firebase UID
    let targetUserId = userId;
    const userByUid = await UserModel.findOne({ uid: userId }).select('_id').lean();
    if (userByUid) {
      targetUserId = userByUid._id;
    }

    await DeviceModel.updateOne(
      { token },
      {
        $set: {
          userId: targetUserId,
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