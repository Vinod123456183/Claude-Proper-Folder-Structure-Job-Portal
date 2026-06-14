import { Request, Response } from "express";
import { Application } from "../models/application-model";
import { Job } from "../models/job-model";
import { Types } from "mongoose";

interface AuthRequest extends Request {
  user?: { id: string };
}

// POST /apply-job/:jobId
// jobId comes from URL params (set by frontend when user clicks "Apply")

export const applyJobController = async (req: AuthRequest, res: Response) => {
  try {
    const { jobId } = req.params;
    if (!jobId || !Types.ObjectId.isValid(jobId as string)) {
      return res
        .status(400)
        .json({ message: "Valid Job ID is required", success: false });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found", success: false });
    }

    const userId = new Types.ObjectId(req.user?.id as string);

    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: userId,
    });

    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied for this job",
        success: false,
      });
    }

    const application = await Application.create({
      job: jobId,
      applicant: userId,
    });

    // ✅ Fix 1: push application _id into job.applications array
    await Job.findByIdAndUpdate(jobId, {
      $push: { applications: application._id },
    });

    return res.status(201).json({
      message: "Application submitted successfully",
      success: true,
      application,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error applying for job", success: false });
  }
};

// export const applyJobController = async (req: AuthRequest, res: Response) => {
//   try {
//     const { jobId } = req.params;
//     if (!jobId || !Types.ObjectId.isValid(jobId as string)) {
//       return res
//         .status(400)
//         .json({ message: "Valid Job ID is required", success: false });
//     }

//     const job = await Job.findById(jobId);
//     if (!job) {
//       return res.status(404).json({ message: "Job not found", success: false });
//     }

//     const userId = new Types.ObjectId(req.user?.id as string);

//     // ✅ Fixed: query uses "applicant" (was "applications") to match the schema field
//     const existingApplication = await Application.findOne({
//       job: jobId,
//       applicant: userId,
//     });

//     if (existingApplication) {
//       return res.status(400).json({
//         message: "You have already applied for this job",
//         success: false,
//       });
//     }

//     // ✅ Fixed: create uses "applicant" (was "applications")
//     const application = await Application.create({
//       job: jobId,
//       applicant: userId,
//     });

//     return res.status(201).json({
//       message: "Application submitted successfully",
//       success: true,
//       application,
//     });
//   } catch (error) {
//     return res
//       .status(500)
//       .json({ message: "Error applying for job", success: false });
//   }
// };

// GET /applied-jobs
// userId comes from auth token (set by authMiddleware), no manual input needed
export const getAppliedJobsController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized", success: false });
    }
    const userId = new Types.ObjectId(req.user.id);

    const applications = await Application.find({ applicant: userId })
      .populate({
        path: "job",
        populate: { path: "company" },
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Applied jobs fetched successfully",
      success: true,
      applications,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching applied jobs", success: false });
  }
};

// GET /applicants/:jobId
// jobId comes from URL params (recruiter views a specific job's applicants)
// export const getApplicantsController = async (
//   req: AuthRequest,
//   res: Response,
// ) => {
//   try {
//     const { jobId } = req.params;

//     if (!Types.ObjectId.isValid(jobId as string)) {
//       return res.status(400).json({ message: "Invalid jobId", success: false });
//     }
//     const jobObjectId = new Types.ObjectId(jobId as string);

//     const job = await Job.findById(jobObjectId);
//     if (!job) {
//       return res.status(404).json({ message: "Job not found", success: false });
//     }

//     // ✅ Fixed: populate "applicant" (was "applicant" — correct, but now schema field actually exists)
//     const applications = await Application.find({ job: jobObjectId })
//       .populate("applicant", "-password")
//       .sort({ createdAt: -1 });

//     return res.status(200).json({
//       message: "Applicants fetched successfully",
//       success: true,
//       applications,
//     });
//   } catch (error) {
//     return res
//       .status(500)
//       .json({ message: "Error fetching applicants", success: false });
//   }
// };

export const getApplicantsController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const { jobId } = req.params;

    if (!Types.ObjectId.isValid(jobId as string)) {
      return res.status(400).json({ message: "Invalid jobId", success: false });
    }
    const jobObjectId = new Types.ObjectId(jobId as string);

    const job = await Job.findById(jobObjectId);
    if (!job) {
      return res.status(404).json({ message: "Job not found", success: false });
    }

    // ✅ Fix 2: -userPassword matches your User schema field name
    const applications = await Application.find({ job: jobObjectId })
      .populate("applicant", "-userPassword -__v")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Applicants fetched successfully",
      success: true,
      applications,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching applicants", success: false });
  }
};

// PUT /update-status/:id
// id comes from URL params, status comes from req.body (recruiter selects from dropdown)
// export const updateStatusController = async (
//   req: AuthRequest,
//   res: Response,
// ) => {
//   try {
//     const { id } = req.params;
//     const { status } = req.body;

//     if (!Types.ObjectId.isValid(id as string)) {
//       return res
//         .status(400)
//         .json({ message: "Invalid application id", success: false });
//     }

//     const allowedStatuses = ["pending", "accepted", "rejected"];
//     if (!status || !allowedStatuses.includes(status)) {
//       return res.status(400).json({
//         message: `Status must be one of: ${allowedStatuses.join(", ")}`,
//         success: false,
//       });
//     }

//     const application = await Application.findByIdAndUpdate(
//       new Types.ObjectId(id as string),
//       { status },
//       { new: true },
//     );

//     if (!application) {
//       return res
//         .status(404)
//         .json({ message: "Application not found", success: false });
//     }

//     return res.status(200).json({
//       message: "Application status updated successfully",
//       success: true,
//       application,
//     });
//   } catch (error) {
//     return res
//       .status(500)
//       .json({ message: "Error updating application status", success: false });
//   }
// };

export const updateStatusController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!Types.ObjectId.isValid(id as string)) {
      return res
        .status(400)
        .json({ message: "Invalid application id", success: false });
    }

    const allowedStatuses = ["pending", "accepted", "rejected"];
    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: `Status must be one of: ${allowedStatuses.join(", ")}`,
        success: false,
      });
    }

    // ✅ Fix 3: fetch first and populate job to check ownership
    const existingApplication = await Application.findById(id).populate<{
      job: { _id: Types.ObjectId; createdBy: Types.ObjectId };
    }>("job");

    if (!existingApplication) {
      return res
        .status(404)
        .json({ message: "Application not found", success: false });
    }

    // ✅ Fix 3: only the recruiter who created the job can update status
    if (
      existingApplication.job.createdBy.toString() !== req.user?.id.toString()
    ) {
      return res.status(403).json({
        message:
          "Forbidden: you can only update status for your own job applications",
        success: false,
      });
    }

    const application = await Application.findByIdAndUpdate(
      new Types.ObjectId(id as string),
      { status },
      { new: true },
    );

    return res.status(200).json({
      message: "Application status updated successfully",
      success: true,
      application,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error updating application status", success: false });
  }
};
