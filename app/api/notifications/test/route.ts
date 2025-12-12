import { NextRequest, NextResponse } from "next/server";
import { sendNotificationToUser } from "@/lib/notifications/notificationService";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    await sendNotificationToUser(String(userId), {
      category: "ANNOUNCEMENT",
      title: "SECMUN test notification",
      body: "If you see this, push is working.",
      url: "/dashboard",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending test notification:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}