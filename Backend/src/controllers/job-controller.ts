import { Request, Response } from "express";
import { Job } from "../models/job-model";
import { Company } from "../models/company-model";
import mongoose, { Types } from "mongoose";

interface AuthRequest extends Request {
  user?: { id: string };
}

export const createJobController = async (req: AuthRequest, res: Response) => {
  try {
    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      numberOfPositions,
      company,
    } = req.body;

    if (
      !title ||
      !description ||
      !requirements ||
      salary === undefined ||
      !location ||
      !jobType ||
      numberOfPositions === undefined ||
      !company
    ) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }

    const companyId = typeof company === "object" ? company._id : company;

    if (!mongoose.Types.ObjectId.isValid(companyId)) {
      return res
        .status(400)
        .json({ message: "Invalid company ID", success: false });
    }

    const companyExists = await Company.findById(companyId);
    if (!companyExists) {
      return res
        .status(404)
        .json({ message: "Company not found", success: false });
    }

    // 🟢 verify the company belongs to the logged-in recruiter
    if (companyExists.userId.toString() !== req.user?.id.toString()) {
      return res.status(403).json({
        message: "Forbidden: you can only post jobs for your own company",
        success: false,
      });
    }

    const newJob = await Job.create({
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      numberOfPositions,
      company: new Types.ObjectId(companyId),
      createdBy: new Types.ObjectId(req.user?.id),
    });

    return res.status(201).json({
      message: "Job created successfully",
      success: true,
      job: newJob,
    });
  } catch (error) {
    console.error("createJobController error:", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};


export const updateJobController = async (req: AuthRequest, res: Response) => {
  try {
    const jobId = req.params.id as string;
    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      numberOfPositions,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({
        message: "Invalid job ID",
        success: false,
      });
    }

    // 🟢 fetch first to verify ownership
    const existingJob = await Job.findById(jobId);

    if (!existingJob) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }

    // 🟢 ownership check
    if (existingJob.createdBy.toString() !== req.user?.id.toString()) {
      return res.status(403).json({
        message: "Forbidden: you can only update your own jobs",
        success: false,
      });
    }

    // 🟢 now safe to update
    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      {
        $set: {
          title,
          description,
          requirements,
          salary,
          location,
          jobType,
          numberOfPositions,
        },
      },
      { new: true },
    );

    return res.status(200).json({
      message: "Job updated successfully",
      success: true,
      job: updatedJob,
    });
  } catch (error) {
    console.error("Update Job Error:", error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

export const getAllJobsController = async (req: Request, res: Response) => {
  try {
    // ✅ FIX: Added .populate("company") so company object is returned instead of just an ID
    const jobs = await Job.find({}).populate("company");

    return res.status(200).json({
      message: "Jobs fetched successfully",
      success: true,
      jobs,
    });
  } catch (error) {
    console.error("Get All Jobs Error:", error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

export const getJobsByCompanyController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const companyId = req.params.companyId as string;

    if (!mongoose.Types.ObjectId.isValid(companyId)) {
      return res.status(400).json({
        message: "Invalid company ID",
        success: false,
      });
    }

    const companyExists = await Company.findById(companyId);
    if (!companyExists) {
      return res.status(404).json({
        message: "Company not found",
        success: false,
      });
    }

    const jobs = await Job.find({ company: companyId })
      .populate("company")
      .populate("createdBy", "-userPassword -__v") // 🟢 exclude password
      .populate("applications");

    if (!jobs || jobs.length === 0) {
      return res.status(404).json({
        message: "No jobs found for this company",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Jobs fetched successfully",
      success: true,
      jobs,
    });
  } catch (error) {
    console.error("Get Job By Company Error:", error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

export const getJobByIdController = async (req: Request, res: Response) => {
  try {
    const jobId = req.params.jobId as string;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({
        message: "Invalid job ID",
        success: false,
      });
    }

    const job = await Job.findById(jobId)
      .populate("company")
      .populate("createdBy", "-userPassword -__v") // 🟢 exclude password
      .populate("applications");

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Job fetched successfully",
      success: true,
      job,
    });
  } catch (error) {
    console.error("Get Job By ID Error:", error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};