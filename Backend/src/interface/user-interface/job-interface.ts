import { Types, Document } from "mongoose"; // ✅ FIX 1: Missing Document import

export interface IJob extends Document {
  // ✅ FIX 2: Must extend Document — without this
  // Mongoose Schema<IJob> throws type overload errors
  title: string;
  description: string;
  requirements: string[];
  salary: number;
  location: string;
  jobType: string;
  numberOfPositions: number;
  company: Types.ObjectId;
  createdBy: Types.ObjectId;
  applications: Types.ObjectId[]; // ✅ OK — correct type
}
