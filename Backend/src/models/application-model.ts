import mongoose, { model, Schema } from "mongoose";
import { IApplication } from "../interface/user-interface/application-interface";

const applicationSchema = new Schema<IApplication>(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    applicant: {
      // ✅ Fixed: was "applications" — now consistent with interface, controller, and index
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true },
);

// ✅ Fixed: index now correctly references "applicant" (was pointing to a non-existent field)
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

export const Application = model<IApplication>("Application", applicationSchema);