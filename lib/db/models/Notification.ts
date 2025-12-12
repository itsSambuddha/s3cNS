import { Schema, model, models, Types } from "mongoose"

export type NotificationCategory =
  | "BUDGET"
  | "APPROVAL"
  | "EVENT"
  | "TASK"
  | "SECURITY"
  | "ANNOUNCEMENT"

const notificationSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true, index: true },
    category: {
      type: String,
      enum: ["BUDGET", "APPROVAL", "EVENT", "TASK", "SECURITY", "ANNOUNCEMENT"],
      required: true,
      index: true,
    },
    title: { type: String, required: true },
    body: { type: String, required: true },
    url: { type: String },
    data: { type: Schema.Types.Mixed },
    readAt: { type: Date, default: null, index: true },
  },
  { timestamps: true },
)

const NotificationModel =
  models.Notification || model("Notification", notificationSchema)

export default NotificationModel