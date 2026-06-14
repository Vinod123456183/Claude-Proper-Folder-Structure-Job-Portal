import mongoose, { model, Schema } from "mongoose";
import { IUser } from "../interface/user-interface/user-interface";

const userSchema = new Schema<IUser>(
  {
    userName: {
      type: String,
      required: true,
      trim: true,
    },

    userEmail: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },

    userPhone: {
      type: String,
      required: true,
    },

    userPassword: {
      type: String,
      required: true,
      minlength: 6,
    },

    userRole: {
      type: String,
      enum: ["student", "recruiter"],
      required: true,
    },

    userProfile: {
      userBio: {
        type: String,
      },
      userSkills: [
        {
          type: String,
        },
      ],
      userResume: {
        type: String,
      },
      userResumeName: {
        type: String,
      },
      userCompany: {
        type: Schema.Types.ObjectId,
        ref: "Company",
      },
      userProfilePic: {
        type: String,
        default: "",
      },
    },
  },
  { timestamps: true },
);

export const User = model<IUser>("User", userSchema);
