import { redirect } from "next/navigation"
import { connectToDatabase } from "@/lib/db/connect"
import { User as UserModel } from "@/lib/db/models/User"
import { getCurrentUser } from "@/lib/auth/getCurrentUser"
import { NotificationSettingsForm } from "@/components/notifications/NotificationSettingsForm"

export default async function NotificationSettingsPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/login")

  await connectToDatabase()
  const dbUser = await UserModel.findById(user._id).lean()

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Notification settings</h1>
        <p className="text-sm text-muted-foreground">
          Control which notifications you receive as push and in your inbox.
        </p>
      </div>
      <NotificationSettingsForm userId={String(user._id)} prefs={dbUser?.notificationPreferences || {}} />
    </div>
  )
}