import { Schema, model, models, Types, Document, Model } from "mongoose";
import { IUser } from "./User";

export interface IDevice extends Document {
  userId: Types.ObjectId | IUser;
  token: string;
  platform: string;
  lastSeenAt: Date;
  isActive: boolean;
}

const deviceSchema = new Schema<IDevice>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    token: { type: String, required: true, unique: true, index: true },
    platform: { type: String, default: "web" },
    lastSeenAt: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Device: Model<IDevice> =
  models.Device || model<IDevice>("Device", deviceSchema);