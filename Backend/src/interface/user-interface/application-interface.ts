import { Document, Types } from "mongoose";

export interface IApplication extends Document {
  job: Types.ObjectId;
  applicant: Types.ObjectId; // ✅ Fixed: was "applications"
  status: "pending" | "accepted" | "rejected";
  createdAt?: Date;
  updatedAt?: Date;
}
