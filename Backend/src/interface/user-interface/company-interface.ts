import { Types } from "mongoose";

export interface ICompany {
  companyName: string;
  companyDescription?: string;
  companyWebsite?: string;
  companyLogo?: string;
  userId: Types.ObjectId;
}
