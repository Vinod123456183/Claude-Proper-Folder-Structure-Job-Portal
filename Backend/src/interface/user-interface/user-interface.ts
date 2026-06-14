import { Types } from "mongoose";

export interface IUserProfile {
  userBio?: string;
  userSkills?: string[];
  userResume?: string;
  userResumeName?: string;
  userCompany?: Types.ObjectId;
  userProfilePic?: string;
}

export interface IUser {
  userName: string;
  userEmail: string;
  userPhone: string;
  userPassword: string;
  userRole: "student" | "recruiter";
  userProfile: IUserProfile;
}
