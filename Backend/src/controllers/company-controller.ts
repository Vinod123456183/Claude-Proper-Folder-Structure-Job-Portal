import { Request, Response } from "express";
import { Company } from "../models/company-model";
import { User } from "../models/user-model";

interface Params {
  id: string;
}

export const addCompanyController = async (req: Request, res: Response) => {
  try {
    const { companyName } = req.body;

    if (!companyName) {
      return res.status(400).json({
        message: "Company name is required",
        success: false,
      });
    }

    const existingCompany = await Company.findOne({ companyName });

    if (existingCompany) {
      return res.status(400).json({
        message: "Company already exists",
        success: false,
      });
    }

    // create company
    const company = await Company.create({
      companyName,
      userId: (req as any).user.id, // 👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈 bec there was company schema
    });

    return res.status(201).json({
      message: "Company created successfully",
      success: true,
      company,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error while creating company",
      success: false,
    });
  }
};

export const displayAllCompaniesController = async (
  req: Request,
  res: Response,
) => {
  try {
    const companies = await Company.find({});
    return res.status(200).json({
      message: "All companies displayed successfully",
      success: true,
      companies,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Server error while displaying all companies",
      success: false,
    });
  }
};

export const displayCompanyByCompanyID = async (
  req: Request<Params>,
  res: Response,
) => {
  try {
    const companyID = req.params.id;
    const company = await Company.findById(companyID);
    return res.status(200).json({
      message: "Company displayed successfully",
      success: true,
      company,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Server error while displaying company by id",
      success: false,
    });
  }
};

export const displayCompaniesByRecruiterID = async (
  req: Request,
  res: Response,
) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "Recruiter not found",
        success: false,
      });
    }

    const companies = await Company.find({ userId: user._id });

    if (!companies || companies.length === 0) {
      return res.status(404).json({
        message: "No companies found for this recruiter",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Companies fetched successfully",
      success: true,
      count: companies.length,
      companies,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error while fetching companies",
      success: false,
    });
  }
};

export const updateCompanyController = async (req: Request, res: Response) => {
  const companyId = req.params.id;
  const { companyDescription, companyWebsite, companyLogo } = req.body;

  // 🟢 Step 1: fetch first
  const existingCompany = await Company.findById(companyId);

  if (!existingCompany) {
    return res
      .status(404)
      .json({ message: "Company not found", success: false });
  }

  // 🟢 Step 2: ownership check
  const loggedInUserId = (req as any).user.id;
  if (existingCompany.userId.toString() !== loggedInUserId.toString()) {
    return res
      .status(403)
      .json({ message: "Forbidden: not your company", success: false });
  }

  // 🟢 Step 3: now safe to update
  const company = await Company.findByIdAndUpdate(
    companyId,
    { $set: { companyDescription, companyWebsite, companyLogo } },
    { new: true },
  );

  return res
    .status(200)
    .json({ message: "Company updated successfully", success: true, company });
};
